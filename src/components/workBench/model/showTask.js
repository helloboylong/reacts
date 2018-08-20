import React, { Component } from 'react';
import TaskCompareRevert from './taskCompareRevert';
import axios from 'axios';
import SomeSelect from 'react-select';
import sqlFormatter from 'sql-formatter';
import AceEditor from 'react-ace';
import 'react-select/dist/react-select.css';
import 'brace/mode/mysql';
import 'brace/mode/json';
import 'brace/theme/sqlserver';
import url from '../../../url'
import { Tabs, message, Input, Modal, Select, Button } from 'antd';
const Option = Select.Option;
const TabPane = Tabs.TabPane;

class Task extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: "",
            codeData: "",
            messData: "",
            name: "",
            description: "",
            dependData: [],
            value: [],
            showSQL: { display: 'block' },
            showJSON: { display: 'block' },
            taskType: "",
            taskCompareRevert: "",
            url: "",
            json:"",
            loading:false
        }
    }
    componentDidMount() {
        this.getUrl();
    }

    componentWillReceiveProps(nextProps) {
        this.getUrl();
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

        if (this.state.id !== nextProps.taskData.id) {
            let codeData = nextProps.taskData;
            this.setState({ taskType: codeData.type })
            if (codeData.type === "Hive2Hive") {
                if (!codeData.content && codeData.content === null) {
                    this.setState({ codeData: "" })
                } else {
                    this.setState({ codeData: codeData.content })
                }
                this.setState({
                    showSQL: { display: 'block' },
                    showJSON: { display: 'none' },
                })
            } else if (codeData.type === "Hdfs2RelDb") {
                this.setState({ json:"Hdfs2RelDb"})
                if (!codeData.content && codeData.content === null) {
                    let codeData = "";
                    this.setState({ codeData })
                } else {
                    this.setState({ codeData: codeData.content })
                }
                this.setState({
                    showSQL: { display: 'none' },
                    showJSON: { display: 'block' },
                })
            } else if (codeData.type === "RelDb2RelDb"){
                this.setState({ json: "RelDb2RelDb" })
                if (!codeData.content && codeData.content === null) {
                    let codeData = "";
                    this.setState({ codeData })
                } else {
                    this.setState({ codeData: codeData.content })
                }
                this.setState({
                    showSQL: { display: 'none' },
                    showJSON: { display: 'block' },
                })
            }else{
                this.setState({ json: "execDBscript" })
                if (!codeData.content && codeData.content === null) {
                    let codeData = "";
                    this.setState({ codeData })
                } else {
                    this.setState({ codeData: codeData.content })
                }
                this.setState({
                    showSQL: { display: 'none' },
                    showJSON: { display: 'block' },
                })
            }


        }

        if (this.state.id !== nextProps.taskCompareRevert.taskId) {
            this.setState({ taskCompareRevert: nextProps.taskCompareRevert })
        }
    }
    getUrl = () => {
        axios.get(url + "/workspace/get-task-template-explain_url", {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }).then((res) => {
            if(res.data.resCode){
                if(res.data.resCode === "00"){
                    this.setState({ url: res.data.data })
                }
            }else{
                window.location.href = (window.location.origin + window.location.pathname).replace("index.html","")+"login.html"
            }
        }).catch((err) => {
            console.log(err.status);
        })
    }
    updateCode = (codeData) => {
        this.setState({ codeData })
    }
    formatSqlCode = () => {
        let data = this.state.codeData;

        let codeData = sqlFormatter.format(data, {
            language: "n1ql",
            indent: "    "
        });
        this.setState({ codeData })
    }
    hanleSaveCode = () => {
        let data = this.props.taskData;
        let params = {};
        // params.content = sqlFormatter.format(this.state.codeData, {
        //     language: "n1ql", // Defaults to "sql"
        //     indent: "    "   // Defaults to two spaces
        // });
        params.content = this.state.codeData;
        params.id = data.id;
        params.lockerVersion = data.lockerVersion;
        params.md5 = data.md5;
        params.name = data.name;
        params.nodeId = data.nodeId;
        params.projectId = data.projectId;
        params.type = data.type;
        params.versionStatus = data.versionStatus;
        // this.setState({ codeData: params.content })
        this.setState({ loading: true });
        axios.post(url + "/workspace/update-task", params, {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }).then((res) => {
            if(res.data.resCode){
                if (res.data.resCode === '00') {
                    message.info(res.data.resMsg, 1)
                    this.getCompareData(res.data.data);
                    // window.location.reload();
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
    updateJsonCode = (codeData) => {
        this.setState({ codeData })
    }
    formatJsonCode = () => {
        let data = this.state.codeData;
        let codeData = JSON.stringify(JSON.parse(data), null, 4);
        this.setState({ codeData })
    }
    hanleSaveJson = () => {
        let data = this.props.taskData;
        let codeData = JSON.stringify(JSON.parse(this.state.codeData), null, 4);
        let params = {};
        params.content = codeData;
        params.id = data.id;
        params.lockerVersion = data.lockerVersion;
        params.md5 = data.md5;
        params.name = data.name;
        params.nodeId = data.nodeId;
        params.projectId = data.projectId;
        params.type = data.type;
        params.versionStatus = data.versionStatus;
        this.setState({ codeData: params.content })
        this.setState({ loading: true });
        axios.post(url + "/workspace/update-task", params, {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }).then((res) => {
            if(res.data.resCode){
                if (res.data.resCode === '00') {
                    message.info(res.data.resMsg, 1)
                    this.getCompareData(res.data.data);
                    // window.location.reload();
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
    updateName = (e) => {
        this.setState({ name: e.target.value })
    }
    updateDesc = (e) => {
        this.setState({ description: e.target.value })
    }
    updateTaskType = (taskType) => {
        this.setState({ taskType })
    }
    handleSaveConfig = () => {
        let data = this.props.messageData;
        let params = {}
        params.cronScheduler = data.cronScheduler;
        params.projectId = data.projectId;
        params.rootNodeId = data.rootNodeId;
        params.id = data.id;
        params.lockerVersion = data.lockerVersion;
        params.taskId = data.taskId;
        params.taskType = this.state.taskType;
        params.type = data.type;
        params.versionStatus = data.versionStatus;
        params.tryCnt = data.tryCnt;
        params.tryBackoff = data.tryBackoff;
        params.name = this.state.name;
        params.description = this.state.description;
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
                    this.getCompareData(res.data.data);
                    // window.location.reload();
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
    getCodeData = (id) => {
        axios.get(url + '/workspace/task', {
            params: { taskId: id }, 
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
         }).then((res) => {
            if(res.data.resCode){
                if(res.data.resCode === "00"){
                    this.setState({ codeData: res.data.data.content })
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
    getCompareData = (id) => {
        axios.get(url + '/workspace/get-task-roll-compare-info', {
            params: { nodeId: id },
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }).then((res) => {
            if(res.data.resCode){
                if(res.data.resCode === "00"){
                    this.setState({ taskCompareRevert: res.data.data })
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

    render() {
        return (
            <div >
                <Tabs defaultActiveKey="1">
                    <TabPane tab="配置" key="1">
                        <div style={{ padding: 20, height: 400 }}>
                            <div style={{ padding: 10 }}>
                                <span style={{ paddingRight: 39 }}>名称:</span>
                                <Input value={this.state.name} onChange={this.updateName} style={{ width: 200 }} disabled />
                                <span style={{ color: "red" }}>*</span>
                            </div>
                            <div style={{ padding: 10 }}>
                                <span style={{ paddingRight: 39 }}>描述:</span>
                                <Input value={this.state.description} onChange={this.updateDesc} style={{ width: 400 }} />
                                <span style={{ color: "red" }}>*</span>
                            </div>
                            <div style={{ padding: 10 }}>
                                <span style={{ paddingRight: 39 }}>类型:</span>
                                <Select value={this.state.taskType} style={{ width: 250 }} onChange={this.updateTaskType} >
                                    <Option value="Hive2Hive">Hive离线计算任务</Option>
                                    <Option value="Hdfs2RelDb">Hdfs同步到关系数据库</Option>
                                    <Option value="RelDb2RelDb" >关系型数据库同步到关系型数据库</Option>
                                    <Option value="execDBscript" >执行DB脚本</Option>
                                </Select>
                            </div>
                            <div style={{ padding: 10 }}>
                                <span style={{ paddingRight: 11 }}>前置依赖:</span>
                                <div style={{ display: 'inline-block', width: '500px', verticalAlign: 'middle' }}>
                                    <SomeSelect
                                        multi
                                        options={this.state.dependData}
                                        onChange={this.handleSelectChange}
                                        value={this.state.value}
                                    />
                                </div>
                            </div>
                        </div>
                        <Button type="primary" style={{ marginLeft: 20 }} className="save-btn" onClick={this.handleSaveConfig} loading={this.state.loading}>保存</Button>
                    </TabPane>
                    <TabPane tab="代码" key="2">
                        <div style={{ padding: 20 }}>
                            <div style={this.state.showSQL}>
                                <div style={{ paddingBottom: 20 }}>
                                    <h3>Hive2Hive/sql</h3>
                                    <button type="button" className="save-btn" style={{ margin: '10px 0' }} onClick={this.formatSqlCode}>格式化</button>
                                    <AceEditor
                                        mode="mysql"
                                        theme="sqlserver"
                                        fontSize="16px"
                                        style={{ width: '80%', border: '1px solid #dcdcdc', marginTop: 50 }}
                                        value={this.state.codeData}
                                        onChange={this.updateCode}
                                        editorProps={{ $blockScrolling: true }}
                                    />
                                </div>
                                <Button type="primary" className="save-btn" onClick={this.hanleSaveCode} loading={this.state.loading}>保存</Button>
                            </div>
                            <div style={this.state.showJSON}>
                                <div style={{ paddingBottom: 20 }}>
                                    <h3>{this.state.json}/json</h3>
                                    <button type="button" className="save-btn" style={{ margin: '10px' }} onClick={this.formatJsonCode}>格式化</button>
                                    <a href={this.state.url} target="_blank">模板文件参考说明</a>
                                    <AceEditor
                                        mode="json"
                                        theme="sqlserver"
                                        fontSize="16px"
                                        style={{ width: '80%', border: '1px solid #dcdcdc' }}
                                        value={this.state.codeData}
                                        onChange={this.updateJsonCode}
                                        editorProps={{ $blockScrolling: true }}
                                    />
                                </div>
                                <Button type="primary" className="save-btn" onClick={this.hanleSaveJson} loading={this.state.loading}>保存</Button>
                            </div>
                        </div>
                    </TabPane>
                    <TabPane tab="历史版本记录" key="3">
                        <div style={{ padding: 20 }}>
                            <TaskCompareRevert taskCompareRevert={this.state.taskCompareRevert} getCodeData={this.getCodeData} getCompareData={this.getCompareData} />
                        </div>
                    </TabPane>
                </Tabs>
            </div>
        )
    }
}

export default Task;