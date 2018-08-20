import React, { Component } from 'react';
import axios from 'axios';
import url from '../../../url';
import { Table, Modal, Button, Select, Input, Radio } from 'antd';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const Option = Select.Option;
class SysAzkaban extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [{
                title: '名称',
                dataIndex: 'name',
            }, {
                title: '类型',
                dataIndex: 'type',
                render: (text, record, index) => {
                    function show(val) {
                        switch (val) {
                            case 'OFFLINE':
                                return '线下';
                            case 'ONLINE':
                                return '线上';
                            default:
                                break;
                        }
                    }
                    return < span > {show(text)}</span>
                }
            }, {
                title: 'hostUrl',
                dataIndex: 'hostUrl',
            }, {
                title: '时间',
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
                title: '更多操作',
                key: 'doing',
                render: (text) => {
                    return (
                        <Button onClick={this.isEdit.bind(this, text)}>编辑</Button>
                    )
                }
            }],
            data: [],
            visibleN: false,
            typeN: "",
            nameN: "",
            hostUrlN: "",
            visible: false,
            type: "",
            name: "",
            hostUrl: "",
            text: "",
            status: "",
            loading:false,
        }
    }
    componentDidMount() {
        this.getData(this.state.status);
    }
    getData = (type) => {
        axios.get(url + '/system-manage/get-all-sysAzConfig', {
            params:{
                type:type
            },
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
    onChange = (e) => {
        this.setState({ status: e.target.value })
        this.getData(e.target.value)
    }
    isNew = () => {
        this.setState({ visibleN: true })
    }
    newName = (e) => {
        this.setState({ nameN: e.target.value })
    }
    newType = (value) => {
        this.setState({ typeN: value })
    }
    newHostUrl = (e) => {
        this.setState({ hostUrlN: e.target.value })
    }
    handleOkN = () => {
        let params = {
            hostUrl: this.state.hostUrlN,
            name: this.state.nameN,
            type: this.state.typeN,
            userName: localStorage.getItem("username")
        }
        if (!params.name) {
            Modal.warning({
                title: '警告',
                content: '名称不能为空',
            });
            return false;
        }
        if (!params.type) {
            Modal.warning({
                title: '警告',
                content: '类型不能为空',
            });
            return false;
        }
        if (!params.hostUrl) {
            Modal.warning({
                title: '警告',
                content: 'hostUrl不能为空',
            });
            return false;
        }
        this.setState({ loading: true });
        axios.post(url + "/system-manage/create-sysAzConfig", params, {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }).then((res) => {
            if (res.data.resCode) {
                if (res.data.resCode === '00') {
                    this.getData(this.state.status);
                    this.setState({ visibleN: false, nameN: "", typeN: "", hostUrlN: "" })
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
    handleCancelN = () => {
        this.setState({ visibleN: false, nameN: "", typeN: "", hostUrlN: "" })
    }
    isEdit = (text) => {
        this.setState({ visible: true, name: text.name, type: text.type, hostUrl: text.hostUrl, text })
    }
    editName = (e) => {
        this.setState({ name: e.target.value })
    }
    editType = (value) => {
        this.setState({ type: value })
    }
    editHostUrl = (e) => {
        this.setState({ hostUrl: e.target.value })
    }
    handleOk = () => {
        let data = this.state.text;
        let params = {
            createdAt: data.createdAt,
            createdBy: data.createdBy,
            hostUrl: this.state.hostUrl,
            id: data.id,
            name: this.state.name,
            type: this.state.type,
            updatedAt: data.updatedAt,
            updatedBy: data.updatedBy,
            userName: localStorage.getItem("username")
        }
        if (!params.name) {
            Modal.warning({
                title: '警告',
                content: '名称不能为空',
            });
            return false;
        }
        if (!params.type) {
            Modal.warning({
                title: '警告',
                content: '类型不能为空',
            });
            return false;
        }
        if (!params.hostUrl) {
            Modal.warning({
                title: '警告',
                content: 'hostUrl不能为空',
            });
            return false;
        }
        this.setState({ loading: true });
        axios.post(url + "/system-manage/update-sysAzConfig", params, {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }).then((res) => {
            if (res.data.resCode) {
                if (res.data.resCode === '00') {
                    this.getData(this.state.status);
                    this.setState({ visible: false, name: "", type: "", hostUrl: "" })
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
        this.setState({ visible: false, name: "", type: "", hostUrl: "" })
    }
    render() {
        return (
            <div style={{ padding: "0 20px", display: 'flex', flexDirection: "column" }}>
                <div style={{ padding: "20px 0", display: 'flex', justifyContent: 'flex-end' }}>
                    <Button type="primary" className="add-new-pro" icon="folder-add" style={{ marginRight: 20 }} onClick={this.isNew}>新建</Button>
                    <RadioGroup defaultValue="" onChange={this.onChange} >
                        <RadioButton value="">全部</RadioButton>
                        <RadioButton value="OFFLINE">线下</RadioButton>
                        <RadioButton value="ONLINE">线上</RadioButton>
                    </RadioGroup>
                </div>
                <div>
                    <Table
                        columns={this.state.columns}
                        dataSource={this.state.data}
                        bordered
                    />
                </div>
                <Modal
                    title="新增"
                    visible={this.state.visibleN}
                    onOk={this.handleOkN}
                    onCancel={this.handleCancelN}
                    maskClosable={false}
                    confirmLoading={this.state.loading}
                >
                    <div style={{ padding: 10 }}>
                        <span style={{ paddingRight: 26 }}>名称:</span>
                        <Input style={{ width: 200 }} value={this.state.nameN} onChange={this.newName} />
                    </div>
                    <div style={{ padding: 10 }}>
                        <span style={{ paddingRight: 26 }}>类型:</span>
                        <Select style={{ width: 200 }} value={this.state.typeN} onChange={this.newType}>
                            < Option value='OFFLINE' >线下</Option >
                            < Option value='ONLINE' >线上</Option >
                        </Select>
                    </div>
                    <div style={{ padding: 10 }}>
                        <span style={{ paddingRight: 10 }}>hostUrl:</span>
                        <Input style={{ width: 300 }} value={this.state.hostUrlN} onChange={this.newHostUrl} />
                    </div>
                </Modal>
                <Modal
                    title="编辑"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    maskClosable={false}
                    confirmLoading={this.state.loading}
                >
                    <div style={{ padding: 10 }}>
                        <span style={{ paddingRight: 26 }}>名称:</span>
                        <Input style={{ width: 200 }} value={this.state.name} onChange={this.editName} />
                    </div>
                    <div style={{ padding: 10 }}>
                        <span style={{ paddingRight: 26 }}>类型:</span>
                        <Select style={{ width: 200 }} value={this.state.type} onChange={this.editType}>
                            < Option value='OFFLINE' >线下</Option >
                            < Option value='ONLINE' >线上</Option >
                        </Select>
                    </div>
                    <div style={{ padding: 10 }}>
                        <span style={{ paddingRight: 10 }}>hostUrl:</span>
                        <Input style={{ width: 300 }} value={this.state.hostUrl} onChange={this.editHostUrl} />
                    </div>
                </Modal>
            </div>
        )
    }
}

export default SysAzkaban;