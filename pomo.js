function TimeComp(props) {
  var sec = Math.round(props.time / 1000);
  var min = Math.floor(sec / 60);
  sec = sec % 60;
  sec = ((sec < 10)? '0':'') + sec;
  // Hack
  document.title = min + ':' + sec;
  return (
	<div>
	  {min} : {sec}
	</div>
  );
};

TimeComp.propTypes = {
  // Time in milli sec.
  time : React.PropTypes.number
}

/**
 * 
 */
function TimeEditor(props) {
  return (
	  <div>
   	    Work:
	    <input type="number" value={props.workTime} onChange={(e) => props.setWork(e.target.value)}/> min
	    Break:
	    <input type="number" value={props.breakTime} onChange={(e) => props.setBreak(e.target.value)}/> min
        <button onClick={() => props.onReset()}>
          Reset
	    </button>
	  </div>
	)
}

TimeEditor.propTypes = {
  workTime: React.PropTypes.string,
  breakTime: React.PropTypes.string,
  onReset: React.PropTypes.func,
  setWork: React.PropTypes.func,
  setBreak: React.PropTypes.func,
}

class Timer {
  constructor(time, onTick, onFinish) {
	this.start = null;
	this.interval = null;
	this.onTick = onTick;
	this.onFinish = onFinish;
	this.remainingTime = time;
  }
  tick() {
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
	this.interval = window.setInterval(() => {this.tick();}, 1000);
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
	  running: isRunning,
	})
  }

  onFinish() {
	console.log('onfinish');
	var time;
	if (this.state.isWork) {
	  time = this.setBreak(this.state.breakTime);
	} else {
	  time = this.setWork(this.state.workTime);
	}
	this.setState({running: false});
	notify(() => {
	  // There is a race condition.
	  this.timer.startTimer();
	});
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

  reset() {
	this.timer.stopTimer();
	var workTime = parseInt(this.state.formWork, 10);
	var breakTime = parseInt(this.state.formBreak, 10);
	this.setState({
	  workTime: workTime,
	  breakTime: breakTime,
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
		<button onClick={()=>this.pauseResumeClicked()}>
		  {pauseResume}
        </button>
		<button onClick={()=>this.startWork()}>
		  {startWork}
		</button>
		<TimeEditor label="Work" 
	                workTime={this.state.formWork}
	                breakTime={this.state.formBreak}
  	                setWork={(value) => {this.setState({formWork: value});}}
  	                setBreak={(value) => {this.setState({formBreak: value});}}
	                onReset={this.reset.bind(this)} 
		/>
	  </div>
	);
  }
}


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

function notify(onclick) {
  if (!supportNotification || Notification.permission !== "granted") {
	console.error('permission is not granted.');
	return;
  }
  var options = {
	requireInteraction: true,
  }
  var notif = new Notification("Hi there!", options);
  notif.onclick = function(e) {
	onclick(e);
	notif.close();
	window.focus();
  }
}

// Render
ReactDOM.render(
  <App />,
  document.getElementById('container')
);
