import { List, Avatar ,Input,Button} from 'antd';
import React,{Component, Fragment} from 'react';
import store from './store'
import axios from 'axios';
import {CHANGE_RECORD_ID,CHANGE_PAGE,CHANGE_TYPE} from './store/actionTypes'



const {Search}=Input

class Mymarketbuy extends Component{
	constructor(props){
		super(props);
		this.state=store.getState();
		this.handlestorechange=this.handlestorechange.bind(this)
		store.subscribe(this.handlestorechange);
		this.state={
			listData:[],
			page:1,
			search_book_name:'',
		}
	}
	
	handlestorechange(){
		this.setState(store.getState());
	}


	componentDidMount(){
		const api_url='/api/market_sell_data'
		axios({
			method:'get',
			url:api_url,
			dheaders:{'Content-Type': 'appliation/json;charset=UTF-8'}
		})
		.then((res)=>{

			const temp=res.data
			for(var key in temp){
				const temp1=JSON.parse(temp[key])
				const temp2={
					avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
					bookname:temp1['bookname'],
					username:temp1['seller'],
					intro:temp1['intro'],
					img_src:temp1['url'],
					id:temp1['id'],
					sell_price:temp1['sell_price'],
				}
				this.setState((prevState)=>({
					listData: [...prevState.listData , temp2]
				}))
			}
			
			
		}).catch(function(error){console.log(error)})
	}

	handleclick(index){
		const index1=index+this.state.page*4-4
		console.log(index1)
		const action={
			type:CHANGE_PAGE,
			value:5
		}
		store.dispatch(action)
		const action1={
			type:CHANGE_RECORD_ID,
			value:this.state.listData[index1]['id']
		}
		store.dispatch(action1)
		const action2={
			type: CHANGE_TYPE,
			value: 'sell'
		}
		store.dispatch(action2)
	}
	handle_search_cahnge=e=>{
		this.setState({
			search_book_name:e.target.value
		})
	}
	handlesubmit=()=>{
		const {search_book_name}=this.state
		this.setState({

			listData:[]
		})
		axios({
			method:'post',
			url:'/api/search_book',
			data:{
				search_book_name:search_book_name
			},
			dheaders:{'Content-Type': 'appliation/json;charset=UTF-8'}
		})
		.then((res)=>{

			const temp=res.data
			for(var key in temp){
				const temp1=JSON.parse(temp[key])
				const temp2={
					avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
					bookname:temp1['bookname'],
					username:temp1['seller'],
					intro:temp1['intro'],
					img_src:temp1['url'],
					id:temp1['id'],
					sell_price:temp1['sell_price'],
				}
				this.setState((prevState)=>({
					listData: [...prevState.listData , temp2]
				}))
			}
			
			
		}).catch(function(error){console.log(error)})


	}




  render(){
		return(
			<Fragment>
				<Search
					placeholder="请输入搜索书名"
					enterButton="Search"
					size="large"
					value={this.state.search_book_name}
					onChange={this.handle_search_cahnge}
					onSearch={this.handlesubmit}
				/>
				<List
					style={{marginTop:10}}
					itemLayout="vertical"
					size="large"
					pagination={{
						onChange: page => {
							this.setState({
								page:page
							})
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
							extra={
								<img
									width={272}
									alt="logo"
									src={item.img_src}
								/>
							}
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
			</Fragment>
		)
  }
}


export default Mymarketbuy;