import { Layout, Menu, Icon ,Breadcrumb,PageHeader } from 'antd';
import React,{Component,Fragment} from 'react';
import {CHANGE_PAGE} from './store/actionTypes'
import Mysell from './Mysell';
import Mybuy from './Mybuy';
import store from './store';
import Mymarketbuy from './Mymarketbuy'
import Mymarketsell from './Mymarketsell'
import Myorder from './Myorder'
import Mydetail from './Mydetail'
const {  Sider } = Layout;
const { SubMenu } = Menu;

class MyMenu extends Component {
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
    collapsed: false,
    page: 0
  };

  onCollapse = collapsed => {
    console.log(collapsed);
    this.setState({ collapsed });
  };

  render() {
    return (
      <Fragment>
      <PageHeader  title="欢迎!" subTitle={this.state.username} />
      <Layout style={{ minHeight: '100vh' }}>
        
        <Sider collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse}>
          <div className="logo" />
          <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
            <SubMenu
              key="sub1"
              title={
                <span>
                  <Icon type="pie-chart" />
                  <span>市场</span>
                </span>
              }
            >
            
            <Menu.Item key="1" onClick={()=>this.pagechange(1)} >买书</Menu.Item>
            <Menu.Item key="6" onClick={()=>this.pagechange(6)} >卖书</Menu.Item>
            </SubMenu>
            <SubMenu
              key="sub2"
              title={
                <span>
                  <Icon type="appstore" />
                  <span>发布信息</span>
                </span>
              }
            >
              <Menu.Item key="2" onClick={()=>this.pagechange(2)}>出售书籍</Menu.Item>
              <Menu.Item key="3" onClick={()=>this.pagechange(3)}>求购书籍</Menu.Item>
            </SubMenu>
            <Menu.Item  key="4"  onClick={()=>this.pagechange(4)}>
              <Icon type="unordered-list" />
              <span >我的订单</span>
            </Menu.Item>
          </Menu>

        </Sider> 
        <Layout>
        {this.state.menupage===1 &&<Mymarketbuy />}
        {this.state.menupage===6 &&<Mymarketsell />}
        {this.state.menupage===2 &&<Mysell />}
        {this.state.menupage===3 &&<Mybuy />}
        {this.state.menupage===4 &&<Myorder />}
        {this.state.menupage===5 &&<Mydetail />}
        </Layout>
      </Layout>
      </Fragment>
    );
  }
  pagechange=(key)=>{
    const action={
			type:CHANGE_PAGE,
			value:key
		}
		store.dispatch(action)
  }
}

export default MyMenu;