import React, { Component } from 'react';
import axios from 'axios';
import url from '../../../url';
import { Table,  Button, Input, Modal } from 'antd';
export default class SysMember extends Component {
    constructor(props) {
        super();
        this.state = {
            data: [],
            userName: "",
            visible: false,
            loading:false,
        }
    }
    componentDidMount() {
        this.getData({ role: "ADMIN" });
    }
    componentWillReceiveProps(nextProps) {
        this.getData({ role: "ADMIN" });
    }

    getData = (params) => {
        axios.get(url + '/authority/get-user-role-info-display', {
            params: params,
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }).then((res) => {
            if (res.data.resCode) {
                if (res.data.resCode === "00") {
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
            } else {
                window.location.href = (window.location.origin + window.location.pathname).replace("index.html", "") + "login.html"
            }
        }).catch((err) => {
            console.log(err.status);
        })
    }

    updateUserName = (e) => {
        this.setState({ userName: e.target.value })
    }
    check = () => {
        let params = {
            userName: this.state.userName,
            role: "ADMIN"
        }
        this.getData(params);
    }
    isHandle = (userRoleId) => {
        this.setState({ visible: true, userRoleId })
    }
    handleOk = () => {
        this.setState({ loading: true });
        axios.get(url + '/authority/revoke-admin-permission', {
            params: {
                userRoleId: this.state.userRoleId
            },
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }).then((res) => {
            if (res.data.resCode) {
                if (res.data.resCode === "00") {
                    let params = {
                        userName: this.state.userName,
                        role: "ADMIN"
                    }
                    this.getData(params);
                    this.setState({ visible: false })
                } else {
                    Modal.warning({
                        title: '警告',
                        content: res.data.resMsg,
                    });
                }
                this.setState({ loading: false });
            } else {
                window.location.href = (window.location.origin + window.location.pathname).replace("index.html", "") + "login.html"
            }
        }).catch((err) => {
            console.log(err.status);
        })
    }
    handleCancel = () => {
        this.setState({ visible: false })
    }
    render() {
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
            render: (text, row, index) => {
                return (
                    <Button onClick={this.isHandle.bind(this, row.userRoleId)}>权限收回</Button>
                )
            }
        }];
        return (
            <div style={{ padding: "20px", display: 'flex', flexDirection: "column" }}>
                <div style={{ marginBottom: 20 }}>
                    <span>um账号:</span>
                    <Input style={{ width: 200, marginRight: 10 }} value={this.state.userName} onChange={this.updateUserName} />
                    <Button onClick={this.check}>查询</Button>
                </div>
                <Table
                    columns={columns}
                    dataSource={this.state.data}
                    bordered
                />
                <Modal
                    title="权限收回"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    maskClosable={false}
                    confirmLoading={this.state.loading}
                >
                    <p>确认收回此权限?</p>
                </Modal>
            </div>
        )
    }
}