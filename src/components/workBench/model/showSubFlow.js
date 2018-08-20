import React, { Component } from 'react';
import axios from 'axios';
import url from '../../../url';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import { Tabs, Input, message, Modal, Button } from 'antd';
const TabPane = Tabs.TabPane;

class SubFlow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: "",
            name: "",
            description: "",
            dependData: [],
            value: [],
            loading:false,
        }
    }
    componentDidMount() {
        let data = this.props.messageData;
        let dependData = [];
        data.dependSelectNodes.forEach((item) => {
            let obj = {}
            obj.label = item.name;
            obj.value = item.id;
            dependData.push(obj)
        })
        let checkedVal = [];
        data.dependNodes.forEach((item) => {
            dependData.forEach((i) => {
                if (item === i.value) {
                    checkedVal.push(i)
                }
            })
        })
        this.setState({
            name: data.name,
            description: data.description,
            value: checkedVal,
            dependData: dependData
        });
    }
    componentWillReceiveProps(nextProps) {
        if (this.state.id !== nextProps.messageData.id) {
            let data = nextProps.messageData;
            let dependData = [];
            data.dependSelectNodes.forEach((item) => {
                let obj = {}
                obj.label = item.name;
                obj.value = item.id;
                dependData.push(obj)
            })
            let checkedVal = [];
            data.dependNodes.forEach((item) => {
                dependData.forEach((i) => {
                    if (item === i.value) {
                        checkedVal.push(i)
                    }
                })
            })
            this.setState({
                name: data.name,
                description: data.description,
                value: checkedVal,
                dependData: dependData
            });
        }
    }
    updateName = (e) => {
        this.setState({ name: e.target.value })
    }
    updateDesc = (e) => {
        this.setState({ description: e.target.value })
    }
    handleSelectChange = (value) => {
        let data = [];
        value.forEach(item => {
            data.push(item.value)
        })
        let params = {
            nodeId: this.props.messageData.id,
            dependencyIds: data.toString()
        }
        axios.get(url + '/workspace/dependencies-change', {
            params: params,
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }).then((res) => {
            if(res.data.resCode){
                if (res.data.resCode !== "00") {
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
        this.setState({ value });
    }
    handleSave = () => {
        let propsData = this.props.messageData;
        let data = this.state;
        let params = {}
        params.projectId = propsData.projectId;
        params.rootNodeId = propsData.rootNodeId;
        params.id = propsData.id;
        params.lockerVersion = propsData.lockerVersion;
        params.type = propsData.type;
        params.versionStatus = propsData.versionStatus;
        params.cronScheduler = propsData.cronScheduler;
        params.retryCnt = propsData.retryCnt;
        params.retryBackoff = propsData.retryBackoff;
        params.name = data.name;
        params.description = data.description;
        params.dependNodes = [];
        this.state.value.map((item) => {
            return params.dependNodes.push(item.value)
        })
        if (!params.name) {
            Modal.warning({
                title: '警告',
                content: '名称不能为空',
            });
            return false;
        }
        if (!params.description) {
            Modal.warning({
                title: '警告',
                content: '描述不能为空',
            });
            return false;
        }
        this.setState({ loading: true });
        axios.post(url + "/workspace/update-node", params, {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }).then((res) => {
            if(res.data.resCode){
                if (res.data.resCode === '00') {
                    message.info(res.data.resMsg, 1)
                    // window.location.reload()
                } else {
                    Modal.warning({
                        title: '警告',
                        content: res.data.resMsg,
                    });
                }
                this.setState({ loading: false });  
            }else{
                window.location.href = (window.location.origin + window.location.pathname).replace("index.html","")+"login.html"
            }
        }).catch((err) => {
            console.log(err);
        })
    }
    render() {
        const { name, description } = this.state;
        return (
            <div >
                <Tabs defaultActiveKey="1">
                    <TabPane tab="配置" key="1">
                        <div style={{ padding: 20, height: 400 }}>
                            <div style={{ padding: 10 }}>
                                <span style={{ paddingRight: 39 }}>名称:</span>
                                <Input style={{ width: 200 }} value={name} onChange={this.updateName} disabled />
                                <span style={{ color: "red" }}>*</span>
                            </div>
                            <div style={{ padding: 10 }}>
                                <span style={{ paddingRight: 39 }}>描述:</span>
                                <Input style={{ width: 400 }} value={description} onChange={this.updateDesc} />
                                <span style={{ color: "red" }}>*</span>
                            </div>
                            <div style={{ padding: 10 }}>
                                <span style={{ paddingRight: 11 }}>前置依赖:</span>
                                <div style={{ display: 'inline-block', width: '500px', verticalAlign: 'middle' }}>
                                    <Select
                                        multi
                                        options={this.state.dependData}
                                        onChange={this.handleSelectChange}
                                        value={this.state.value}
                                    />
                                </div>
                            </div>
                        </div>
                        <Button type="primary" className="save-btn" style={{ marginLeft: 20 }} onClick={this.handleSave} loading={this.state.loading}>保存</Button>
                    </TabPane>
                </Tabs>
            </div>
        )
    }
}

export default SubFlow;