import { combineReducers } from 'redux'
import reduceReducers from 'reduce-reducers'

const working = (state = true, action) => {
  switch (action.type) {
	case 'FINISH':
	  return !state;
	case 'START_WOKING'
	  return true;
	default:
	  return state;
  }
}

const running = (state = true, action) => {
  switch (action.type) {
	case 'PAUSE':
	  return false;
    case 'START':
	  return true;
	default:
	  return state;
  }
}

const setting = (state = {workTime: 25, breakTime: 5, editing: false}, action) => {
  switch (action.type) {
	case 'START_EDITING':
	  return Object.assign({}, state, {editing: true});
	case 'SAVE':
	  return Object.assign({}, state, action.payload, {editing: false});
    default:
	  return state;
  }
}

const combined = combineReducers({
  working,
  running,
  setting
})

const remainingTime = (state, action) => {
  if (action === undefined) {
  }
  switch (action.type) {
	case 'TICK':
	  return Object.assign({}, state, {remainingTime: action.payload});
	case 'FINISH':
	  // Working is already updated.
	  if (state.working) {
		return state.setting.workTime * 60 * 1000;
	  } else {
		return state.setting.breakTime * 60 * 1000;
	  }
	default:
	  return state;
  }
}

const reducer = (state, action) {
  Object.assing({}, combined(state, action), {remainingTime: remainingTime(state, action)});
}

export default reducer
