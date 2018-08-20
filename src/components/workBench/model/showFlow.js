import React, { Component } from 'react';
import axios from 'axios';
import url from '../../../url';
import FlowCompareRevert from './flowCompareRevert';
import { Tabs, Input, message, Modal, Button, Table } from 'antd';
const TabPane = Tabs.TabPane;
class NumericInput extends Component {
    onChange = (e) => {
        const { value } = e.target;
        const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
        if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
            this.props.onChange(value);
        }
    }
    onBlur = () => {
        const { value, onBlur, onChange } = this.props;
        if (!value && value !== null) {
            if (value.charAt(value.length - 1) === '.' || value === '-') {
                onChange({ value: value.slice(0, -1) });
            }
            if (onBlur) {
                onBlur();
            }
        }
    }
    render() {
        return (
            <Input
                {...this.props}
                onChange={this.onChange}
                onBlur={this.onBlur}
                placeholder="Input a number"
                maxLength="25"
            />
        );
    }
}

class Flow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: "",
            name: "",
            description: "",
            cronScheduler: "",
            retryCnt: "",
            retryBackoff: "",
            versionData: [],
            tagFlag: false,
            visibleTag: false,
            rootNodeId: "",
            tagName: "dev_",
            tagData: [],
            loading:false,
        }
    }
    componentDidMount() {
        let data = this.props.messageData;
        this.setState({
            name: data.name,
            description: data.description,
            cronScheduler: data.cronScheduler,
            retryCnt: data.retryCnt,
            retryBackoff: data.retryBackoff,
            rootNodeId: data.rootNodeId,
        })
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.id !== nextProps.messageData.id) {
            let mesData = nextProps.messageData;
            this.setState({
                name: mesData.name,
                description: mesData.description,
                cronScheduler: mesData.cronScheduler,
                retryCnt: mesData.retryCnt,
                retryBackoff: mesData.retryBackoff,
                rootNodeId: mesData.rootNodeId,
            })
        }
        if (this.state.versionData !== nextProps.flowVersionData) {
            let data = nextProps.flowVersionData;
            data.forEach((item, i) => {
                item.key = i
            });
            this.setState({ versionData: data })
        }
        if (this.state.tagFlag !== nextProps.tagFlag) {
            this.setState({ tagFlag: nextProps.tagFlag })
        }
    }
    updateName = (e) => {
        this.setState({ name: e.target.value })
    }
    updateDesc = (e) => {
        this.setState({ description: e.target.value })
    }
    updatecronScheduler = (e) => {
        this.setState({ cronScheduler: e.target.value })
    }
    updateretryCnt = (retryCnt) => {
        this.setState({ retryCnt })
    }
    updateretryBackoff = (retryBackoff) => {
        this.setState({ retryBackoff })
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
        params.name = data.name;
        params.description = data.description;
        params.cronScheduler = data.cronScheduler;
        params.retryCnt = data.retryCnt;
        params.retryBackoff = data.retryBackoff;
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
    newAddTag = () => {
        this.setState({ visibleTag: true })
    }
    updateTagName = (e) => {
        this.setState({ tagName: e.target.value })
    }
    handleOkTag = () => {
        let params = {};
        params.flowNodeId = this.props.messageData.id;
        params.tagName = this.state.tagName;
        params.projectId = this.props.messageData.projectId;
        this.setState({ loading: true });
        axios.post(url + '/workspace/create-tag', params, {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }).then((res) => {
            if(res.data.resCode){
                if (res.data.resCode === '00') {
                    message.info(res.data.resMsg, 1)
                    this.setState({ visibleTag: false })
                    axios.get(url + '/workspace/get-tag', {
                        flowNodeId: params.flowNodeId,
                        headers: {
                            'X-Requested-With': 'XMLHttpRequest'
                        }
                    }).then((res) => {
                        if(res.data.resCode){
                            if(res.data.resCode === "00"){
                                let data = res.data.data;
                                data.forEach((item, i) => {
                                    item.key = i
                                });
                                this.setState({ versionData: data, tagName: "dev_" })
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
            console.log(err.status);
        })
    }
    handleCancelTag = () => {
        this.setState({ visibleTag: false, tagName: "dev_" })
    }
    historyRecord = (data) => {
        let params = {
            nodeId: data.rootNodeId,
            tagId: data.id,
        }
        axios.get(url + '/workspace/get-flow-roll-compare-info', {
            params: params,
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }).then((res) => {
            if(res.data.resCode){
                if(res.data.resCode === "00"){
                    res.data.data.taskCompareInfoDtos.forEach((item, i) => {
                        item.key = i;
                    })
                    this.setState({ tagData: res.data.data })
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
    isRevert = (data) => {
        let params = {
            flowId: data.rootNodeId,
            tagId: data.id,
            projectId: localStorage.getItem("projectId")
        }
        axios.post(url + '/workspace/execute-flow-revert', params, {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }).then((res) => {
            if(res.data.resCode){
                if (res.data.resCode === '00') {
                    message.info(res.data.resMsg, 1)
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
    render() {
        const { name, description, cronScheduler, retryCnt, retryBackoff, tagName } = this.state;
        const columns = [{
            title: '版本号',
            dataIndex: 'tagName',
            key: 'tagName',
        }, {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: (text) => {
                function showValue(param) {
                    switch (param) {
                        case "INIT":
                            return "创建";
                        case "TEST":
                            return "测试中";
                        case "TEST_SUCCESS":
                            return "测试成功";
                        case "TEST_FAIL":
                            return "测试失败";
                        case "WAITING_ONLINE":
                            return "等待上线";
                        case "ONLINE_SUCCESS":
                            return "上线成功";
                        case "ONLINE_ROLLBACK":
                            return "上线回滚";
                        case "ONLINE_COVER":
                            return "曾经上线";
                        case "FAIL":
                            return "失败";
                        default:
                            break;
                    }
                }
                return <span>{showValue(text)}</span>
            }
        }, {
            title: '提交时间',
            key: 'updatedAt',
            dataIndex: 'updatedAt',
            render: (text, record) => {
                function timeChange(time) {
                    let date = new Date(time),
                        Y = date.getFullYear() + '-',
                        M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-',
                        D = date.getDate() + ' ',
                        h = date.getHours() + ':',
                        m = date.getMinutes() + ':',
                        s = date.getSeconds();
                    return Y + M + D + h + m + s;
                }
                return < span > {timeChange(text)}</span>
            }
        }, {
            title: '查看历史记录',
            key: 'btn',
            dataIndex: 'btn',
            render: (text, record) => {
                return (
                    <div>
                        <Button type="primary" className='add-project' style={{ left: 0, marginRight: 10 }} onClick={() => this.historyRecord(record)} >查看更多</Button>
                        <Button type="primary" className='add-project' style={{ left: 0 }} onClick={() => this.isRevert(record)} >回滚</Button>
                    </div>
                )
            }
        }];
        let tagBtn = this.state.tagFlag ? <Button type="primary" className='add-project' icon="file-add" style={{ position: 'relative', left: 0 }} onClick={this.newAddTag} >新增tag</Button> : '';
        return (
            <div >
                <Tabs defaultActiveKey="1">
                    <TabPane tab="配置" key="1">
                        <div style={{ padding: 20 }}>
                            <div style={{ padding: 10 }}>
                                <span style={{ paddingRight: 119 }}>名称:</span>
                                <Input style={{ width: 200 }} value={name} onChange={this.updateName} disabled />
                                <span style={{ color: "red" }}>*</span>
                            </div>
                            <div style={{ padding: 10 }}>
                                <span style={{ paddingRight: 119 }}>描述:</span>
                                <Input style={{ width: 400 }} value={description} onChange={this.updateDesc} />
                                <span style={{ color: "red" }}>*</span>
                            </div>
                            <div style={{ padding: 10 }}>
                                <span style={{ paddingRight: 13 }}>调度时间(cron表达式):</span>
                                <Input style={{ width: 200 }} value={cronScheduler} onChange={this.updatecronScheduler} />
                            </div>
                            <div style={{ padding: 10 }}>
                                <span style={{ paddingRight: 91 }}>重复次数:</span>
                                <NumericInput style={{ width: 200 }} value={retryCnt} onChange={this.updateretryCnt} />
                            </div>
                            <div style={{ padding: 10 }}>
                                <span style={{ paddingRight: 40 }}>重复间隔时间(秒):</span>
                                <NumericInput style={{ width: 200 }} value={retryBackoff} onChange={this.updateretryBackoff} />
                            </div >
                            <div style={{ padding: "30px 10px" }}>
                                <Button type="primary" className="save-btn" onClick={this.handleSave} loading={this.state.loading}>保存</Button>
                            </div >
                        </div>
                    </TabPane>
                    <TabPane tab="版本" key="2">
                        <div style={{ padding: 20 }}>
                            <div style={{ padding: '10px 0px', display: 'flex', justifyContent: 'flex-end' }}>
                                {tagBtn}
                            </div>
                            <Table
                                columns={columns}
                                dataSource={this.state.versionData}
                                bordered
                            />

                            <FlowCompareRevert tagData={this.state.tagData} />

                            <Modal
                                title='新增tag'
                                visible={this.state.visibleTag}
                                onOk={this.handleOkTag}
                                onCancel={this.handleCancelTag}
                                confirmLoading={this.state.loading}
                            >
                                <div>
                                    <span style={{ paddingRight: 20 }}>tag名称:</span>
                                    <Input style={{ width: 200 }} value={tagName} onChange={this.updateTagName} />
                                    <span style={{ color: '#a09797' }}>(样例：dev_20180101_01)</span>
                                </div>
                            </Modal>
                        </div>
                    </TabPane>
                </Tabs>
            </div>
        )
    }
}

export default Flow;