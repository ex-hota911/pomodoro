import React, { PropTypes } from 'react'

const Time = ({ time }) => {
  var sec = Math.round(time / 1000);
  var min = Math.floor(sec / 60);
  sec = sec % 60;
  sec = ((sec < 10)? '0':'') + sec;

  document.title = `${min}:${sec}`;

  return (
	<div>
	  {min} : {sec}
	</div>
  );
}

Time.propTypes = {
  // Time in milli sec.
  time : React.PropTypes.number.isRequired
}

export default Time
