import React,{Component, Fragment} from 'react';
import store from './store'
import axios from 'axios';
import {CHANGE_RECORD_ID,CHANGE_PAGE,CHANGE_TYPE} from './store/actionTypes'
import { Button ,Descriptions,Badge,Comment,List,Row,Form,Input,} from 'antd';


const data = [
  {
    author: 'Han Solo',
    avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
    content: (
      <p>
        We supply a series of design principles, practical patterns and high quality design
        resources (Sketch and Axure), to help people create their product prototypes beautifully and
        efficiently.
      </p>
    ),
  },
  {
    author: 'Han Solo',
    avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
    content: (
      <p>
        We supply a series of design principles, practical patterns and high quality design
        resources (Sketch and Axure), to help people create their product prototypes beautifully and
        efficiently.
      </p>
    ),
  },
];


class Mydetail extends Component{
	constructor(props){
		super(props);
		this.state=store.getState();
		this.state={
			ISBN: '',
			bookname: '',
			id: '',
			intro: '',
			labels: '',
			origin_price: '',
			price: '',
			publisher: '',
			state: '',
			url: '',
			username: '',
			commentlist:[],
			tempcomment:'',
			record_id:this.state.record_id,
			type:this.state.type,
			loguser:this.state.username
		}
	}
	
	componentDidMount(){
		const {record_id} =this.state;
		const {type}=this.state;

		//取得书籍详情
		axios({
			method:'post',
            url:'/api/book_detail',
            data:{
							id:record_id,
							type:type,
            },
			dheaders:{'Content-Type': 'appliation/json;charset=UTF-8'}
		})
		.then((res)=>{

			const temp=res.data
			this.setState({
				ISBN: temp['ISBN'],
				bookname: temp['bookname'],
				id: temp['id'],
				intro: temp['intro'],
				labels: temp['labels'],
				origin_price: temp['origin_price'],
				price: temp['price'],
				publisher: temp['publisher'],
				state: temp['state'],
				url: temp['url'],
				username: temp['username'],
			})
			console.log(this.state)
		}).catch(function(error){console.log(error)})

		//取得评论详情
		if(this.state.type==='sell'){
			axios({
				method:'post',
							url:'/api/get_comments',
							data:{
								record_id:record_id
							},
				dheaders:{'Content-Type': 'appliation/json;charset=UTF-8'}
			})
			.then((res)=>{	
				const temp=res.data
				for(var key in temp){
					const temp1=JSON.parse(temp[key])
				
					const temp2={
						avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
						username:temp1['username'],
						content:temp1['content'],
					}
					this.setState((prevState)=>({
						commentlist: [...prevState.commentlist , temp2]
					}))
				}
				console.log(this.state.commentlist)
			}).catch(function(error){console.log(error)})
	
		}
		
	}
	
	handlestorechange(){
		this.setState(store.getState());
	}

	handledeal=(deal_type)=>{

		const {loguser}=this.state
		const {username}=this.state
		const {type}=this.state
		const {price}=this.state
		const {id}=this.state
		console.log(deal_type)
		axios({
			method:'post',
			url:'/api/deal',
			data:{
				loguser:loguser,
				username:username,
				type:type,
				price:price,
				id:id,
				deal_type:deal_type,
			},
			dheaders:{'Content-Type': 'appliation/json;charset=UTF-8'}
		})
		.then((res)=>{
			const flag=res.data;
			if(flag===1){
				alert('交易记录已更改，请尽快联系发布人完成交易')
			}
			else if(flag===0){
				alert("交易失败")
			}

		}).catch(function(error){console.log(error)})
	}

	handletempchange = e => {
    this.setState({
      tempcomment: e.target.value,
    });
	};


	handlecommentsubmit=()=>{
		const {tempcomment} =this.state;
		const {loguser}=this.state;
		const {record_id}=this.state;
		axios({
			method:'post',
						url:'/api/push_comments',
						data:{
							comment:tempcomment,
							username:loguser,
							id:record_id,
						},
			dheaders:{'Content-Type': 'appliation/json;charset=UTF-8'}
		}).catch(function(error){console.log(error)})
		const temp3={
			avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
			username:loguser,
			content:tempcomment,
		}
		this.setState((prevState)=>({
			commentlist: [...prevState.commentlist , temp3],
			tempcomment:'',
		}))
	}
	handlegoto=()=>{
		window.open("https://book.douban.com/subject_search?search_text="+this.state.ISBN)
	}


	render(){
		return(
			<Fragment>

			<Descriptions title="书籍详情" bordered span={4} >
				<Descriptions.Item label={this.state.bookname} span={4}><img
								width={272}
								alt="logo"
								src={this.state.url}
							/></Descriptions.Item>
				<Descriptions.Item label="发布人"span={1.5}>{this.state.username}</Descriptions.Item>

				<Descriptions.Item label="原价"span={1.5}>{this.state.origin_price}</Descriptions.Item>
				<Descriptions.Item label="交易价格"span={1.5}>{this.state.price}</Descriptions.Item>
				<Descriptions.Item label="出版社" span={1.5}>{this.state.publisher}</Descriptions.Item>
				<Descriptions.Item label="类别" span={1.5}>{this.state.labels}</Descriptions.Item>				
				<Descriptions.Item label="状态" span={1.5}>
					{this.state.state===0 &&"未成交"}
					{this.state.state===1 &&"已成交"}
					{this.state.state===2 &&"已下架"}
				</Descriptions.Item>
				<Descriptions.Item label="ISBN" span={1.5} ><div>{this.state.ISBN}</ div></Descriptions.Item>	
				<Descriptions.Item label="介绍" span={3}>{this.state.intro}</Descriptions.Item>
		

			</Descriptions>
			<Row>
			
			<Button type="primary" style={{marginTop:10,marginLeft:10}} onClick={this.handlegoto}>跳转外部链接</Button>
			{this.state.username!==this.state.loguser &&<Button type="primary" style={{marginTop:10,marginLeft:10}} onClick={this.handledeal.bind(this,"寄送")}>寄送</Button>}
			{this.state.username!==this.state.loguser &&<Button type="primary" style={{marginTop:10,marginLeft:10}} onClick={this.handledeal.bind(this,"线下交易")}>线下交易</Button>}
			</Row>
			{	this.state.type==='sell' &&
				<div>
					<List
						bordered
						className="comment-list"
						header={`${this.state.commentlist.length} replies`}
						itemLayout="horizontal"
						dataSource={this.state.commentlist}
						renderItem={item => (
							<li>
								<Comment
									author={item.username}
									avatar={item.avatar}
									content={item.content}
								/>
							</li>
						)}
					/>
					<Form.Item>
						<Input rows={4} onChange={this.handletempchange} value={this.state.tempcomment} />
					</Form.Item>
					<Form.Item>
						<Button htmlType="submit" onClick={this.handlecommentsubmit} type="primary">
							添加评论
						</Button>
					</Form.Item>
				</div>
			}

			</Fragment>
		)
	}
	
}


export default Mydetail;