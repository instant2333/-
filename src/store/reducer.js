import {CHANGE_USER_NAME,CHANGE_PASSWD,CHANGE_TOKEN,CHANGE_REG,CHANGE_CONFIRM_PASSWD,CHANGE_EMAIL_PASSWD,RESET,CHANGE_PAGE,CHANGE_RECORD_ID,CHANGE_TYPE} from './actionTypes'
const defaultState={
  username:'',
  passwd: '',
  confirm_passwd:'',
  email:'',
  token:'',
  register:'',
  record_id:'',
  menupage:1,
  type:''

}
export default(state=defaultState,action)=>{
	if(action.type===CHANGE_USER_NAME){
		const newState=JSON.parse(JSON.stringify(state))
		newState.username=action.value
		return newState
	}
	else if(action.type===CHANGE_PASSWD){
		const newState=JSON.parse(JSON.stringify(state))
		newState.passwd=action.value
		return newState
	}
	else if(action.type===CHANGE_TOKEN){
		const newState=JSON.parse(JSON.stringify(state))
		newState.token='login'
		return newState
	}
	else if(action.type===CHANGE_REG){
		const newState=JSON.parse(JSON.stringify(state))
		newState.register=action.value
		return newState
	}
	else if(action.type===CHANGE_CONFIRM_PASSWD){
		const newState=JSON.parse(JSON.stringify(state))
		newState.confirm_passwd=action.value
		return newState
	}
	else if(action.type===CHANGE_EMAIL_PASSWD){
		const newState=JSON.parse(JSON.stringify(state))
		newState.email=action.value
		return newState
	}
	else if(action.type===CHANGE_PAGE){
		const newState=JSON.parse(JSON.stringify(state))
		newState.menupage=action.value
		return newState
	}
	else if(action.type===CHANGE_RECORD_ID){
		const newState=JSON.parse(JSON.stringify(state))
		newState.record_id=action.value
		return newState
	}
	
	else if(action.type===CHANGE_TYPE){
		const newState=JSON.parse(JSON.stringify(state))
		newState.type=action.value
		return newState
	}
	else if(action.type===RESET){
		const newState=JSON.parse(JSON.stringify(defaultState))
		return newState
	}
	return state
}