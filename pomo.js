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

class TimeEditor extends React.Component {
  constructor() {
	super();
	this.state = {value: 25};
  }
  reset() {
  }
  handleChange(event) {
    this.setState({value: parseInt(event.target.value, 10)});
  }
  render() {
	return (
	  <div>
		<input type="number" value={this.state.value} onChange={(e) => this.handleChange(e)}/> min
        <button onClick={() => this.props.onReset(this.state.value)}>
		  Reset
	    </button>
        <button onClick={() => this.props.onReset(0.05)}>
		  3 sec
	    </button>
	  </div>
	)
  }
}

// props
// {number} time Count down original time in sec.
// state
// {number} remaningTime Count down time from the original in millis.
// {?number} start When the timer started.
// {?number} interval The ID of setInterval.
class Timer extends React.Component {
  constructor(props) {
	super(props);
	this.state = {
	  remaningTime: this.props.time * 1000,
	};
  }
  reset() {
	this.setState({
	  remaningTime: this.props.time * 1000,
	  start: null,
	  interval: null,
	});
  }
  tick() {
	var time = this.getTime();
	if (time == 0) {
	  this.stopTimer();
	  
	  notify(() => this.reset());
	  return;
	}
	this.forceUpdate();
  }
  getTime() {
	if (this.isRunning()) {
	  return Math.max(this.state.start + this.state.remaningTime - new Date().getTime(), 0);
	} else {
	  return this.state.remaningTime;
	}
  }
  toggleTimer() {
	if (this.state.interval) {
	  this.stopTimer();
	} else {
	  this.startTimer();
	}
  }
  startTimer() {
	let interval = window.setInterval(() => {this.tick();}, 1000);
	var state = {
	  interval: interval,
	  start: new Date().getTime()
	};
	if (this.state.remaningTime == 0) {
	  state.remaningTime = this.props.time * 1000;
	}
	this.setState(state);
  }
  stopTimer() {
	if (!this.isRunning()) return;
	window.clearInterval(this.state.interval);
	var time = this.getTime();
	this.setState({
	  remaningTime: time,
	  interval: null,
	  start: null
	});
  }
  isRunning() {
	return !!this.state.interval;
  }
  componentWillReceiveProps(nextProps) {
	this.stopTimer();
	this.setState({remaningTime : nextProps.time * 1000})
  }
  render() {
	var message = (this.state.interval)? 'Stop timer':'Start timer';
	var time = this.getTime();
	// Hack
	return (
	  <div>
		<TimeComp time={time}/>
		<button onClick={() => this.toggleTimer()}>
		  {message}
		</button>
      </div>
	);
  }
}

// props
// {number} time Count down original time in sec.
// state
// {number} remaningTime Count down time from the original in millis.
// {?number} start When the timer started.
// {?number} interval The ID of setInterval.
class Timer2 extends React.Component {
  constructor(props) {
	super(props);
	this.timer_ = new Timer(this.props.time, () => this.forceUpdate());
  }
  toggleTimer() {
	if (this.timer_.isRunning()) {
	  this.timer_.stopTimer();
	} else {
	  this.timer_.startTimer();
	}
  }
  componentWillReceiveProps(nextProps) {
	this.timer_.stopTimer();
	this.setState({remaningTime : nextProps.time * 1000})
  }
  render() {
	var message = this.timer_.isRunning() ? 'Stop timer':'Start timer';
	var time = this.timer_.getTime();
	return (
	  <div>
		<TimeComp time={time}/>
		<button onClick={() => this.toggleTimer()}>
		  {message}
		</button>
      </div>
	);
  }
}

class App extends React.Component {
  constructor() {
	super();
	this.state = {
	  time : 25 * 60
	};
  }
  render() {
	var time = this.state.time;
	return (
	  <div>
		<Timer time={time}/> 
		<TimeEditor onReset={(newTime) => {this.setState({time: newTime*60});}}/>
	  </div>
	);
  }
}


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

ReactDOM.render(
  <App />,
  document.getElementById('container')
);
