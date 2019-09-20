import React,{Component} from 'react';
import {Form,Button,Checkbox,Input,Icon} from 'antd';
import {CHANGE_USER_NAME,CHANGE_PASSWD,CHANGE_TOKEN,CHANGE_REG} from './store/actionTypes'
import store from './store'
import axios from 'axios';
import Myreg from './Register'

const FormItem = Form.Item;
class Mylogin extends Component{
	
	constructor(props){
		super(props);
		this.state=store.getState();
		this.handlestorechange=this.handlestorechange.bind(this)
		store.subscribe(this.handlestorechange);
	}

	handlestorechange(){
		this.setState(store.getState());
	}


  render() {
		if(this.state.register===''){
			return (
				<Form  onSubmit={this.handleSubmit} className="login-form">
					<h1>欢迎登录</h1>
					<FormItem >
					<Input className="username"  value={this.state.username} onChange={this.handleUsernameChange} style={{ width: 300 }} prefix={<Icon type="user" style={{ fontSize: 13 }} />}  placeholder="Username" />
					</FormItem>
					<FormItem >
					<Input.Password className="userpass"  value={this.state.passwd} onChange={this.handleUserpassChange} style={{ width: 300 }} prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="Password" />
					</FormItem>
					<FormItem >
					<Checkbox>记住我</Checkbox>
					<a className="login-form-forgot">忘记密码</a>
							</FormItem>
							<FormItem >
					<Button  type="primary" htmlType="submit" className="login-form-button">
					登录
					</Button>
					<Button onClick={this.handleRegclick} style={{marginLeft:20}}>注册</Button>
					</FormItem>
				</Form>
			)
	}
		else return<Myreg />
    
	}
	//change to register
	handleRegclick=()=>{
		const action={
			type:CHANGE_REG,
			value:'reg'
		}
		store.dispatch(action)
	}

	//login
	handleSubmit=(event)=>{
		event.preventDefault();
		const {username} = this.state;
		const {passwd} =this.state;
		const api_url='/api/login';
		axios({
			method:'post',
			url:api_url,
			data:{
				username:username,
				passwd:passwd
			},
			dheaders:{'Content-Type': 'appliation/json;charset=UTF-8'}
		})
		.then(function (res){
			const flag=res.data;
			//alert(res.data)
			if(flag===true){
				const action={
					type:CHANGE_TOKEN
				}
				store.dispatch(action)
			}else{
				alert("wrong passwd or don't exist this user")
				return 
			}
		}).catch(function(error){console.log(error)})
	}

	//user name change
	handleUsernameChange =(e) =>{
		const action={
			type: CHANGE_USER_NAME,
			value: e.target.value
		};
		store.dispatch(action);
	}

	//passwd change
	handleUserpassChange= (e) =>{
		const action={
			type: CHANGE_PASSWD,
			value: e.target.value
		};
		store.dispatch(action);
	}
}


export default Mylogin;