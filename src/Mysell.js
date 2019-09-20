import React,{Component} from 'react';
import {Form,Input,Button,Upload, Icon,} from 'antd';
import {} from './store/actionTypes'
import store from './store'
import axios from 'axios';
import {CHANGE_PAGE} from './store/actionTypes'



class Mysell extends Component{
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
		origin:'',
		sellprice:'',
		labels:'',
		intro:'',
		ISBN:'',
    publisher:'',
    fileList:'',
    image_url:'',
  };

  handleSubmit = e => {
    e.preventDefault();
    alert("submit");
    const {bookname} = this.state;
    const {origin} =this.state;
    const {sellprice} =this.state;
    const {labels} =this.state;
    const {intro} = this.state;
    const {ISBN} =this.state;
    const {publisher} =this.state;
    const {username} =this.state;
    const {image_url}=this.state;
    
    const api_url='/api/submit_sell';
    axios({
      method:'post',
      url:api_url,
      data:{
        bookname:bookname,
        origin:origin,
        sellprice:sellprice,
        labels:labels,
        intro:intro,
        ISBN:ISBN,
        publisher:publisher,
        username:username,
        image_url:image_url,
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
        alert("售价不能为空")
      }
      else if(flag===3){
        alert("ISBN不能为空")
      }
      else if(flag===4){
        alert("售价必须为数字")
      }
      else if(flag===5){
        alert("请上传书籍封面")
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
	originchange=(e)=>{
		this.setState({
			origin: e.target.value
		})
	}
	pricechange=(e)=>{
		this.setState({
			sellprice: e.target.value
		})
  }
  labelchange=(e)=>{
		this.setState({
			labels: e.target.value
		})
  }
  introchange=(e)=>{
		this.setState({
			intro: e.target.value
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
  uploadMibfiles = file =>{
    this.fileList = file;
  }
  customRequest = (option)=> {
    const formData = new FormData();
    const fileUrl = '/api/upload';
    formData.append('file',option.file);
   
    axios({ /*官网解释：It's AJAX
                  All over again. Includes support
                  for xmlHttpRequest, JSONP, CORS,
                   and CommonJS Promises A.*/
      url: fileUrl,
      method: 'post',
      processData: false,
      data: formData,

    }).then((res)=>{
      const result=res.data
			this.setState({
        image_url:result
      })
		}).catch(function(error){console.log(error)})
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
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };

    return (
      <Form  style={{width:400}}onSubmit={this.handleSubmit}>

        <Form.Item label="书名">
          <Input value={this.state.bookname} onChange={this.booknamechange}/>
        </Form.Item>

        <Form.Item label="原价">
          <Input value={this.state.origin} onChange={this.originchange}/>
        </Form.Item>

        <Form.Item label="售价" >
          <Input value={this.state.sellprice} onChange={this.pricechange} />
        </Form.Item>

        <Form.Item label="书籍标签">
          <Input value={this.state.labels} onChange={this.labelchange}/>
        </Form.Item>

				<Form.Item label="书籍简介">
          <Input value={this.state.intro} onChange={this.introchange} />
        </Form.Item>

				<Form.Item label="ISBN">
          <Input value={this.state.ISBN} onChange={this.ISBNchange} />
        </Form.Item>

				<Form.Item label="出版商">
          <Input value={this.state.publisher} onChange={this.publisherchange} />
        </Form.Item>
        
        <Upload 
        style={{marginRight:20}}
				multiple={false}
				listType='picture'
				beforeUpload={this.uploadMibfiles}
        action='/api/upload'
        customRequest={this.customRequest}

				>
					<Button>
						<Icon type="upload" /> 上传书籍封面
					</Button>
				</Upload>

				

        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">
            提交
          </Button>
        </Form.Item>
      </Form>
    );
  }
}





export default Mysell;