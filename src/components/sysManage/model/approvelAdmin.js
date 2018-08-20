import React, { Component } from 'react';
import axios from 'axios';
import url from '../../../url';
import { Table, Menu, Dropdown, Icon, message, Modal } from 'antd';
export default class ApprovelAdmin extends Component{
    constructor(props){
        super();
        this.state = {
            data:[],
            visible:false,
        }
    }
    componentDidMount() {
        this.getData();
    }
    componentWillReceiveProps(nextProps) {
        this.getData();
    }
    
    getData = () => {
        axios.get(url + '/authority/get-init-admin-user', {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }).then((res) => {
            // console.log(res.data.data)
            if(res.data.resCode){
                if (res.data.resCode === '00') {
                    res.data.data.forEach((item, i) => {
                        item.key = i;
                    })
                    this.setState({ data: res.data.data })
                }else{
                    Modal.warning({
                        title: '警告',
                        content: res.data.resMsg,
                    });
                }
            }else{
                window.location.href = (window.location.origin + window.location.pathname).replace("index.html","")+"login.html"
            }
        }).catch((err) => {
            console.log(err.status);
        })
    }
    isApprovel = (value, row, index,e) => {
        let params = {
            approvalStatus:e.item.props.value,
            userRoleId:row.userRoleId
        }
        axios.get(url + '/authority/approve-admin-user', {
            params:params,
            headers:{
                'X-Requested-With': 'XMLHttpRequest'
            }
        }).then((res) => {
            if(res.data.resCode){
                if (res.data.resCode === "00") {
                    message.info(res.data.resMsg, 1);
                    this.getData();
                } else {
                    Modal.warning({
                        title: '警告',
                        content: res.data.resMsg,
                    });
                }
            }else{
                window.location.href = (window.location.origin + window.location.pathname).replace("index.html","")+"login.html"
            }
        }).catch((err) => {
            console.log(err.status);
        })
    }
    render(){
        const columns = [{
            title: '姓名',
            dataIndex: 'userName',
        }, {
            title: '角色',
            dataIndex: 'roleName',
            render: (text) => {
                switch (text) {
                    case "DEV":
                        return <span>开发</span>;
                    case "TEST":
                        return <span>测试</span>;
                    case "MAINTENANCE":
                        return <span>运维</span>;
                    case "OWNER":
                        return <span>项目管理员</span>;
                    case "ADMIN":
                        return <span>系统管理员</span>;
                    default:
                        break;
                }
            }
        }, {
            title: '操作',
            dataIndex: 'doing',
            render: (value, row, index) => {
                const menu = (
                    <Menu onClick={this.isApprovel.bind(this, value, row, index)}>
                        <Menu.Item value='APPROVAL'>同意</Menu.Item>
                        <Menu.Item value='DISAPPROVE'>不同意</Menu.Item>
                    </Menu>
                );

                return (
                    <Dropdown overlay={menu}>
                        <a className="ant-dropdown-link" >
                            More actions <Icon type="down" />
                        </a>
                    </Dropdown>
                )
            }

        }];
        return (
            <div style={{ padding: "20px", display: 'flex', flexDirection: "column" }}>
                <Table
                    columns={columns}
                    dataSource={this.state.data}
                    bordered
                />
            </div>
        )
    }
}