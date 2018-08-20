import React, { Component } from 'react';
import axios from 'axios';
import url from '../../../url';
import { Table, Radio, Menu, Dropdown, Icon, Modal, Select } from 'antd';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const Option = Select.Option;
class TestVersion extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading:false,
            visible: false,
            params: {},
            processType: "TAG",
            status: "",
            projectId: "",
            flowId: "",
            flowData: [],
            data: [],
            columns: [{
                title: '项目名称',
                dataIndex: 'projectName',
                render: text => <span >{text}</span>,
            }, {
                title: 'flow名称',
                dataIndex: 'flowName',
                render: text => <span >{text}</span>,
            }, {
                title: 'tag名称',
                dataIndex: 'tagName',
                key: 'tagName',
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
                        < Dropdown overlay = {menu} disabled = {text.processActions.length === 0 ? true : false}>
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
        let showMore = {
            processType: this.state.processType,
            projectId: localStorage.getItem("projectId"),
            userName: localStorage.getItem("username")
        }
        this.getData(showMore);
        this.getFlowName(localStorage.getItem("projectId"))
        this.setState({ projectId: localStorage.getItem("projectId") })
    }
    componentWillReceiveProps(nextProps) {
        let showMore = {
            processType: this.state.processType,
            projectId: localStorage.getItem("projectId"),
            userName: localStorage.getItem("username")
        }
        this.getData(showMore);
        this.getFlowName(localStorage.getItem("projectId"))
        this.setState({ projectId: localStorage.getItem("projectId") })
    }

    getData = (obj) => {
        axios.get(url + '/process-center/get-process-display', {
            params: obj, 
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
    onChange = (e) => {
        this.setState({ status: e.target.value })
        let showMore = {
            processType: this.state.processType,
            projectId: this.state.projectId,
            flowId: this.state.flowId,
            status: e.target.value,
            userName: localStorage.getItem("username")
        }
        this.getData(showMore);
    }

    updateFlowName = (value) => {
        this.setState({ flowId: value })
        let showMore = {
            processType: this.state.processType,
            projectId: this.state.projectId,
            flowId: value,
            status: this.state.status,
            userName: localStorage.getItem("username")
        }
        this.getData(showMore);
    }
    getFlowName = (params) => {
        axios.get(url + '/workspace/flow', {
            params: { projectId: params }, 
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }).then((res) => {
            if(res.data.resCode){
                if(res.data.resCode === "00"){
                    this.setState({ flowData: res.data.data })
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
        return arr.map((item, i) => {
            return <Option key={item.id} value={item.id}>{item.name}</Option>
        })
    }
    showNextProcess = (arr) => {
        return arr.map((item, i) => {
            return (
                <Menu.Item key={item.id} value={item.code}>{item.name}</Menu.Item>
            )
        })
    }
    onClick = (obj, e) => {
        let params = {
            projectId: obj.projectId,
            flowId: obj.flowId,
            processType: this.state.processType,
            processName: obj.tagName,
            processAction: e.item.props.value,
            userName: localStorage.getItem("username")
        }
        if (e.item.props.value === 'FAIL') {
            this.setState({ visible: true, params: params })
            return false;
        }
        this.isNextDoing(params);
    };
    handleOk = () => {
        this.isNextDoing(this.state.params);
        this.setState({ visible: false })
    }
    handleCancel = () => {
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
                    // window.location.reload()
                    let showMore = {
                        processType: this.state.processType,
                        projectId: localStorage.getItem("projectId"),
                        userName: localStorage.getItem("username")
                    }
                    this.getData(showMore);
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
    render() {
        return (
            <div style={{ padding: "0 20px", display: 'flex', flexDirection: "column" }}>
                <div style={{ padding: "20px 0", display: 'flex', justifyContent: 'flex-end' }}>
                    <RadioGroup defaultValue="" onChange={this.onChange} >
                        <RadioButton value="">全部</RadioButton>
                        <RadioButton value="INIT">创建</RadioButton>
                        <RadioButton value="TEST_SUCCESS">测试成功</RadioButton>
                        <RadioButton value="WAITING_ONLINE">等待上线</RadioButton>
                        <RadioButton value="ONLINE_SUCCESS">上线成功</RadioButton>
                        <RadioButton value="ONLINE_COVER">曾经上线</RadioButton>
                        <RadioButton value="FAIL">失败</RadioButton>
                    </RadioGroup>
                    <div style={{ position: "relative", marginLeft: 20 }}>
                        <Select value={this.state.flowId} style={{ width: 120 }} onChange={this.updateFlowName}>
                            <Option value="">ALL</Option>
                            {this.showOption(this.state.flowData)}
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
                    title="提示"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    confirmLoading={this.state.loading}
                >
                    <h3>确认执行失败操作？</h3>
                </Modal>
            </div>
        )
    }
}

export default TestVersion;
