import React, { Component } from 'react';
import axios from 'axios';
import url from '../url';
import { Link } from 'react-router';
import { Layout, Menu, Select, Button, Dropdown, Modal } from 'antd';
const { Header, Content } = Layout;
const Option = Select.Option;
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            current: "1",
            value: "",
            proOption: [],
            showL: "block"
        }
    }
    componentDidMount() {
        // localStorage.setItem("username", "zhoufa277")
        this.getData();
        switch (this.props.location.pathname) {
            case '/workBench':
                this.setState({ current: '1', showL: "block" })
                break;
            case '/proManage':
                this.setState({ current: '2', showL: "none" })
                break;
            case '/sysManage':
                this.setState({ current: '3', showL: "none" })
                break;
            case '/processCenter':
                this.setState({ current: '4', showL: "block" })
                break;
            case '/deployCenter':
                this.setState({ current: '5', showL: "block" })
                break;
            case '/authorityManage':
                this.setState({ current: '6', showL: "block" })
                break;
            default:
                break;
        }
    }
    getData = () => {
        axios.get(url + '/workspace/get-current-project-by-username', {
            params: {
                userName: localStorage.getItem("username")
            },
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }).then((res) => {
            if (res.data.resCode) {
                if (res.data.resCode === "00") {
                    let value = res.data.data;
                    axios.get(url + '/project-manage/project', {
                        headers: {
                            'X-Requested-With': 'XMLHttpRequest'
                        }
                    }).then((res) => {
                        if (res.data.data && Array.isArray(res.data.data)) {
                            this.setState({ proOption: res.data.data, value})
                            localStorage.setItem('projectId', value)
                        } else {
                            window.location.href = (window.location.origin + window.location.pathname).replace("index.html", "") + "login.html"
                        }
                    }).catch((err) => {
                        console.log(err);
                    })
                }
            } else {
                window.location.href = (window.location.origin + window.location.pathname).replace("index.html", "") + "login.html"
            }
        }).catch((err) => {
            console.log(err);
        })
    }
    componentWillReceiveProps(nextProps) {
        this.getData();
        switch (nextProps.location.pathname) {
            case '/workBench':
                this.setState({ current: '1', showL: "block" })
                break;
            case '/proManage':
                this.setState({ current: '2', showL: "none" })
                break;
            case '/sysManage':
                this.setState({ current: '3', showL: "none" })
                break;
            case '/processCenter':
                this.setState({ current: '4', showL: "block" })
                break;
            case '/deployCenter':
                this.setState({ current: '5', showL: "block" })
                break;
            case '/authorityManage':
                this.setState({ current: '6', showL: "block" })
                break;
            default:
                break;
        }
    }

    showProOption = (arr) => {
        return arr.map((item, i) => {
            return < Option value={item.id} key={i}>{item.name}</Option >
        })
    }
    handleClick = (e) => {
        this.setState({ current: e.key })
    }
    handleChange = (value) => {
        let params = {
            userName:localStorage.getItem("username"),
            projectId:value
        }
        axios.get(url + '/workspace/update-current-project-by-username', {
            params: params,
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }).then((res) => {
            if (res.data.resCode) {
                if (res.data.resCode === "00") {
                    localStorage.setItem('projectId', value)
                    this.setState({ value })
                }else{
                    Modal.warning({
                        title: '警告',
                        content: res.data.resMsg,
                    });
                }
            } else {
                window.location.href = (window.location.origin + window.location.pathname).replace("index.html", "") + "login.html"
            }
        }).catch((err) => {
            console.log(err.status);
        })
    }
    logout = () => {
        console.log('logout')
        axios.get(url + '/logout', {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }).then((res) => {
            window.location.href = (window.location.origin + window.location.pathname).replace("index.html","")+"login.html"
        }).catch((err) => {
            console.log(err.status);
        })
    }
    render() {
        let isShow = {
            display: this.state.showL
        }
        const menu = (
            <Menu style={{textAlign:"center"}}>
                <Menu.Item>
                    <a onClick={this.logout}>登出</a>
                </Menu.Item>
            </Menu>
        );
        return (
            <div style={{ height: '100%' }}>
                <Layout style={{ height: '100%' }}>
                    <Header style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Menu
                            onClick={this.handleClick}
                            theme="dark"
                            mode="horizontal"
                            selectedKeys={[this.state.current]}
                            style={{ lineHeight: '64px' }}
                        >
                            <Menu.Item key="1" ><Link to="workBench" value="workBench">工作台</Link></Menu.Item>
                            <Menu.Item key="2" ><Link to="proManage" value="proManage">项目管理</Link></Menu.Item>
                            <Menu.Item key="4" ><Link to="processCenter" value="processCenter">流程中心</Link></Menu.Item>
                            <Menu.Item key="5" ><Link to="deployCenter" value="deployCenter">部署中心</Link></Menu.Item>
                            <Menu.Item key="6" ><Link to="authorityManage" value="authorityManage">权限管理</Link></Menu.Item>
                            <Menu.Item key="3" ><Link to="sysManage" value="authorityManage">系统管理</Link></Menu.Item>
                        </Menu>
                        <div style={{ display: 'flex' }}>
                            <div style={isShow}>
                                <span style={{ paddingRight: 10, color: '#fff', marginLeft: 50 }}> 项目名称: </span>
                                <Select value={this.state.value} style={{ width: 200 }} onChange={this.handleChange}>
                                    {this.showProOption(this.state.proOption)}
                                </Select>
                            </div>
                            <div style={{marginLeft:30}}>
                                <Dropdown overlay={menu} >
                                    <Button>{localStorage.getItem('username')}</Button>
                                </Dropdown>
                            </div>
                        </div>
                    </Header>
                    <Content style={{ height: '100%', marginTop: '-64px' }}>
                        {this.props.children}
                    </Content>
                </Layout>
            </div>
        )
    }
}

export default App;