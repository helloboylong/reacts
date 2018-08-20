import React, { Component } from 'react';
import axios from 'axios';
import url from '../../../url';
import { Input, Button, Modal, Table, Select, message } from 'antd';
const Option = Select.Option;
class Main extends Component {
    constructor(props) {
        super(props)
        this.state = {
            name:"",
            appHostUrl:"",
            azkabanHostUrl:"",
            type:"",
            visible:false,
            data:[],
            columns: [{
                title: '环境名称',
                dataIndex: 'name',
            }, {
                title: '环境类型',
                dataIndex: 'type',
                render: (text, record, index) => {
                    return (
                        <span >{this.showType(text)}</span>
                    )
                }
            }, {
                title: 'app推送地址',
                dataIndex: 'appHostUrl',
            }, {
                title: 'azkaban推送地址',
                dataIndex: 'azkabanHostUrl',
            }, {
                title: '编辑',
                dataIndex: 'doing',
                render: (text, record, index) => {
                    return (
                        <Button onClick={this.edit.bind(this,record)}>编辑</Button>
                    )
                }
            }],
            idE:"",
            projectIdE:"",
            statusE:"",
            nameE: "",
            appHostUrlE: "",
            azkabanHostUrlE: "",
            typeE: "",
            visibleE: false,
            isShow: { display: 'none'},
            visiblePAR:false,
            projectData:[],
            srcProjectId:"",
            destProjectId:"",
            destProjectValue:"",
            id:"",
            appHostUrlData:[],
            azHostUrlData:[],
            loading:false,
        }
    }
    componentDidMount() {
        let ele = window.location.hash;
        let id = ele.substring(ele.lastIndexOf('=')+1, ele.length)
        this.setState({id})
        this.getData(id);
        this.isSync(id);
        axios.get(url + '/project-manage/project', {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }).then((res) => {
            if(res.data.resCode){
                if(res.data.resCode === "00"){
                    this.setState({projectData:res.data.data})
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
    showOption = (arr) => {
        if (arr && Array.isArray(arr) && arr.length > 0) {
            return arr.map((item, i) => {
                return < Option value={item.id} key={i}>{item.name}</Option >
            })
        }
    }
    getData = (id) => {
        axios.get(url + '/project-manage/get-ProjectEnv-List', {
            params: { projectId: id, userName: localStorage.getItem("username") },
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }).then((res) => {
            if(res.data.resCode){
                if (res.data.resCode === "00") {
                    res.data.data.forEach((item, i) => {
                        item.key = i
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
    isSync = (id) => {
        axios.get(url + '/project-manage/get-sync-project-env-status', {
            params: { destProjectId: id, userName: localStorage.getItem("username") },
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }).then((res) => {
            if(res.data.resCode){
                if(res.data.resCode === "00"){
                    if(res.data.data === false) {
                        this.setState({isShow:{display:'none'}})
                    }else{
                        this.setState({ isShow: { display: 'block' } })
                    }
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
        this.isSync(id);
    }
    showType = (value) => {
        switch (value) {
            case "DEV":
                return "开发环境(DEV)";
            case "TEST":
                return "测试环境(TEST)";
            case "PRODUCT":
                return "生产环境(PRODUCT)";
            default:
                break;
        }
    }
    addPro = () =>{
        this.setState({ visible:true});
    }
    getAppData = (value) => {
        axios.get(url + '/system-manage/get-all-syAppConfig', {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }).then((res) => {
            if (res.data.resCode) {
                if (res.data.resCode === "00") {
                    let data = [];
                    if (value === 'DEV' || value === 'TEST') {
                        res.data.data.forEach((item, i) => {
                            if (item.type === 'OFFLINE') {
                                data.push(item)
                            }
                        })
                        this.setState({ appHostUrlData: data })
                    } else if (value === 'PRODUCT') {
                        res.data.data.forEach((item, i) => {
                            if (item.type === 'ONLINE') {
                                data.push(item)
                            }
                        })
                        this.setState({ appHostUrlData: data })
                    } else {
                        this.setState({ appHostUrlData: data })
                    }
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
    getAzData = (value) => {
        axios.get(url + '/system-manage/get-all-sysAzConfig', {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }).then((res) => {
            if (res.data.resCode) {
                if (res.data.resCode === "00") {
                    let data = [];
                    if(value === 'DEV' || value === 'TEST'){
                        res.data.data.forEach((item,i)=>{
                            if(item.type === 'OFFLINE'){
                                data.push(item)
                            }
                        })
                        this.setState({ azHostUrlData: data })
                    }else if(value === 'PRODUCT'){
                        res.data.data.forEach((item, i) => {
                            if (item.type === 'ONLINE') {
                                data.push(item)
                            }
                        })
                        this.setState({ azHostUrlData: data })
                    }else{
                        this.setState({ azHostUrlData: data })
                    }
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
    showOptionData = (arr) => {
        if(arr && Array.isArray(arr) && arr.length>0){
            return arr.map((item, i) => {
                return < Option value={item.id} key={i}>{item.name+'('+item.hostUrl+')'}</Option >
            })
        }
    }
    updateName = (e) =>{
        this.setState({name:e.target.value})
    }
    updateAppHostUrl = (e) => {
        this.setState({ appHostUrl: e })
    }
    updateAzkabanHostUrl = (e) => {
        this.setState({ azkabanHostUrl: e })
    }
    handleChange = (value) => {
        this.getAzData(value);
        this.getAppData(value);
        this.setState({type:value})
    }
    handleOk = () => {
        let data = this.state;
        if (!data.name) {
            Modal.warning({
                title: '警告',
                content: "name不能为空",
            });
            return false;
        }
        if (!data.appHostUrl) {
            Modal.warning({
                title: '警告',
                content: "appHostUrl不能为空",
            });
            return false;
        }
        if (!data.azkabanHostUrl) {
            Modal.warning({
                title: '警告',
                content: "azkabanHostUrl不能为空",
            });
            return false;
        }
        if (!data.type) {
            Modal.warning({
                title: '警告',
                content: "type不能为空",
            });
            return false;
        }
        let params = {
            "status": null,
            projectId: this.state.id,
            name: data.name,
            appId:data.appHostUrl,
            azId:data.azkabanHostUrl,
            type:data.type,
            userName: localStorage.getItem("username"),
        }
        this.setState({ loading: true });
        axios.post(url + "/project-manage/create-projectEnv", params, {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }).then((res) => {
            if(res.data.resCode){
                if (res.data.resCode === '00') {
                    message.info(res.data.resMsg, 1)
                    this.getData(this.state.id);
                    this.setState({ 
                        name: "",
                        appHostUrl: "",
                        azkabanHostUrl: "",
                        visible: false ,
                        type: "",
                        appHostUrlData: [],
                        azHostUrlData: []
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
            visible: false,
            name: "",
            appHostUrl: "",
            azkabanHostUrl: "",
            type: "",
            appHostUrlData: [],
            azHostUrlData: [],
        })
    }
    edit = (data) => {
        this.getAzData(data.type);
        this.getAppData(data.type);
        this.setState({ 
            idE: data.id,
            projectIdE: data.projectId,
            statusE: data.status,
            nameE: data.name,
            appHostUrlE: data.appId,
            azkabanHostUrlE: data.azId,
            typeE: data.type,
            visibleE:true,
        })
    }
    updateNameE = (e) => {
        this.setState({ nameE: e.target.value })
    }
    updateAppHostUrlE = (e) => {
        this.setState({ appHostUrlE: e })
    }
    updateAzkabanHostUrlE = (e) => {
        this.setState({ azkabanHostUrlE: e })
    }
    handleChangeE = (value) => {
        this.getAzData(value);
        this.getAppData(value);
        this.setState({ typeE: value })
    }
    handleOkE = () => {
        let data = this.state;
        if (!data.nameE) {
            Modal.warning({
                title: '警告',
                content: "name不能为空",
            });
            return false;
        }
        if (!data.appHostUrlE) {
            Modal.warning({
                title: '警告',
                content: "appHostUrl不能为空",
            });
            return false;
        }
        if (!data.azkabanHostUrlE) {
            Modal.warning({
                title: '警告',
                content: "azkabanHostUrl不能为空",
            });
            return false;
        }
        if (!data.typeE) {
            Modal.warning({
                title: '警告',
                content: "type不能为空",
            });
            return false;
        }
        
        let params = {
            appId: data.appHostUrlE,
            azId: data.azkabanHostUrlE,
            id: data.idE,
            name: data.nameE,
            projectId: data.projectIdE,
            status: "NORMAL",
            type: data.typeE,
            userName: localStorage.getItem("username"),
        }
        this.setState({ loading: true });
        axios.post(url + "/project-manage/update-projectEnv", params, {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }).then((res) => {
            if(res.data.resCode){
                if (res.data.resCode === '00') {
                    message.info(res.data.resMsg, 1)
                    this.getData(this.state.id);
                    this.setState({
                        nameE:"",
                        appHostUrlE:"",
                        azkabanHostUrlE:"",
                        visibleE:false
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
            nameE: "",
            appHostUrlE: "",
            azkabanHostUrlE: "",
            visibleE: false
        })
    }
    isCut = () => {
        let destProjectId, data = this.state.projectData;
        for(let i = 0; i<data.length; i++){
            if (this.state.id === data[i].id.toString()){
                destProjectId = data[i].name;
                break;
            }
        }
        this.setState({ visiblePAR: true, destProjectValue: destProjectId})
    }
    handleSrc = (value) => {
        this.setState({srcProjectId:value})
    }
    handleDest = (value) => {
        this.setState({ destProjectId: value })
    }
    handleOkPAR = () => {
        let params = {
            srcProjectId: this.state.srcProjectId,
            destProjectId: this.state.id,
            userName:localStorage.getItem("username")
        }

        if (!params.srcProjectId) {
            Modal.warning({
                title: '警告',
                content: '项目不能为空',
            });
            return false;
        }
        this.setState({ loading: true });
        axios.post(url + '/project-manage/sync-project-env', params, {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }).then((res) => {
            if(res.data.resCode){
                if (res.data.resCode === '00') {
                    message.info(res.data.resMsg, 1)
                    this.setState({ visiblePAR: false, srcProjectId: "", destProjectId: "" })
                    this.getData(this.state.id);
                    this.isSync(this.state.id);
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
    handleCancelPAR = () => {
        this.setState({ visiblePAR: false })
    }
    render() {
        return (
            <div style={{ padding: "0 20px", display: 'flex', flexDirection: "column" }}>
                <div style={{ padding: "20px 0", display: 'flex', justifyContent: 'flex-end' }}>
                    <Button type="primary" className="add-new-pro" style={this.state.isShow} onClick={this.isCut}>环境同步</Button>
                    <Button type="primary" className="add-new-pro" icon="folder-add" style={{ margin: '0 20px' }} onClick={this.addPro}>环境新增</Button>
                    <Modal
                        title="新增"
                        visible={this.state.visible}
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                        confirmLoading={this.state.loading}
                    >
                        <div style={{ paddingBottom: 20 }}>
                            <span style={{ paddingRight: 73 }}>name:</span>
                            <Input size="large" placeholder="name" style={{ width: "60%" }} value={this.state.name} onChange={this.updateName} />
                        </div>
                        <div style={{ paddingBottom: 20 }}>
                            <span style={{ paddingRight: 80 }}>type:</span>
                            <Select style={{ width: "60%" }} value={this.state.type} onChange={this.handleChange}>
                                <Option value="DEV">开发环境</Option>
                                <Option value="TEST">测试环境</Option>
                                <Option value="PRODUCT">生产环境</Option>
                            </Select>
                        </div>
                        <div style={{ paddingBottom: 20 }}>
                            <span style={{ paddingRight: 25 }}>app host地址:</span>
                            <Select style={{ width: "60%" }} value={this.state.appHostUrl} onChange={this.updateAppHostUrl}>
                                {this.showOptionData(this.state.appHostUrlData)}
                            </Select>
                        </div>
                        <div>
                            <span style={{ paddingRight: 35 }}>az host地址:</span>
                            <Select style={{ width: "60%" }} value={this.state.azkabanHostUrl} onChange={this.updateAzkabanHostUrl}>
                                {this.showOptionData(this.state.azHostUrlData)}
                            </Select>
                        </div>
                    </Modal>
                </div>
                <div>
                    <Table
                        columns={this.state.columns}
                        dataSource={this.state.data}
                        bordered
                    />
                </div>

                <Modal
                    title="环境同步"
                    visible={this.state.visiblePAR}
                    onOk={this.handleOkPAR}
                    onCancel={this.handleCancelPAR}
                    width="550px"
                    confirmLoading={this.state.loading}
                >
                    <span>项目:</span>
                    <Select  style={{ width: "30%" }} value={this.state.srcProjectId} onChange={this.handleSrc}>
                        {this.showOption(this.state.projectData)}
                    </Select>
                    <span style={{ fontSize: "10px", color: "red" }}>---同步到---></span>
                    <span style={{ marginLeft: 15 }}>选择项目:</span>
                    <Select style={{ width: "30%" }} value={this.state.destProjectValue} onChange={this.handleDest} disabled>
                        {this.showOption(this.state.projectData)}
                    </Select>
                </Modal>

                <Modal
                    title="编辑"
                    visible={this.state.visibleE}
                    onOk={this.handleOkE}
                    onCancel={this.handleCancelE}
                    confirmLoading={this.state.loading}
                >
                    <div style={{ paddingBottom: 20 }}>
                        <span style={{ paddingRight: 73 }}>name:</span>
                        <Input size="large" placeholder="name" style={{ width: "60%" }} value={this.state.nameE} onChange={this.updateNameE} />
                    </div>
                    <div style={{ paddingBottom: 20 }}>
                        <span style={{ paddingRight: 80 }}>type:</span>
                        <Select value={this.state.typeE} style={{ width: "60%" }} onChange={this.handleChangeE}>
                            <Option value="DEV">开发环境</Option>
                            <Option value="TEST">测试环境</Option>
                            <Option value="PRODUCT">生产环境</Option>
                        </Select>
                    </div>
                    <div style={{ paddingBottom: 20 }}>
                        <span style={{ paddingRight: 25 }}>app host地址:</span>
                        <Select style={{ width: "60%" }} value={this.state.appHostUrlE} onChange={this.updateAppHostUrlE}>
                            {this.showOptionData(this.state.appHostUrlData)}
                        </Select>
                    </div>
                    <div >
                        <span style={{ paddingRight: 35 }}>az host地址:</span>
                        <Select style={{ width: "60%" }} value={this.state.azkabanHostUrlE} onChange={this.updateAzkabanHostUrlE}>
                            {this.showOptionData(this.state.azHostUrlData)}
                        </Select>
                    </div>
                </Modal>
            </div>
        )
    }
}

export default Main;