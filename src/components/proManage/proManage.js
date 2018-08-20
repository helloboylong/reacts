import React, { Component } from 'react';
import axios from 'axios';
import url from '../../url';
import './proMange.css';
import { Card, Col, Row, Select, Icon, Modal, Input, message, Button } from 'antd';
const Option = Select.Option;

class proManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            proNameData: [],
            visible: false,
            projectName: "",
            projectDesc: "",
            visibleDel: false,
            id: "",
            status: "",
            flag: true,
            applyName:"",
            loading:false,
        }
    }

    componentDidMount() {
        this.getData();
    }
    getData = () => {
        axios.get(url + '/project-manage/project', {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }).then((res) => {
            if(res.data.resCode){
                if (res.data.resCode === "00") {
                    this.setState({
                        data: res.data.data,
                        proNameData: res.data.data
                    })
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
    showList = (data) => {
        if (data && Array.isArray(data) && data.length > 0) {
            return data.map((item, i) => {
                return (
                    <Col span="6" key={i}>
                        <Card
                            title={item.name}
                            bordered
                            actions={[<a href={window.location.origin + window.location.pathname + "#/proManage/setConfig?id=" + item.id} ><Icon type="setting" />配置</a>,
                            this.chooseStatus(item.status, item.id, item.status)]}
                            style={{ margin: 10, height: 174 }}
                        >
                            <div>{item.description}</div>
                        </Card>
                    </Col>
                )
            })
        }
    }
    chooseStatus = (value, id, status) => {
        switch (value) {
            case 'INIT':
                return <span onClick={() => { this.isDelete(id, status) }}><Icon type="delete" />置为失效</span>;
            case 'ABANDONED':
                return <span onClick={() => { this.isRollBack(id, status) }}><Icon type="rollback" />恢复有效</span>;
            case 'REVIEW_SUCCESS':
                return <span><Icon type="delete" />审核成功</span>;
            case 'REVIEWING':
                return <span><Icon type="delete" />提交审核</span>;
            case 'REVIEW_FAIL':
                return <span><Icon type="delete" />审核失败</span>;
            default:
                break;
        }
    }
    showOption = (data) => {
        if (data && Array.isArray(data) && data.length > 0) {
            return data.map((item, i) => {
                return <Option value={item.id} key={i} >{item.name}</Option>
            })
        }
    }
    isDelete = (id, status) => {
        this.setState({ id, status, visibleDel: true })
    }
    isRollBack = (id, status) => {

        axios.get(url + '/project-manage/delete-project', {
            params: { id: id, status: status },
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }).then((res) => {
            if(res.data.resCode){
                if (res.data.resCode === "00") {
                    message.info(res.data.resMsg, 1)
                    this.getData();
                    this.setState({ visibleDel: false })
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
    handleOkDel = () => {
        this.setState({ loading: true });
        axios.get(url + '/project-manage/delete-project', {
            params: { id: this.state.id, status: this.state.status },
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }).then((res) => {
            if(res.data.resCode){
                if (res.data.resCode === "00") {
                    message.info(res.data.resMsg, 1)
                    this.getData();
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
    handleChange = (value) => {
        console.log(value)
        axios.get(url + '/project-manage/get-project-by-id', {
            params: { id: value },
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }).then((res) => {
            if(res.data.resCode){
                if (res.data.resCode === "00") {
                    if (Array.isArray(res.data.data)) {
                        this.setState({ data: res.data.data })
                    } else {
                        let arr = [];
                        arr.push(res.data.data)
                        this.setState({ data: arr })
                    }
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
    addProject = () => {
        this.setState({
            visible: true,
        });
    }
    handleOk = (e) => {
        let obj = {
            name: this.state.projectName,
            description: this.state.projectDesc,
            userName: this.state.applyName
        }
        if (!obj.name) {
            Modal.warning({
                title: '警告',
                content: '名称不能为空',
            });
            return false;
        }
        if (!obj.description) {
            Modal.warning({
                title: '警告',
                content: '描述不能为空',
            });
            return false;
        }
        this.setState({ loading: true });
        axios.post(url + '/project-manage/create-project', obj, {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }).then((res) => {
            if(res.data.resCode){
                if (res.data.resCode === "00") {
                    message.info(res.data.resMsg, 1)
                    this.getData();
                    this.setState({
                        visible: false,
                        projectName: "",
                        projectDesc: "",
                        applyName:""
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
            console.log(err.status);
        })
    }
    handleCancel = (e) => {
        this.setState({
            visible: false,
            projectName: "",
            projectDesc: "",
            applyName:""
        });
    }
    updateApplyName = (e) => {
        this.setState({applyName:e.target.value})
    }
    updateProName = (e) => {
        this.setState({ projectName: e.target.value })
    }
    updateProDesc = (e) => {
        this.setState({ projectDesc: e.target.value })
    }
    showAll = () => {
        let flag = this.state.flag
        this.setState({ flag: !flag, })
        if (flag === false) {
            this.getData();
        } else {
            axios.get(url + '/project-manage/all-project', {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            }).then((res) => {
                if(res.data.resCode){
                    if (res.data.resCode === "00") {
                        this.setState({
                            data: res.data.data,
                        })
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
    }
    render() {
        let show = this.state.flag ? "显示所有" : "显示所有有效"
        return (
            <div className='main'>
                <div className='main-col' style={{ padding: 20 }}>
                    <div style={{ marginBottom: 10, display: "flex", justifyContent: "space-between" }}>
                        <div>
                            <span style={{ paddingRight: 10 }}>所有有效项目：</span>
                            <Select defaultValue="" style={{ width: 120 }} onChange={this.handleChange}>
                                <Option value="">all</Option>
                                {this.showOption(this.state.proNameData)}
                            </Select>
                        </div>
                        <Button onClick={this.showAll}>{show}</Button>
                    </div>
                    <div style={{ background: '#ECECEC', padding: '30px' }}>
                        <Row>
                            {this.showList(this.state.data)}
                            <Col span="6">
                                <a className='add-project add-pro' onClick={this.addProject}><Icon type="plus" />新增</a>
                            </Col>
                        </Row>
                    </div>
                </div>

                <Modal
                    title="置为失效"
                    visible={this.state.visibleDel}
                    onOk={this.handleOkDel}
                    onCancel={this.handleCancelDel}
                    confirmLoading={this.state.loading}
                >
                    <span>是否确认“置为失效”？</span>
                </Modal>

                <Modal
                    title="新建"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    confirmLoading={this.state.loading}
                >
                    <div>
                        <span style={{ paddingRight: 11 }}>项目名称:</span>
                        <Input size="large" placeholder="项目名称" style={{ width: "80%" }} value={this.state.projectName} onChange={this.updateProName} />
                        <span style={{ color: "red" }}>*</span>
                    </div>
                    <div style={{ padding: "20px 0" }}>
                        <span style={{ paddingRight: 11 }}>描述信息:</span>
                        <Input size="large" placeholder="描述信息" style={{ width: "80%" }} value={this.state.projectDesc} onChange={this.updateProDesc} />
                        <span style={{ color: "red" }}>*</span>
                    </div>
                    <div>
                        <span style={{ paddingRight: 26 }}>申请人:</span>
                        <Input size="large" placeholder="申请人" style={{ width: "80%" }} value={this.state.applyName} onChange={this.updateApplyName} />
                        <span style={{ color: "red" }}>*</span>
                    </div>
                </Modal>

            </div>
        )
    }
}

export default proManage;