import { List, Avatar } from 'antd';
import React,{Component} from 'react';
import store from './store'
import axios from 'axios';
import {CHANGE_RECORD_ID,CHANGE_PAGE,CHANGE_TYPE} from './store/actionTypes'
import { Button } from 'antd/lib/radio';





class Myorder extends Component{
	constructor(props){
		super(props);
		this.state=store.getState();
		this.handlestorechange=this.handlestorechange.bind(this)
		store.subscribe(this.handlestorechange);
		this.state={
            listData:[],
            username:this.state.username
		}
	}
	
	handlestorechange(){
		this.setState(store.getState());
	}


	componentDidMount(){
    const api_url='/api/user_order'
    const {username} =this.state;
		axios({
			method:'post',
            url:api_url,
            data:{
                username:username
            },
			dheaders:{'Content-Type': 'appliation/json;charset=UTF-8'}
		})
		.then((res)=>{

			const temp=res.data
			for(var key in temp){
				const temp1=JSON.parse(temp[key])
				console.log(temp1['bookname'])
				const temp2={
					avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
					bookname:temp1['bookname'],
					img_src:temp1['url'],
                    id:temp1['id'],
                    state:temp1['state'],
                    type:temp1['type'],
                    price:temp1['price'],
				}
				this.setState((prevState)=>({
					listData: [...prevState.listData , temp2]
				}))
				console.log(this.state.listData)
			}
		}).catch(function(error){console.log(error)})
	}

	handleclick(index){
		const action={
			type:CHANGE_PAGE,
			value:5
		}
		store.dispatch(action)
		const action1={
			type:CHANGE_RECORD_ID,
			value:this.state.listData[index]['id']
		}
		store.dispatch(action1)
		const action2={
			type: CHANGE_TYPE,
			value: this.state.listData[index]['type']
		}
		store.dispatch(action2)
	}


	handledel(index){
		const id=this.state.listData[index]['id']
		const type=this.state.listData[index]['type']
		const api_url='/api/del_order';
    axios({
      method:'post',
      url:api_url,
      data:{
				id:id,
				type:type,
      },
      dheaders:{'Content-Type': 'appliation/json;charset=UTF-8'}
    })
    .then(function (res){
      const flag=res.data;
      //alert(res.data)

      if(flag===1){
        alert('撤销失败')
      }
      else if(flag===0){
        alert("撤销成功")
      }
    }).catch(function(error){console.log(error)})
	}
  render(){
		return(
			<List
				itemLayout="vertical"
				size="large"
				pagination={{
					onChange: page => {
						console.log(page);
					},
					pageSize: 4,
				}}
				dataSource={this.state.listData}
				footer={
					<div> footer part</div>
				}
				renderItem={(item,index) => (
					<List.Item
						key={item.id}
						extra={
							<img
								width={272}
								alt="logo"
								src={item.img_src}
							/>
            }
            actions={[<a>
							<Button onClick={this.handleclick.bind(this,index)}>详情</Button>
							{item.state===0 &&<Button onClick={this.handledel.bind(this,index)}style={{marginLeft:40}}>撤销订单</Button>}
							</a>
						]}
					>
						<List.Item.Meta
							avatar={<Avatar src={item.avatar} />}
							title={<a>
							{item.type==='buy'&&<b>买   </b>}
							{item.type==='sell'&&<b>卖   </b>}
							<b>《{item.bookname}》</b>  
							<b>￥{item.price}</b>  </a>}
							description={
							<a>
							{item.state===0 &&<b>未成交</b>}
							{item.state===1 &&<b>已成交</b>}
							{item.state===2 &&<b>已撤销</b>}
							</a>}
						/>
						{item.content}
					</List.Item>
				)}
			/>
		)
  }
}


export default Myorder;