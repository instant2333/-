import React,{Component} from 'react';
import {Form,Input,Icon,Select,Button,} from 'antd';
import {CHANGE_USER_NAME,CHANGE_PASSWD,CHANGE_CONFIRM_PASSWD,CHANGE_EMAIL_PASSWD,CHANGE_REG,RESET} from './store/actionTypes'
import store from './store'
import axios from 'axios';
const FormItem = Form.Item;
const { Option } = Select;
class Myreg extends Component{
    constructor(props){
		super(props);
		this.state=store.getState();
		this.handlestorechange=this.handlestorechange.bind(this)
		store.subscribe(this.handlestorechange);
	}
	handlestorechange(){
		this.setState(store.getState());
	}
	

	handleConfirmBlur = e => {
		const { value } = e.target;
		this.setState({ confirmDirty: this.state.confirmDirty || !!value });
	};
	
	compareToFirstPassword = (rule, value, callback) => {
		const { form } = this.props;
		if (value && value !== form.getFieldValue('password')) {
		  callback('Two passwords that you enter is inconsistent!');
		} else {
		  callback();
		}
	};
	
	validateToNextPassword = (rule, value, callback) => {
		const { form } = this.props;
		if (value && this.state.confirmDirty) {
		  	form.validateFields(['confirm'], { force: true });
		}
		callback();
	};

    render(){
		const { getFieldDecorator } = this.props.form;
		const { autoCompleteResult } = this.state;
	
		const formItemLayout = {
		  labelCol: {
			xs: { span: 24 },
			sm: { span: 8 },
		  },
		  wrapperCol: {
			xs: { span: 24 },
			sm: { span: 16 },
		  },
		};
		const tailFormItemLayout = {
		  wrapperCol: {
			xs: {
			  span: 24,
			  offset: 0,
			},
			sm: {
			  span: 16,
			  offset: 8,
			},
		  },
		};
		const prefixSelector = getFieldDecorator('prefix', {
		  initialValue: '86',
		})(
		  <Select style={{ width: 70 }}>
			<Option value="86">+86</Option>
			<Option value="87">+87</Option>
		  </Select>,
		);
	
      	return(
        <Form  onSubmit={this.handleSubmit} className="login-form">
					<h1>欢迎注册</h1>
					<FormItem >

					<Input className="username"  value={this.state.username} onChange={this.handleUsernameChange} style={{ width: 300 }} prefix={<Icon type="user" style={{ fontSize: 13 }} />}  placeholder="username" />
					</FormItem>
					<FormItem >
						{getFieldDecorator('password', {
							rules: [
							{
								required: true,
								message: 'Please input your password!',
							},
							{
								validator: this.validateToNextPassword,
							},
							],
						})(<Input.Password className="userpass"  value={this.state.passwd} onChange={this.handleUserpassChange} style={{ width: 300 }} prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="password (length>8)" />)}
					
					</FormItem>
					<FormItem >
					{getFieldDecorator('confirm', {
						rules: [
						{
							required: true,
							message: 'Please confirm your password!',
						},
						{
							validator: this.compareToFirstPassword,
						},
						],
					})(<Input.Password className="userpass_confirm"  value={this.state.confirm_passwd} onChange={this.confirmpassChange} style={{ width: 300 }} prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="confirm password (length>8)" onBlur={this.handleConfirmBlur}/>)}
					
					</FormItem>
					<FormItem >
					{
						getFieldDecorator('email', {
							rules: [
							  {
								type: 'email',
								message: 'The input is not valid E-mail!',
							  },
							  {
								required: true,
								message: 'Please input your E-mail!',
							  },
							],
						})
						(<Input className="useremail"  value={this.state.email} onChange={this.handleUseremailChange} style={{ width: 300 }} prefix={<Icon type="mail" style={{ fontSize: 13 }} />} type="mail" placeholder="user email" />)}
					
					</FormItem>
				<FormItem >

				<Button style={{marginLeft:20}} htmlType="submit">注册</Button> 
				<Button onClick={this.handleRegclick} style={{marginLeft:20}}>返回</Button> 
				</FormItem>
			</Form>
      )
		}
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
		confirmpassChange= (e) =>{
			const action={
				type: CHANGE_CONFIRM_PASSWD,
				value: e.target.value
			};
			store.dispatch(action);
		}
		handleUseremailChange= (e) =>{
			const action={
				type: CHANGE_EMAIL_PASSWD,
				value: e.target.value
			};
			store.dispatch(action);
		}
		handleRegclick=(e)=>{
			const action={
				type:CHANGE_REG,
				value:''
			}
			store.dispatch(action)
		}

		handleSubmit=(event)=>{
			event.preventDefault();
			//alert("this is reg")
			const {username} = this.state;
			const {passwd} =this.state;
			const {confirm_passwd} =this.state;
			const {email} =this.state;

			
			const api_url='/api/reg';
			axios({
				method:'post',
				url:api_url,
				data:{
					username:username,
					passwd:passwd,
					confirm_passwd:confirm_passwd,
					email:email
				},
				dheaders:{'Content-Type': 'appliation/json;charset=UTF-8'}
			})
			.then(function (res){
				const flag=res.data;
				//alert(res.data)

				if(flag===1){
					alert('输入密码不一致')
				}
				else if(flag===2){
					alert("邮箱格式错误")
				}
				else if(flag===3){
					alert("用户名已存在")
				}
				else if(flag===4){
					alert("请填写完整表单")
				}
				else if(flag===5){
					alert("密码长度过短")
				}
				else if(flag===0){
					alert("注册成功")
					const action={
						type:RESET
					}
					store.dispatch(action)
				}
			}).catch(function(error){console.log(error)})
		}
    

}


export default Form.create()(Myreg);