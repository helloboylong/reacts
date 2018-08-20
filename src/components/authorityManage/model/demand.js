import React, { Component } from 'react';
import axios from 'axios';
import url from '../../../url';
import { Table, Radio, Modal } from 'antd';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
export default class Demand extends Component {
    constructor(props) {
        super();
        this.state = {
            data:[],
            status:"",
        }
    }
    componentDidMount() {
        let params = {
            userName:localStorage.getItem("username"),
            projectId:localStorage.getItem("projectId")
        }
        this.getData(params);
    }
    componentWillReceiveProps(nextProps) {
        this.setState({status:""})
        let params = {
            userName:localStorage.getItem("username"),
            projectId:localStorage.getItem("projectId"),
        }
        this.getData(params);
    }
    
    getData = (params) => {
        axios.get(url + '/authority/get-user-apply-info', {
            params: params,
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }).then((res) => {
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
    onChange = (e) => {
        this.setState({status:e.target.value})
        let params = {
            userName:localStorage.getItem("username"),
            projectId:localStorage.getItem("projectId"),
            status:e.target.value
        }
        this.getData(params);
    }
    render() {
        const columns = [{
            title: '项目名称',
            dataIndex: 'resourceName',
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
            title: '状态',
            dataIndex: 'status',
            render:(text,row)=>{
                return (
                    <span>{text.name}</span>
                )
            }
        }];
        return (
            <div style={{ padding: "20px", display: 'flex', flexDirection: "column" }}>
                <div style={{marginBottom:20}}>
                    <RadioGroup onChange={this.onChange} value={this.state.status}>
                        <RadioButton value="1">赞同</RadioButton>
                        <RadioButton value="0">待审批</RadioButton>
                        <RadioButton value="-1">不赞同</RadioButton>
                    </RadioGroup>
                </div>
                <Table
                    columns={columns}
                    dataSource={this.state.data}
                    bordered
                />
            </div>
        )
    }
}