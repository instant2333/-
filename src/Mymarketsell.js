import { List, Avatar } from 'antd';
import React,{Component} from 'react';
import store from './store'
import axios from 'axios';
import {CHANGE_RECORD_ID,CHANGE_PAGE,CHANGE_TYPE} from './store/actionTypes'





class Mymarketsell extends Component{
	constructor(props){
		super(props);
		this.state=store.getState();
		this.handlestorechange=this.handlestorechange.bind(this)
		store.subscribe(this.handlestorechange);
		this.state={
			listData:[]
		}
	}
	
	handlestorechange(){
		this.setState(store.getState());
	}


	componentDidMount(){
		const api_url='/api/market_buy_data'
		axios({
			method:'get',
			url:api_url,
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
					username:temp1['buyer'],
					id:temp1['id'],
					sell_price:temp1['buy_price'],
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
            value: 'buy'
        }
        store.dispatch(action2)
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
						onClick={this.handleclick.bind(this,index)}
						key={item.username}
					>
						<List.Item.Meta
							avatar={<Avatar src={item.avatar} />}
							title={<a><b>{item.username}</b>   《{item.bookname}》<b>￥{item.sell_price}</b></a>}
							description={item.intro}
							
						/>
						{item.content}
					</List.Item>
				)}
			/>
		)
  }
}


export default Mymarketsell;