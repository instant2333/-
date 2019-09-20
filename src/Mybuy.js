import React,{Component} from 'react';
import {Form,Input,Button,Layout,} from 'antd';
import store from './store'
import axios from 'axios';
import {CHANGE_PAGE} from './store/actionTypes'


class Mybuy extends Component{
	constructor(props){
		super(props);
		this.state=store.getState();
		this.handlestorechange=this.handlestorechange.bind(this)
		store.subscribe(this.handlestorechange);
	}
	
	handlestorechange(){
		this.setState(store.getState());
	}


	state = {
		bookname:'',
		buyprice:'',
		ISBN:'',
		publisher:''
	};
	handleSubmit = e => {
    e.preventDefault();
    alert("submit");
    const {bookname} = this.state;
    const {buyprice} =this.state;
    const {ISBN} =this.state;
    const {publisher} =this.state;
    const {username} =this.state;
    
    const api_url='/api/submit_buy';
    axios({
      method:'post',
      url:api_url,
      data:{
        bookname:bookname,
        buyprice:buyprice,
        ISBN:ISBN,
        publisher:publisher,
        username:username,
      },
      dheaders:{'Content-Type': 'appliation/json;charset=UTF-8'}
    })
    .then(function (res){
      const flag=res.data;
      //alert(res.data)

      if(flag===1){
        alert('书名不能为空')
      }
      else if(flag===2){
        alert("求购价不能为空")
      }
      else if(flag===3){
        alert("求购价必须为整数")
      }
      else if(flag===0){
        alert("提交成功")
        const action={
          type:CHANGE_PAGE,
          value:'1'
        }
        store.dispatch(action)
      }
    }).catch(function(error){console.log(error)})
  };

	booknamechange=(e)=>{
		this.setState({
			bookname: e.target.value
		})
	}
	pricechange=(e)=>{
		this.setState({
			buyprice: e.target.value
		})
  }
  ISBNchange=(e)=>{
		this.setState({
			ISBN: e.target.value
		})
  }
  publisherchange=(e)=>{
		this.setState({
			publisher: e.target.value
		})
  }





  render() {


    const formItemLayout = {
      labelCol: {
        xs: { span: 0 },
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
          offset: 2,
        },
        sm: {
          span: 16,
          offset: 8,
        },
			},
			
    };

    return (

      <Form {...formItemLayout} onSubmit={this.handleSubmit} >

        <Form.Item label="书名">
          <Input value={this.state.bookname} onChange={this.booknamechange}/>
        </Form.Item>

        <Form.Item label="求购价" >
          <Input value={this.state.buyprice} onChange={this.pricechange} />
        </Form.Item>


				<Form.Item label="ISBN">
          <Input value={this.state.ISBN} onChange={this.ISBNchange} />
        </Form.Item>

				<Form.Item label="出版商">
          <Input value={this.state.publisher} onChange={this.publisherchange} />
        </Form.Item>

				

        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">
            提交
          </Button>
        </Form.Item>
      </Form>
    );
  }
}



export default Mybuy;