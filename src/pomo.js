import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

function UpdateHead(min, sec) {
  document.title = `${min}:${sec}`;

  if (sec == 0 || sec == 59) {
	var link = document.querySelector("link[rel*='icon']") || document.createElement('link');
	link.type = 'image/x-icon';
	link.rel = 'shortcut icon';
	link.href = `/img/${min}.svg`;
	document.getElementsByTagName('head')[0].appendChild(link);
  }
}

function TimeComp(props) {
  var sec = Math.round(props.time / 1000);
  var min = Math.floor(sec / 60);
  sec = sec % 60;
  sec = ((sec < 10)? '0':'') + sec;
  // Hack
  UpdateHead(min, sec);
  return (
	<div>
	  {min} : {sec}
	</div>
  );
};

TimeComp.propTypes = {
  // Time in milli sec.
  time : React.PropTypes.number
};

/**
 * Stateful editor.
 */
class TimeEditor extends React.Component {
  constructor () {
	super();
	this.state = {
	  workValue: '25',
	  breakValue: '5'
	};
  }
  render() {
	var props = this.props;
	return (
	  <div>
		<div>
		  Work:
		  <input type="number" value={this.state.workValue} onChange={(e) => {this.setState({workValue : e.target.value});}}/> 

		  min
		</div>
		<div>
		  Break:
		  <input type="number" value={this.state.breakValue} onChange={(e) => this.setState({breakValue : e.target.value})}/>
		  min
		</div>
		<button onClick={() => {this.props.onReset(this.state.workValue, this.state.breakValue);}}>
		  Reset
		</button>
</div>
	);
  }
}

TimeEditor.propTypes = {
  onReset: React.PropTypes.func
};

class Timer {
  constructor(time, onTick, onFinish) {
	this.start = null;
	this.interval = null;
	this.onTick = onTick;
	this.onFinish = onFinish;
	this.remainingTime = time;
  }
  tick_() {
	var time = this.getTime();
	if (time == 0) {
	  this.stopTimer();
	  this.onFinish();
	} else {
	  this.onTick(time, this.isRunning());
	}
  }
  getTime() {
	if (this.isRunning()) {
	  return Math.max(this.start + this.remainingTime - new Date().getTime(), 0);
	} else {
	  return this.remainingTime;
	}
  }
  setTime(time) {
	if (this.isRunning()) {
	  console.error('Timer is running');
	  return;
	}
	this.remainingTime = time;
  }
  startTimer() {
	console.log(this.remainingTime);
	if (this.isRunning()) {
	  console.error('Timer is already started');
	  return;
	}
	if (this.getTime() == 0) {
	  console.error('Timer is already finished');
	  this.onFinish();
	  return;
	}
	this.interval = window.setInterval(this.tick_.bind(this), 1000);
	this.start = new Date().getTime();

	console.log(this.getTime());
	this.onTick(this.getTime(), true);
  }
  stopTimer() {
	if (!this.isRunning()){
	  console.error('Timer is already stopped');
	  return;
	}
	this.remainingTime = this.getTime();
	console.log(this.remainingTime);
	window.clearInterval(this.interval);
	this.interval = null;
	this.start = null;

	this.onTick(this.remainingTime, false);
	console.log(this.remainingTime);
  }
  isRunning() {
	return !!this.interval;
  }
}

function History(props) {
  return (
	<table>
	  <tbody>
		<tr>
		  <td> Today </td>
		  <td> {props.today} </td>
		</tr>
	  </tbody>
	</table>
  );
};

class App extends React.Component {
  constructor() {
	super();
	this.state = {
	  workTime: 25,
	  breakTime: 5,
	  formWork: '-3',
	  formBreak: '-2',
	  timeInMillis: 25 * 60 * 1000,
	  isWork: true,
	  running: false,
	  today: 0
	};
	this.timer = new Timer(this.state.timeInMillis, this.tick.bind(this), this.onFinish.bind(this));
  }

  setState(state) {
	React.Component.prototype.setState.call(this, state);
	console.log(state);
  }

  tick(time, isRunning) {
	this.setState({
	  timeInMillis: time,
	  running: isRunning
	});
  }

  onFinish() {
	var message;
	if (this.state.isWork) {
	  this.setBreak(this.state.breakTime);
	  this.setState({today: this.state.today + 1});
	  message = 'Time for break!';
	} else {
	  this.setWork(this.state.workTime);
	  message = 'Time for work!';
	}
	notify(message, () => {this.timer.startTimer();});
  }

  setWork(workTime) {
	var timeInMillis = workTime * 60 * 1000;
	// For debugging.
	if (workTime < 0) {
	  timeInMillis = workTime * -1000;
	}
	this.setState({
	  isWork: true,
	  timeInMillis: timeInMillis
	});
	this.timer.setTime(timeInMillis);
	return timeInMillis;
  }
  setBreak(breakTime) {
	var timeInMillis = breakTime * 60 * 1000;
	// For debugging.
	if (breakTime < 0) {
	  timeInMillis = breakTime * -1000;
	}
	this.setState({
	  isWork: false,
	  timeInMillis: timeInMillis
	});
	this.timer.setTime(timeInMillis);
	return timeInMillis;
  }
  startWork() {
	if (this.state.running) {
	  this.timer.stopTimer();
	}
	this.setWork(this.state.workTime);
	this.timer.startTimer();
  }

  pauseResumeClicked() {
	console.log('pauseResumeClicked');
	if (this.state.running) {
	  this.timer.stopTimer();
	} else {
	  this.timer.startTimer();
	}
  }

  reset(workValue, breakValue) {
	if (this.state.running) {
	  this.timer.stopTimer();
	}
	var workTime = parseInt(workValue, 10);
	var breakTime = parseInt(breakValue, 10);
	this.setState({
	  workTime: workTime,
	  breakTime: breakTime
	});
	this.setWork(workTime);
  }

  setStateKeyValue(key, value) {
	var state = {};
	state[key] = value;
	this.setState(state);
  }

  render() {
	var time = this.state.time;
	console.log(this.state);
	console.log(this.timer);
	var pauseResume = (this.state.running) ? 'Pause' : 'Resume';
	var startWork = (this.state.isWork) ? 'Restart' : 'Start work.';
	var stateClass = (this.state.isWork) ? 'work' : 'break';
	return (
	  <div className={stateClass}>
		<TimeComp time={this.state.timeInMillis}/>
		<button onClick={()=>{this.pauseResumeClicked();}}> {pauseResume} </button>
		<button onClick={()=>{this.startWork();}}>  {startWork} </button>
		<TimeEditor onReset={this.reset.bind(this)} />
		<History today={this.state.today} />
	  </div>
	);
  }
}

const MuiApp = () => (
  <MuiThemeProvider>
	<App />
  </MuiThemeProvider>
);


// Notifications
var supportNotification = "Notification" in window;
function maybeGetPermission() {
  if (!supportNotification) {
	return;
  } 
  if (Notification.permission === "granted") {
	return;
  }
  Notification.requestPermission();
}

maybeGetPermission();

function notify(message, onclick) {
  if (!supportNotification || Notification.permission !== "granted") {
	console.error('permission is not granted.');
	return null;
  }
  var options = {
	requireInteraction: true,
	tag: 'pomodoro-notification'
  };
  var notif = new Notification(message, options);
  notif.onclick = function(e) {
	onclick(e);
	notif.close();
	window.focus();
  };
  return notif;
};

// Render
ReactDOM.render(
  <MuiApp />,
  document.getElementById('container')
);

