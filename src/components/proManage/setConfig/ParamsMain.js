import React, { Component } from 'react';
import axios from 'axios';
import url from '../../../url';
import { Radio, Button, Table, Modal, Input, Select, message } from 'antd';
const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class ParamsMian extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            columns: [{
                title: 'keyName',
                dataIndex: 'keyName',
            }, {
                title: 'keyValue',
                dataIndex: 'keyValue',
            }, {
                title: '环境类型',
                dataIndex: 'envType',
            }, {
                title: '环境名称',
                dataIndex: 'envName',
            }, {
                title: '推送状态',
                dataIndex: 'pushStatus',
                render: (text, record, index) => {
                    const val = (text) => {
                        switch (text) {
                            case 'PUSHED':
                                return '已推送';
                            case 'UN_PUSHED':
                                return '未推送';
                            default:
                                break;
                        }
                    }
                    return <span>{val(text)}</span>
                }
            }, {
                title: '状态',
                dataIndex: 'status',
                render: (text, record, index) => {
                    const val = (text) => {
                        switch (text) {
                            case 'NORMAL':
                                return '正常';
                            case 'ABANDONED':
                                return '废弃';
                            default:
                                break;
                        }
                    }
                    return <span>{val(text)}</span>
                }
            }, {
                title: '编辑',
                dataIndex: 'doing',
                render: (text, record, index) => {
                    return (
                        <div>
                            <Button onClick={this.edit.bind(this, record)} style={{ marginRight: 10 }}>编辑</Button>
                            {this.isPush(record.pushStatus, record)}
                            <Button onClick={this.isDelete.bind(this, record.id, record.envType)} style={{ marginLeft: 10 }}>废弃</Button>
                            <Button onClick={this.mustPush.bind(this, record)} style={{ marginLeft: 10 }}>强制推送</Button>
                            <Button onClick={this.isCheckout.bind(this, record)} style={{ marginLeft: 10 }}>参数校验</Button>
                        </div>
                    )
                }
            }],
            visible: false,
            visibleE: false,
            keyName: "",
            keyValue: "",
            optionData: [],
            envValue: "",
            keyNameE: "",
            keyValueE: "",
            editVal: "",
            keyNameData: [
                { value: "cdh.queue.name", text: "cdh.queue.name" },
                { value: "cdh.kerbose.keytab.path", text: "cdh.kerbose.keytab.path" },
                { value: "cdh.kerbose.principal.name", text: "cdh.kerbose.principal.name" },
            ],
            visibleDel: false,
            delId: "",
            projectTypeEnum:"",
            envType: "",
            envStatus: "",
            visibleENV: false,
            srcProjectData: [],
            srcProId: "",
            srcEnvData: [],
            srcEnvId: "",
            destProId: "",
            destEnvData: [],
            destEnvId: "",
            visibleCheckout: false,
            checkName: "",
            checkValue: "",
            id:"",
            loading:false,
        }
    }
    componentDidMount() {
        let ele = window.location.hash;
        let id = ele.substring(ele.lastIndexOf('=')+1, ele.length);
        this.setState({id})
        this.getData(id);
        axios.get(url + '/project-manage/get-ProjectEnv-List', {
            params: { projectId: id, userName: localStorage.getItem("username") }, 
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }).then((res) => {
            if(res.data.resCode){
                if (res.data.resCode === "00") {
                    this.setState({ optionData: res.data.data })
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
        axios.get(url + '/project-manage/project', {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }).then((res) => {
            if(res.data.resCode){
                if(res.data.resCode === "00"){
                    this.setState({ srcProjectData: res.data.data, srcProId: res.data.data[0].id, destProId: res.data.data[0].id })
                    this.getEnvData(res.data.data[0].id)
                    this.getDestEnvData(res.data.data[0].id)
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
    componentWillReceiveProps(nextProps) {
        let ele = window.location.hash;
        let id = ele.substring(ele.lastIndexOf('=')+1, ele.length);
        this.setState({id})
        this.getData(id);
    }

    getData = (id) => {
        axios.get(url + '/project-manage/get-project-param-list', {
            params: { projectId: id }, 
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }).then((res) => {
            if(res.data.resCode){
                if (res.data.resCode === "00") {
                    res.data.data.forEach((item, i) => {
                        item.key = i;
                    })
                    this.setState({ data: res.data.data })
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
    isPush = (val, data) => {
        if (val === "UN_PUSHED") {
            return <Button onClick={this.isPushBtn.bind(this, data)} >推送</Button>
        } else {
            return ""
        }
    }
    isPushBtn = (data) => {
        let params = {
            envId: data.envId,
            projectId: data.projectId,
            projectParamId: data.id,
            userName:localStorage.getItem("username")
        }
        axios.post(url + "/deployment/push-projectParam", params, {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }).then((res) => {
            if(res.data.resCode){
                if (res.data.resCode === '00') {
                    message.info(res.data.resMsg, 1)
                    // this.getData();
                    let params = {
                        projectId: this.state.id,
                        envType: this.state.envType,
                        status: this.state.envStatus,
                    }
                    this.changeGetData(params);
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
            console.log(err);
        })
    }
    mustPush = (data) => {
        let params = {
            envId: data.envId,
            projectId: data.projectId,
            projectParamId: data.id,
            userName:localStorage.getItem("username")
        }
        axios.post(url + "/deployment/push-projectParam", params, {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }).then((res) => {
            if(res.data.resCode){
                if (res.data.resCode === '00') {
                    message.info(res.data.resMsg, 1)
                    // this.getData();
                    let params = {
                        projectId: this.state.id,
                        envType: this.state.envType,
                        status: this.state.envStatus,
                    }
                    this.changeGetData(params);
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
            console.log(err);
        })
    }
    isCheckout = (data) => {
        console.log(data)
        let params = {
            projectId: this.state.id,
            envId: data.envId,
            projectParamId: data.id,
            keyName: data.keyName,
            userName:localStorage.getItem("username")
        }
        axios.get(url + '/deployment/get-projectParam-from-app', {
            params: params, 
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }).then((res) => {
            if(res.data.resCode){
                if (res.data.resCode === '00') {
                    this.setState({ visibleCheckout: true, checkName: res.data.data.keyName, checkValue: res.data.data.keyValue })
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
    handleOkCheckout = () => {
        this.setState({ visibleCheckout: false })
    }
    handleCancelCheckout = () => {
        this.setState({ visibleCheckout: false })
    }
    addPro = () => {
        this.setState({ visible: true })
    }
    showNewOption = (arr) => {
        return arr.map((item, i) => {
            return <Option key={i} value={item.id + "," + item.type}>{item.id}---{item.name}</Option>
        })
    }
    updateKeyName = (value) => {
        this.setState({ keyName: value });
    }
    updateKeyValue = (e) => {
        this.setState({ keyValue: e.target.value })
    }
    handleChange = (val) => {
        this.setState({ envValue: val })
    }
    handleOk = () => {
        let data = this.state;
        if (!data.keyName) {
            Modal.warning({
                title: '警告',
                content: "keyName不能为空",
            });
            return false;
        }
        if (!data.keyValue) {
            Modal.warning({
                title: '警告',
                content: "keyValue不能为空",
            });
            return false;
        }

        let envVal = data.envValue.split(",");
        let params = {
            keyName: data.keyName,
            keyValue: data.keyValue,
            projectId: this.state.id,
            envId: envVal[0],
            envType: envVal[1],
            userName: localStorage.getItem("username"),
        }
        if (!params.envId) {
            Modal.warning({
                title: '警告',
                content: "envId不能为空",
            });
            return false;
        }
        this.setState({ loading: true });
        axios.post(url + "/project-manage/create-project-param", params, {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }).then((res) => {
            if(res.data.resCode){
                if (res.data.resCode === '00') {
                    message.info(res.data.resMsg, 1)
                    this.getData(this.state.id);
                    this.setState({
                        keyName: "",
                        keyValue: "",
                        visible: false
                    })
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
    handleCancel = () => {
        this.setState({
            keyName: "",
            keyValue: "",
            visible: false
        })
    }

    changeGetData = (params) => {
        axios.get(url + '/project-manage/find-projectParams-by-proId-and-envType-and-status', {
            params: params, 
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }).then((res) => {
            if(res.data.resCode){
                if (res.data.resCode === "00") {
                    res.data.data.forEach((item, i) => {
                        item.key = i;
                    })
                    this.setState({ data: res.data.data })
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
            console.log(err);
        })
    }

    onChange = (e) => {
        this.setState({ envType: e.target.value })
        let params = {
            projectId: this.state.id,
            envType: e.target.value,
            status: this.state.envStatus
        }
        this.changeGetData(params);
    }
    onChangeStatus = (e) => {
        this.setState({ envStatus: e.target.value })
        let params = {
            projectId: this.state.id,
            envType: this.state.envType,
            status: e.target.value,
        }
        this.changeGetData(params);
    }
    edit = (data) => {
        this.setState({
            editVal: data,
            keyNameE: data.keyName,
            keyValueE: data.keyValue,
            visibleE: true
        })
    }
    isDelete = (id,type) => {
        console.log(id,type)
        this.setState({ visibleDel: true, delId: id, projectTypeEnum:type})
    }
    handleOkDel = () => {
        let params = {
            id: this.state.delId,
            projectTypeEnum: this.state.projectTypeEnum,
            projectId: localStorage.getItem("projectId"),
            userName: localStorage.getItem("username"),
        }
        this.setState({ loading: true });
        axios.post(url + '/project-manage/delete-project-param', params,{
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }).then((res) => {
            if(res.data.resCode){
                if (res.data.resCode === "00") {
                    this.getData(this.state.id);
                    this.setState({ visibleDel: false })
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
    handleCancelDel = () => {
        this.setState({ visibleDel: false })
    }
    updateKeyNameE = (e) => {
        this.setState({ keyNameE: e.target.value })
    }
    updateKeyValueE = (e) => {
        this.setState({ keyValueE: e.target.value })
    }
    handleOkE = () => {
        let data = this.state;
        if (!data.keyNameE) {
            Modal.warning({
                title: '警告',
                content: "keyName不能为空",
            });
            return false;
        }
        if (!data.keyValueE) {
            Modal.warning({
                title: '警告',
                content: "keyValue不能为空",
            });
            return false;
        }
        let params = {
            envId: data.editVal.envId,
            envType: data.editVal.envType,
            id: data.editVal.id,
            keyName: data.keyNameE,
            keyValue: data.keyValueE,
            lockerVersion: data.editVal.lockerVersion,
            name: data.editVal.name,
            projectId: data.editVal.projectId,
            pushStatus: data.editVal.pushStatus,
            status: data.editVal.status,
            envName: data.editVal.envName,
            userName: localStorage.getItem("username")
        }
        this.setState({ loading: true });
        axios.post(url + "/project-manage/update-project-param", params, {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }).then((res) => {
            if(res.data.resCode){
                if (res.data.resCode === '00') {
                    message.info(res.data.resMsg, 1)
                    this.getData(this.state.id);
                    this.setState({
                        visibleE: false,
                        keyNameE: "",
                        keyValueE: ""
                    })
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
    handleCancelE = () => {
        this.setState({
            keyNameE: "",
            keyValueE: "",
            visibleE: false
        })
    }
    isCut = () => {
        this.setState({ visibleENV: true })
    }
    handleOkENV = () => {
        let params = {
            srcProjectId: this.state.srcProId,
            srcEnvId: this.state.srcEnvId,
            destProjectId: this.state.destProId,
            destEnvId: this.state.destEnvId
        }
        // if(params.srcProjectId === params.destProjectId && params.srcEnvId === params.destEnvId){
        //     Modal.warning({
        //         title: '警告',
        //         content: '不能同步到自身',
        //     });
        //     return false;
        // }
        if (!params.srcEnvId) {
            Modal.warning({
                title: '警告',
                content: '环境不能为空',
            });
            return false;
        }
        if (!params.destEnvId) {
            Modal.warning({
                title: '警告',
                content: '选择环境不能为空',
            });
            return false;
        }
        this.setState({ loading: true });
        axios.post(url + '/project-manage/sync-param-to-env', params, {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }).then((res) => {
            if(res.data.resCode){
                if (res.data.resCode === '00') {
                    message.info(res.data.resMsg, 1)
                    this.setState({ visibleENV: false, srcEnvId: "", destEnvId: "" })
                    let params = {
                        projectId: this.state.id,
                        envType: this.state.envType,
                        status: "",
                    }
                    this.changeGetData(params);
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
    handleCancelENV = () => {
        this.setState({ visibleENV: false })
    }
    showOption = (arr) => {
        if(arr && Array.isArray(arr) && arr.length>0){
            return arr.map((item, i) => {
                return < Option value={item.id} key={i}>{item.name}</Option >
            })
        }
    }
    getEnvData = (id) => {
        axios.get(url + '/project-manage/get-ProjectEnv-List', {
            params: { projectId: id, userName: localStorage.getItem("username") }, 
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }).then((res) => {
            if(res.data.resCode){
                if(res.data.resCode === "00"){
                    this.setState({ srcEnvData: res.data.data })
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
    getDestEnvData = (id) => {
        axios.get(url + '/project-manage/get-ProjectEnv-List', {
            params: { projectId: id, userName: localStorage.getItem("username") },
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }).then((res) => {
            if(res.data.resCode){
                if (res.data.resCode === "00") {
                    this.setState({ destEnvData: res.data.data })
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
    onChangeSrcProId = (value) => {
        this.setState({ srcProId: value, srcEnvId: "" });
        this.getEnvData(value);
    }
    onChangeSrcEnvId = (value) => {
        this.setState({ srcEnvId: value })
    }
    onChangeDestProId = (value) => {
        console.log(value)
        this.getDestEnvData(value);
        this.setState({ destProId: value, destEnvId: "" })
    }
    onChangeDestEnvId = (value) => {
        this.setState({ destEnvId: value })
    }
    render() {
        const options = this.state.keyNameData.map(d => <Option key={d.value}>{d.text}</Option>);
        return (
            <div style={{ padding: "0 20px", display: 'flex', flexDirection: "column" }}>
                <div style={{ padding: "20px 0", display: 'flex', justifyContent: 'flex-end' }}>
                    <Button type="primary" className="add-new-pro" style={{ marginRight: 20 }} onClick={this.isCut}>参数同步</Button>
                    <Button type="primary" className="add-new-pro" icon="folder-add" style={{ marginRight: 20 }} onClick={this.addPro}>参数新增</Button>
                    <RadioGroup onChange={this.onChange} >
                        <RadioButton value="">全部</RadioButton>
                        <RadioButton value="DEV">开发环境</RadioButton>
                        <RadioButton value="TEST">测试环境</RadioButton>
                        <RadioButton value="PRODUCT">生产环境</RadioButton>
                    </RadioGroup>

                    <RadioGroup style={{ marginLeft: 20 }} onChange={this.onChangeStatus} >
                        <RadioButton value="">全部</RadioButton>
                        <RadioButton value="NORMAL">正常</RadioButton>
                        <RadioButton value="ABANDONED">废弃</RadioButton>
                    </RadioGroup>
                </div>

                <Modal
                    title="新增"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    confirmLoading={this.state.loading}
                >
                    <div style={{ paddingBottom: 20 }}>
                        <span style={{ paddingRight: 39 }}>keyName:</span>

                        <Select
                            mode="combobox"
                            placeholder="keyName"
                            value={this.state.keyName}
                            style={{ width: 200 }}
                            defaultActiveFirstOption={false}
                            showArrow={false}
                            filterOption={false}
                            onChange={this.updateKeyName}
                        >
                            {options}
                        </Select>
                        <span style={{ color: "red" }}>*</span>
                    </div>
                    <div style={{ paddingBottom: 20 }}>
                        <span style={{ paddingRight: 42 }}>keyValue:</span>
                        <Input size="large" placeholder="keyValue" style={{ width: "60%" }} value={this.state.keyValue} onChange={this.updateKeyValue} />
                        <span style={{ color: "red" }}>*</span>
                    </div>
                    <div>
                        <span style={{ paddingRight: 66 }}>envId:</span>
                        <Select style={{ width: "60%" }} onChange={this.handleChange}>
                            {this.showNewOption(this.state.optionData)}
                        </Select>
                    </div>
                </Modal>

                <Table
                    columns={this.state.columns}
                    dataSource={this.state.data}
                    bordered
                />

                <Modal
                    title="编辑"
                    visible={this.state.visibleE}
                    onOk={this.handleOkE}
                    onCancel={this.handleCancelE}
                    confirmLoading={this.state.loading}
                >
                    <div style={{ paddingBottom: 20 }}>
                        <span style={{ paddingRight: 49 }}>keyName:</span>
                        <Input size="large" placeholder="keyName" style={{ width: "60%" }} value={this.state.keyNameE} onChange={this.updateKeyNameE} />
                    </div>
                    <div style={{ paddingBottom: 20 }}>
                        <span style={{ paddingRight: 52 }}>keyValue:</span>
                        <Input size="large" placeholder="keyValue" style={{ width: "60%" }} value={this.state.keyValueE} onChange={this.updateKeyValueE} />
                    </div>
                </Modal>
                <Modal
                    title="参数校验"
                    visible={this.state.visibleCheckout}
                    onOk={this.handleOkCheckout}
                    onCancel={this.handleCancelCheckout}
                >
                    <div style={{ paddingBottom: 20 }}>
                        <span style={{ paddingRight: 42 }} >keyName:</span>
                        <Input size="large" style={{ width: "60%" }} value={this.state.checkName} disabled />
                    </div>
                    <div style={{ paddingBottom: 20 }}>
                        <span style={{ paddingRight: 42 }}>keyValue:</span>
                        <Input size="large" style={{ width: "60%" }} value={this.state.checkValue} disabled />
                    </div>
                </Modal>
                <Modal
                    title="废弃"
                    visible={this.state.visibleDel}
                    onOk={this.handleOkDel}
                    onCancel={this.handleCancelDel}
                    confirmLoading={this.state.loading}
                >
                    <h3>确认是否“废弃”？</h3>
                </Modal>

                <Modal
                    title="参数同步"
                    visible={this.state.visibleENV}
                    onOk={this.handleOkENV}
                    onCancel={this.handleCancelENV}
                    width="1020px"
                    confirmLoading={this.state.loading}
                >
                    <span>项目:</span>
                    <Select value={this.state.srcProId} style={{ width: "17%" }} onChange={this.onChangeSrcProId}>
                        {this.showOption(this.state.srcProjectData)}
                    </Select>
                    <span style={{ marginLeft: 10 }}>环境:</span>
                    <Select value={this.state.srcEnvId} style={{ width: "17%", marginRight: 15 }} onChange={this.onChangeSrcEnvId}>
                        {this.showOption(this.state.srcEnvData)}
                    </Select>
                    <span style={{ fontSize: "10px", color: "red" }}>---同步到---></span>
                    <span style={{ marginLeft: 15 }}>选择项目:</span>
                    <Select value={this.state.destProId} style={{ width: "17%" }} onChange={this.onChangeDestProId}>
                        {this.showOption(this.state.srcProjectData)}
                    </Select>
                    <span style={{ marginLeft: 15 }}>选择环境:</span>
                    <Select value={this.state.destEnvId} style={{ width: "17%" }} onChange={this.onChangeDestEnvId}>
                        {this.showOption(this.state.destEnvData)}
                    </Select>
                </Modal>
            </div>
        )
    }
}

export default ParamsMian;