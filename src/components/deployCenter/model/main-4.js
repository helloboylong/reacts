import React, { Component } from 'react';
import axios from 'axios';
import url from '../../../url';
import { Select, Table, Menu, Dropdown, Icon, Modal, Input } from 'antd';
const Option = Select.Option;
export default class Main4 extends Component{
    constructor(props){
        super(props);
        this.state = {
            loading:false,
            EnvOption:[],
            defaultEnvId:"",
            defaultDeloy:"DEPLOY_TYPE_TAG",
            columns: [{
                title: 'flow名称',
                dataIndex: 'flowName',
            }, {
                title: 'tag名称',
                dataIndex: 'tagName',
            }, {
                title: '状态',
                dataIndex: 'status',
                render: (text, record, index) => <span >{text.name}</span>
            }, {
                title: '更多操作',
                key: 'doing',
                render: (text) => {
                    const menu = (
                        <Menu onClick={this.onClick.bind(this, text)}>
                            {this.showNextProcess(text.onceOnlineTags)}
                        </Menu>
                    );

                    return (
                        < Dropdown overlay={menu} disabled={text.onceOnlineTags.length === 0 ? true : false}>
                            <a className="ant-dropdown-link" >
                                More actions <Icon type="down" />
                            </a>
                        </Dropdown>
                    )
                }
            }],
            data: [],
            visible:false,
            showValue:"",
            flowList:[],
            regName:""
        };
    }
    componentDidMount() {
        this.getEnvData(localStorage.getItem("projectId"));
    }
    componentWillReceiveProps(nextProps) {
        this.getEnvData(localStorage.getItem("projectId"));
    }
    
    getEnvData = (id) => {
        axios.get(url + '/project-manage/get-ProjectEnv-List', {
            params: { projectId: id, userName: localStorage.getItem("username") },
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }).then((res) => {
            if (res.data.resCode) {
                if (res.data.resCode === "00") {
                    res.data.data.forEach((item, i) => {
                        if (item.type !== 'PRODUCT') {
                            res.data.data.splice(i, 1)
                        }
                    })
                    this.setState({ EnvOption: res.data.data, defaultEnvId:res.data.data[0].id})
                    this.getData(res.data.data[0].id);
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
    showProOption = (arr) => {
        return arr.map((item, i) => {
            return < Option value={item.id} key={i}>{item.name}</Option >
        })
    }
    showNextProcess = (arr) => {
        if(arr && Array.isArray(arr) && arr.length>0){
            return arr.map((item, i) => {
                return (
                    <Menu.Item key={i} value={item.tagId}>{item.tagName + "---" + item.tagStatus.name}</Menu.Item>
                )
            })
        }
    }
    getData = (envId) => {
        axios.get(url + '/deployment/get-last-online-reg-of-project', {
            params: { 
                projectId: localStorage.getItem("projectId"), 
                envId: envId
            },
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }).then((res) => {
            if (res.data.resCode) {
                if (res.data.resCode === "00") {
                    res.data.data.tagRevertDtos.forEach((item,i)=>{
                        item.key = i;
                    })
                    this.setState({data:res.data.data.tagRevertDtos,regName:res.data.data.regName})
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
    onClick = (text,e) => {
        // console.log(text, e.item.props)
        let flowList = [];
        flowList[0] = {};
        flowList[0].flowId = text.flowId;
        flowList[0].tagId = e.item.props.value;
        this.setState({ visible: true, showValue: e.item.props.children,flowList})
    }
    handleOk = () => {
        let params = {
            projectId: localStorage.getItem("projectId"),
            envId: this.state.defaultEnvId,
            deployType: this.state.defaultDeloy,
            userName: localStorage.getItem("username"),
            flowList:this.state.flowList
        }
        this.setState({ loading: true });
        axios.post(url + "/deployment/reg-online-rollback", params, {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }).then((res) => {
            if (res.data.resCode) {
                if (res.data.resCode === '00') {
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
        this.setState({visible:false})
    }
    render(){
        return (
            <div className="deploy-main">
                <div className="deploy-main-horizontal">
                    <div style={{ padding: 10 }}>
                        <span style={{ paddingRight: 10 }}>当前版本:</span>
                        <Input style={{ width: 200 }} value={this.state.regName} disabled/>
                    </div>
                </div>
                <div className="deploy-main-horizontal">
                    <div style={{ padding: 10 }}>
                        <span style={{ paddingRight: 10 }}>选择环境:</span>
                        <Select value={this.state.defaultEnvId} style={{ width: 200 }} disabled>
                            {this.showProOption(this.state.EnvOption)}
                        </Select>
                    </div>
                    <div style={{ padding: 10 }}>
                        <span style={{ paddingRight: 10 }}>部署方式:</span>
                        <Select value={this.state.defaultDeloy} style={{ width: 200 }} disabled>
                            < Option value="DEPLOY_TYPE_TAG" >tag部署</Option >
                        </Select>
                    </div>
                </div>
                <div>
                    <Table
                        columns={this.state.columns}
                        dataSource={this.state.data}
                        bordered
                    />
                </div>
                <Modal
                    title="是否回滚"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    maskClosable={false}
                    confirmLoading={this.state.loading}
                >
                    <p>是否回滚到"{this.state.showValue}"版本</p>
                </Modal>
            </div>
        )
    }
}