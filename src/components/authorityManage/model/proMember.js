import React, { Component } from 'react';
import axios from 'axios';
import url from '../../../url';
import { Table, Radio, Button, Input, Modal } from 'antd';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
export default class ApplyAdmin extends Component {
    constructor(props) {
        super();
        this.state = {
            data: [],
            role:"",
            userName:"",
            visible:false,
            loading:false,
        }
    }
    componentDidMount() {
        this.getData({ projectId: localStorage.getItem("projectId") });
    }
    componentWillReceiveProps(nextProps) {
        this.getData({ projectId: localStorage.getItem("projectId")});
    }

    getData = (params) => {
        axios.get(url + '/authority/get-user-role-info-display', {
            params: params,
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }).then((res) => {
            if(res.data.resCode){
                if(res.data.resCode === "00"){
                    res.data.data.forEach((item,i)=>{
                        item.key = i;
                    })
                    this.setState({data:res.data.data})
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
    onChange = (e) => {
        this.setState({ role: e.target.value });
        let params = {
            projectId:localStorage.getItem("projectId"),
            userName:this.state.userName,
            role: e.target.value
        }
        this.getData(params);
    }
    updateUserName = (e) => {
        this.setState({userName:e.target.value})
    }
    check = () => {
        let params = {
            projectId: localStorage.getItem("projectId"),
            userName: this.state.userName,
            role: this.state.role
        }
        this.getData(params);
    }
    isHandle = (userRoleId ) => {
        this.setState({visible:true,userRoleId})
    }
    handleOk = () => {
        let params = {
            userRoleId: this.state.userRoleId,
            projectId:localStorage.getItem("projectId")
        }
        this.setState({ loading: true });
        axios.post(url + '/authority/revoke-user-permission',params, {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }).then((res) => {
            if (res.data.resCode) {
                if (res.data.resCode === "00") {
                    let params = {
                        projectId: localStorage.getItem("projectId"),
                        userName: this.state.userName,
                        role: this.state.role
                    }
                    this.getData(params);
                    this.setState({ visible: false })
                }else{
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
        this.setState({visible:false})
    }
    render() {
        const columns = [{
            title: '项目名称',
            dataIndex: 'projectName',
        }, {
            title: '姓名',
            dataIndex: 'userName',
        }, {
            title: '角色',
            dataIndex: 'roleName',
            render:(text)=>{
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
                    <RadioGroup onChange={this.onChange} value={this.state.role}>
                        <RadioButton value="">全部</RadioButton>
                        <RadioButton value="DEV">开发</RadioButton>
                        <RadioButton value="TEST">测试</RadioButton>
                        <RadioButton value="MAINTENANCE">运维</RadioButton>
                        <RadioButton value="OWNER">项目管理者</RadioButton>
                    </RadioGroup>
                    <span style={{ marginLeft: 20}}>UM账号:</span>
                    <Input style={{ width: 200, marginRight: 10 }} value={this.state.userName} onChange={this.updateUserName}/>
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