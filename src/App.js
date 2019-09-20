import React,{Component} from 'react';
import 'antd/dist/antd.css';
import Mylogin from './Login';
import MyMenu from './Menu';
import store from './store'



//const { SubMenu }  = Menu;


class MyApp extends Component{
  constructor(props){
		super(props);
		this.state =store.getState();
		this.handlestorechange=this.handlestorechange.bind(this)
		store.subscribe(this.handlestorechange);
	}
	handlestorechange(){
		this.setState(store.getState());
	}
	shouldComponentUpdate(){
		if(this.state.token===''){
			return true;
		}
		return false;
	}
  	render(){
		console.log("2d")
    	if(this.state.token === ''){
			return <Mylogin/>
		}else{return<MyMenu/>}
			
  }
}

export default MyApp;
