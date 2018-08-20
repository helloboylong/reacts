import React, { Component } from 'react';
import axios from 'axios';
import url from '../../../url';
import MoreSelect from 'react-select';
import 'react-select/dist/react-select.css';
import { Radio, Select, Button, Modal, Input, Menu, Dropdown, Icon, Table } from 'antd';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const Option = Select.Option;
class OnlineVersion extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading:false,
            status: "",
            processType: "REG",
            projectId: "",
            optionData: [],
            visible: false,
            visibleF: false,
            params: {},
            flowData: [],
            defaultProId: "",
            dependData: [],
            value: [],
            regName: "reg_",
            data: [],
            columns: [{
                title: '项目名称',
                dataIndex: 'projectName',
                render: text => <span >{text}</span>,
            }, {
                title: 'reg名称',
                dataIndex: 'regName',
                render: text => <span >{text}</span>,
            }, {
                title: '状态',
                dataIndex: 'statusDto',
                key: 'statusDto',
                render: (text, record, index) => <span >{text.name}</span>
            }, {
                title: '更多操作',
                key: 'doing',
                render: (text) => {
                    const menu = (
                        <Menu onClick={this.onClick.bind(this, text)}>
                            {this.showNextProcess(text.processActions)}
                        </Menu>
                    );

                    return (
                        < Dropdown overlay={menu} disabled={text.processActions.length === 0 ? true : false}>
                            <a className="ant-dropdown-link" >
                                More actions <Icon type="down" />
                            </a>
                        </Dropdown>
                    )
                }
            }],
        }
    }
    componentDidMount() {
        let params = {
            processType: this.state.processType,
            projectId: localStorage.getItem("projectId"),
            userName: localStorage.getItem("username")
        }
        this.getData(params);
        this.setState({ projectId: localStorage.getItem("projectId") })
        this.getFlowData();
    }
    componentWillReceiveProps(nextProps) {
        let params = {
            processType: this.state.processType,
            projectId: localStorage.getItem("projectId"),
            userName: localStorage.getItem("username")
        }
        this.getData(params);
        this.setState({ projectId: localStorage.getItem("projectId") })
        this.getFlowData();
    }

    getData = (obj) => {
        axios.get(url + '/process-center/get-process-display', {
            params: obj, 
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }).then((res) => {
            if(res.data.resCode){
                if(res.data.resCode === "00"){
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

    showNextProcess = (arr) => {
        return arr.map((item, i) => {
            return (
                <Menu.Item key={i} value={item.code}>{item.name}</Menu.Item>
            )
        })
    }
    onClick = (obj, e) => {
        let params = {
            projectId: obj.projectId,
            flowId: obj.regId,
            processType: this.state.processType,
            processName: obj.regName,
            processAction: e.item.props.value,
            userName: localStorage.getItem("username")
        }
        if (e.item.props.value === 'FAIL') {
            this.setState({ visible: true, params: params })
            return false;
        }
        this.isNextDoing(params);
    };
    handleOkF = () => {
        this.isNextDoing(this.state.params);
        this.setState({ visible: false })
    }
    handleCancelF = () => {
        this.setState({ visible: false })
    }
    isNextDoing = (params) => {
        this.setState({ loading: true });
        axios.post(url + '/process-center/execute-next-process', params, {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }).then((res) => {
            if(res.data.resCode){
                if (res.data.resCode === "00") {
                    this.getData({ 
                        processType: this.state.processType,
                        projectId: localStorage.getItem("projectId"),
                        userName: localStorage.getItem("username") 
                    });
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
    showSearchOption = (arr) => {
        return arr.map((item, i) => {
            return <Option value={item.id} key={i}>{item.name}</Option>
        })
    }
    onChange = (e) => {
        this.setState({ status: e.target.value })
        let params = {
            processType: this.state.processType,
            status: e.target.value,
            projectId: this.state.projectId,
            userName: localStorage.getItem("username")
        }
        this.getData(params)
    }
    newTAG = () => {
        this.setState({ visible: true })
    }
    getFlowData = () => {
        axios.get(url + '/process-center/get-tag-of-project', {
            params: { projectId: localStorage.getItem("projectId"), status: "TEST_SUCCESS,WAITING_ONLINE" },
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }).then((res) => {
            if(res.data.resCode){
                if(res.data.resCode === "00"){
                    let dependData = [];
                    res.data.data.forEach((item) => {
                        let obj = {}
                        obj.label = item.projectName + '-' + item.flowName;
                        obj.value = item.tagId;
                        dependData.push(obj)
                    })
                    this.setState({
                        dependData,
                        flowData: res.data.data
                    });
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
    handleSelectChange = (value) => {
        this.setState({ value });
    }
    updateRegName = (e) => {
        this.setState({ regName: e.target.value })
    }
    handleOk = () => {
        let data = this.state;
        let tag = [];
        data.value.map(item => {
            return tag.push(item.value)
        })
        let params = {
            projectId: localStorage.getItem("projectId"),
            regName: data.regName,
            tagIds: tag.toString(),
        }

        if (!params.regName) {
            Modal.warning({
                title: '警告',
                content: "regName是必填项",
            });
            return false;
        }
        if (!params.tagIds) {
            Modal.warning({
                title: '警告',
                content: "tagIds是必填项",
            });
            return false;
        }
        this.setState({ loading: true });
        axios.post(url + '/process-center/create-reg', params, {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }).then((res) => {
            if(res.data.resCode){
                if (res.data.resCode === "00") {
                    let params = {
                        processType: this.state.processType,
                        projectId: this.state.projectId,
                        userName: localStorage.getItem("username")
                    }
                    this.getData(params);
                    this.setState({ visible: false, value: [], regName: "reg_" })
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
    handleCancel = () => {
        this.setState({ visible: false, value: [], regName: "reg_" })
    }
    render() {
        return (
            <div style={{ padding: "0 20px", display: 'flex', flexDirection: "column" }}>
                <div style={{ padding: "20px 0", display: 'flex', justifyContent: 'flex-end' }}>
                    <Button type="primary" className="add-new-pro" icon="folder-add" style={{ marginRight: 20 }} onClick={this.newTAG} >REG创建</Button>
                    <RadioGroup defaultValue="" onChange={this.onChange} >
                        <RadioButton value="">全部</RadioButton>
                        <RadioButton value="INIT">创建</RadioButton>
                        <RadioButton value="REGRESSION_TESTING">回归测试</RadioButton>
                        <RadioButton value="REGRESSION_SUCCESS">回归成功</RadioButton>
                        <RadioButton value="WAITING_ONLINE">等待上线</RadioButton>
                        <RadioButton value="ONLINE_SUCCESS">上线成功</RadioButton>
                        <RadioButton value="FAIL">失败</RadioButton>
                    </RadioGroup>
                </div>

                <Modal
                    title="新增"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    confirmLoading={this.state.loading}
                >
                    <div style={{ paddingBottom: 20, position: 'relative' }}>
                        <span style={{ position: 'absolute', top: 5 }}>flowName:</span>
                        <div style={{ marginLeft: 78 }}>
                            <MoreSelect
                                multi
                                onChange={this.handleSelectChange}
                                value={this.state.value}
                                options={this.state.dependData}
                            />
                        </div>
                    </div>
                    <div style={{ paddingBottom: 20 }}>
                        <span style={{ paddingRight: 27 }}>reg名称:</span>
                        <Input size="large" placeholder="regName" style={{ width: "40%" }} value={this.state.regName} onChange={this.updateRegName} />
                        <span style={{ color: '#a09797' }}>(样例：dev_20180101_01)</span>
                    </div>

                </Modal>

                <div>
                    <Table
                        columns={this.state.columns}
                        dataSource={this.state.data}
                        bordered
                    />
                </div>
                <Modal
                    title="提示"
                    visible={this.state.visibleF}
                    onOk={this.handleOkF}
                    onCancel={this.handleCancelF}
                    confirmLoading={this.state.loading}
                >
                    <h3>确认执行失败操作？</h3>
                </Modal>
            </div>
        )
    }

}

export default OnlineVersion;