import React, { Component } from 'react';
import axios from 'axios';
import url from '../../url';
import ReactEcharts from 'echarts-for-react';
import { Select, Button, Tree, Icon, Modal, Input, message } from 'antd';
const TreeNode = Tree.TreeNode;
const Option = Select.Option;
class NavSide extends Component {
    constructor(props) {
        super(props)
        this.state = {
            defaultProId: "",
            defaultFlowId: "",
            proData: [],
            flowData: [],
            treeData: [],
            visibleFlow: false,
            visibleTask: false,
            flowName: "",
            flowDesc: "",
            taskName: "",
            taskType: "Hive2Hive",
            createTaskVal: {},
            treenodeMessage: '',
            functionStyle: { show: 'none' },
            visibleSubFlow: false,
            isShow: { display: 'block' },
            isTaskShow: { display: 'block' },
            visibleChart: false,
            dependenceData: [],
            nodeId: "",
            visibleDepend: false,
            isDeleteParams: "",
            showDel: "",
            taskDesc: "",
            visibleTaskRe: false,
            treeName: "",
            loading:false,
        }
    }

    componentDidMount() {
        axios.get(url + '/workspace/get-current-project-by-username', {
            params: {
                userName: localStorage.getItem("username")
            },
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }).then((res) => {
            if (res.data.resCode) {
                if(res.data.resCode === '00'){
                    this.setState({ defaultProId: res.data.data })
                    this.getFlowName(res.data.data);
                    this.getTreeData(res.data.data);
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
            console.log(err);
        })
    }
    componentWillReceiveProps(nextProps) {
        this.setState({ defaultProId: localStorage.getItem("projectId"), defaultFlowId: "" })
        this.getFlowName(localStorage.getItem("projectId"));
        this.getTreeData(localStorage.getItem("projectId"));
    }

    getFlowName = (params) => {
        axios.get(url + '/workspace/flow',{
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

    getTreeData = (projectId, flowNodeId) => {
        axios.get(url + '/workspace/tree-node',{
            params: { projectId: projectId, flowNodeId: flowNodeId },
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
        .then((res) => {
            if(res.data.resCode){
                if(res.data.resCode === "00"){
                    this.setState({ treeData: res.data.data })
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
                return <Option key={item.id} value={item.id}>{item.name}</Option>
            })
        }
    }
    handleFlowChange = (value) => {
        this.setState({ defaultFlowId: value })
        this.getTreeData(this.state.defaultProId, value)
    }
    loopTreeNode(obj) { //递归循环树的子节点
        if (obj && Array.isArray(obj) && obj.length > 0) {
            return obj.map((item, i) => {
                if (item.subNodes && Array.isArray(item.subNodes) && item.subNodes.length > 0) {
                    return (
                        <TreeNode
                            key={item.id}
                            value={item.type}
                            name={item.name}
                            taskId={item.taskId}
                            nodeId={item.id}
                            proId={item.projectId}
                            rootNodeId={item.rootNodeId}
                            title={<span><Icon type={this.checkIcon(item.type, item.versionStatus)} style={this.checkCol(item.versionStatus)} /> &nbsp;{item.name}</span>}
                        >
                            {this.loopTreeNode(item.subNodes)}
                        </TreeNode>
                    )
                } else {
                    return (
                        <TreeNode
                            key={item.id}
                            value={item.type}
                            name={item.name}
                            taskId={item.taskId}
                            nodeId={item.id}
                            proId={item.projectId}
                            rootNodeId={item.rootNodeId}
                            title={<span><Icon type={this.checkIcon(item.type)} style={this.checkCol(item.versionStatus)} /> &nbsp;{item.name}</span>}
                        />
                    )
                }
            })
        }
    }
    checkIcon = (value) => {
        switch (value) {
            case 'FLOW':
                return 'folder';
            case 'SUB_FLOW':
                return 'folder';
            case 'TASK':
                return 'setting';
            default:
                return '';
        }
    }
    checkCol = (val) => {
        if (val !== 'ONLINE') {
            return { color: "red" };
        }
    }
    handleNewFlow = () => {
        this.setState({ visibleFlow: true })
    }
    updateFlowName = (e) => {
        this.setState({ flowName: e.target.value })
    }
    updateFlowDesc = (e) => {
        this.setState({ flowDesc: e.target.value })
    }
    handleOkFlow = () => {
        const data = this.state;
        let params = {};
        params.projectId = data.defaultProId;
        params.name = data.flowName;
        params.description = data.flowDesc;
        params.type = 'FLOW';
        this.setState({ loading: true })
        axios.post(url + "/workspace/create-node", params,{
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }).then((res) => {
            if(res.data.resCode){
                if (res.data.resCode === "00") {
                    message.info(res.data.resMsg, 1)
                    this.getTreeData(data.defaultProId);
                    this.setState({
                        flowName: "",
                        flowDesc: "",
                        defaultFlowId: "",
                        visibleFlow: false,
                    });
                } else {
                    Modal.warning({
                        title: '警告',
                        content: res.data.resMsg,
                    });
                }
                this.setState({ loading: false })
            }else{
                window.location.href = (window.location.origin + window.location.pathname).replace("index.html","")+"login.html"
            }
        }).catch((err) => {
            console.log(err.status);
        })
    }
    handleCancelFlow = () => {
        this.setState({
            flowName: "",
            flowDesc: "",
            visibleFlow: false
        })
    }
    onRightClick = (e) => {
        this.setState({
            treenodeMessage: e,
            nodeId: e.node.props.nodeId,
            functionStyle: {
                show: 'block',
                pageX: e.event.pageX,
                pageY: e.event.pageY
            },
            isShow: {
                display: 'block'
            },
            isTaskShow: {
                display: 'block'
            }
        })

        if (e.node.props.value === 'SUB_FLOW') {
            this.setState({
                isShow: {
                    display: 'none'
                }
            })
        }
        if (e.node.props.value === 'TASK') {
            this.setState({
                isShow: {
                    display: 'none'
                },
                isTaskShow: {
                    display: 'none'
                }
            })
        }
    }
    isLeave = () => {
        this.setState({ functionStyle: { show: 'none' } })
    }
    handleAdd = (obj) => {
        this.setState({
            functionStyle: { show: 'none' },
            visibleTask: true,
            createTaskVal: {
                projectId: obj.node.props.proId,
                rootNodeId: obj.node.props.nodeId
            }
        })
    }
    updateTaskName = (e) => {
        this.setState({ taskName: e.target.value })
    }
    updateTaskDesc = (e) => {
        this.setState({ taskDesc: e.target.value })
    }
    updateTaskType = (taskType) => {
        this.setState({ taskType })
    }
    handleOkTask = () => {
        let data = this.state;
        let params = {};
        params.name = data.taskName;
        params.taskType = data.taskType;
        params.projectId = data.createTaskVal.projectId;
        params.rootNodeId = data.createTaskVal.rootNodeId;
        params.description = data.taskDesc;
        params.type = 'TASK';
        this.setState({ loading: true });
        axios.post(url + "/workspace/create-node", params, {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }).then((res) => {
            if(res.data.resCode){
                if (res.data.resCode === "00") {
                    message.info(res.data.resMsg, 1)
                    this.getTreeData(data.defaultProId, data.defaultFlowId);
                    this.setState({
                        visibleTask: false,
                        taskName: "",
                        taskDesc: ""
                    });
                } else {
                    Modal.warning({
                        title: '警告',
                        content: res.data.resMsg,
                    });
                }
                this.setState({ loading: false })
            }else{
                window.location.href = (window.location.origin + window.location.pathname).replace("index.html","")+"login.html"
            }
        }).catch((err) => {
            console.log(err.status);
        })
    }
    handleCancelTask = () => {
        this.setState({
            visibleTask: false,
            taskName: "",
            taskDesc: ""
        })
    }
    handleAddSubFlow = (obj) => {
        this.setState({
            functionStyle: { show: 'none' },
            visibleSubFlow: true,
            createTaskVal: {
                projectId: obj.node.props.proId,
                rootNodeId: obj.node.props.nodeId
            }
        })
    }
    handleOkSubF = () => {
        const data = this.state;
        let params = {};
        params.projectId = data.createTaskVal.projectId;
        params.name = data.flowName;
        params.description = data.flowDesc;
        params.rootNodeId = data.createTaskVal.rootNodeId;
        params.type = 'SUB_FLOW';
        this.setState({ loading: true });
        axios.post(url + "/workspace/create-node", params, {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }).then((res) => {
            if(res.data.resCode){
                if (res.data.resCode === "00") {
                    message.info(res.data.resMsg, 1)
                    this.getTreeData(data.defaultProId);
                    this.setState({
                        flowName: "",
                        flowDesc: "",
                        defaultFlowId: "",
                        visibleSubFlow: false
                    });
                } else {
                    Modal.warning({
                        title: '警告',
                        content: res.data.resMsg,
                    });
                }
                this.setState({ loading: false })
            }else{
                window.location.href = (window.location.origin + window.location.pathname).replace("index.html","")+"login.html"
            }
        }).catch((err) => {
            console.log(err.status);
        })
    }
    handleCancelSubF = () => {
        this.setState({
            flowName: "",
            flowDesc: "",
            visibleSubFlow: false
        })
    }

    getOption = () => {
        let data = [];
        let link = [];
        let val = this.state.dependenceData;
        val.forEach(item => {
            if (item.dependencyNames.length > 0) {
                item.dependencyNames.forEach(ele => {
                    let obj = {};
                    obj.target = item.name;
                    obj.source = ele;
                    link.push(obj)
                })
            }
        })

        let arr = [];
        for (let i in val) {
            arr.push(val[i].layerNum)
        }
        arr.sort((num1, num2) => {
            return num1 - num2;
        })
        let maxcnt = arr[arr.length - 1]
        let arrData = []
        val.forEach((item, i) => {
            if (item.type === 'SUB_FLOW') {
                item.symbol = 'circle'
                arrData.push(item);
            }
        })
        val.forEach((item, i) => {
            if (item.type === 'TASK') {
                item.symbol = 'rect'
                arrData.push(item);
            }
        })
        let tempArr = [];
        for (let i = 0; i <= maxcnt; i++) {
            tempArr[i] = []
            arrData.forEach(item => {
                if (item.layerNum === i) {
                    tempArr[i].push(item)
                }
            })
        }
        tempArr.forEach((ele, i) => {
            ele.forEach((item, j) => {
                let obj = {};
                obj.name = item.name;
                obj.x = j + 1;
                obj.y = item.layerNum;
                obj.symbol = item.symbol;
                data.push(obj)
            })
        })
        return {
            tooltip: {},
            series: [
                {
                    type: 'graph',
                    layout: 'none',
                    symbolSize: 50,
                    roam: true,
                    label: {
                        normal: {
                            show: true,
                            fontSize: 8,
                            color: 'black'
                        },
                    },
                    edgeSymbol: ['circle', 'arrow'],
                    edgeSymbolSize: [4, 10],
                    data: data,
                    links: link,
                    lineStyle: {
                        normal: {
                            opacity: 0.9,
                            width: 2,
                            curveness: 0
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: "#98b6ff",
                            borderColor: "#98b6ff"
                        }
                    }
                }
            ]
        }
    };

    showChart = (obj) => {
        axios.get(url + '/workspace/get-dependencies',{
            params: { flowId: this.state.nodeId },
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }).then((res) => {
            if(res.data.resCode){
                if (res.data.resCode === '00') {
                    this.setState({ dependenceData: res.data.data, visibleChart: true })
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

    handleOkChart = () => {
        this.setState({ visibleChart: false })
    }
    handleCancelChart = () => {
        this.setState({ visibleChart: false })
    }
    isDelete = (obj) => {
        let params = {
            nodeId: obj.node.props.nodeId,
            nodeType: obj.node.props.value,
            projectId: localStorage.getItem("projectId"),
        }
        this.setState({ isDeleteParams: params })
        axios.get(url + '/workspace/query-delete-node-info',{
            params: params,
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }).then((res) => {
            if(res.data.resCode){
                if(res.data.resCode === "00"){
                    if (res.data.data.beDepended === false) {
                        this.setState({ showDel: '是否确认删除？' })
                    } else {
                        let message = 'This task is dependent on ' + res.data.data.beDependedNames.toString() + ', confirm whether you want to delete'
                        this.setState({ showDel: message })
                    }
                    this.setState({ visibleDepend: true })
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
            console.log(err);
        })
    }
    isRename = (obj) => {
        this.setState({ treeName: obj.node.props.name, visibleTaskRe: true })
    }
    updateTreeName = (e) => {
        this.setState({ treeName: e.target.value })
    }
    handleOkTaskRe = () => {
        let params = {
            nodeId: this.state.nodeId,
            name: this.state.treeName,
            projectId: localStorage.getItem("projectId")
        }
        this.setState({ loading: true });
        axios.post(url + '/workspace/rename-node', params, {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }).then((res) => {
            if(res.data.resCode){
                if(res.data.resCode === "00"){
                    message.info(res.data.resMsg, 1)
                    this.getTreeData(this.state.defaultProId, this.state.defaultFlowId);
                    this.setState({ visibleTaskRe: false })
                }else{
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
    handleCancelTaskRe = () => {
        this.setState({ visibleTaskRe: false })
    }
    handleOkDepend = () => {
        this.setState({loading:true})
        axios.post(url + '/workspace/delete-node', this.state.isDeleteParams, {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }).then((res) => {
            if(res.data.resCode){
                if (res.data.resCode === '00') {
                    message.info(res.data.resMsg, 1)
                    this.getTreeData(this.state.defaultProId, this.state.defaultFlowId);
                    this.setState({ visibleDepend: false })
                } else {
                    Modal.warning({
                        title: '警告',
                        content: res.data.resMsg,
                    });
                }
                this.setState({ loading: false })
            }else{
                window.location.href = (window.location.origin + window.location.pathname).replace("index.html","")+"login.html"
            }
        }).catch((err) => {
            console.log(err);
        })
    }
    handleCancelDepend = () => {
        this.setState({ visibleDepend: false })
    }
    render() {
        const { flowName, flowDesc, taskName, taskType, visibleFlow, visibleTask, functionStyle, defaultFlowId, flowData, treeData, treenodeMessage, visibleSubFlow, isShow, isTaskShow, visibleChart, visibleDepend, taskDesc, visibleTaskRe, treeName } = this.state;
        let displayStyle = {
            position: 'fixed',
            zIndex: 99,
            top: functionStyle.pageY,
            left: functionStyle.pageX,
            display: functionStyle.show
        }

        return (
            <div className='nav-side'>
                <div className='select-main'>
                    <span>流程名称：</span>
                    <Select value={defaultFlowId} style={{ width: 120 }} onChange={this.handleFlowChange}>
                        <Option value="">all</Option>
                        {this.showOption(flowData)}
                    </Select>
                </div>

                <Button type="primary" className='add-project' icon="folder-add" onClick={this.handleNewFlow} >flow新增</Button>

                <Tree
                    showLine
                    className='tree'
                    onSelect={this.props.onSelect}
                    onRightClick={this.onRightClick}
                >
                    {this.loopTreeNode(treeData)}
                </Tree>

                <Modal
                    title='创建流程'
                    visible={visibleFlow}
                    onOk={this.handleOkFlow}
                    onCancel={this.handleCancelFlow}
                    confirmLoading={this.state.loading}
                >
                    <div style={{ padding: 10 }}>
                        <span style={{ paddingRight: 43 }}>name:</span>
                        <Input placeholder="name" style={{ width: "70%" }} value={flowName} onChange={this.updateFlowName} />
                    </div>
                    <div style={{ padding: 10 }}>
                        <span style={{ paddingRight: 21 }}>描述信息:</span>
                        <Input placeholder="描述信息" style={{ width: "70%" }} value={flowDesc} onChange={this.updateFlowDesc} />
                    </div>
                </Modal>

                <div style={displayStyle} onMouseLeave={this.isLeave}>
                    <div className='function-box'>
                        <span className='add-function' style={isShow} onClick={this.handleAddSubFlow.bind(this, treenodeMessage)}>新增SUB_FLOW</span>
                        <span className='add-function' style={isTaskShow} onClick={this.handleAdd.bind(this, treenodeMessage)}>新增TASK</span>
                        <span className='add-function' style={isTaskShow} onClick={this.showChart.bind(this, treenodeMessage)}>显示依赖关系</span>
                        <span className='add-function' onClick={this.isDelete.bind(this, treenodeMessage)}>删除</span>
                        <span className='add-function' onClick={this.isRename.bind(this, treenodeMessage)}>重命名</span>
                    </div>
                </div>

                <Modal
                    title='创建任务'
                    visible={visibleTask}
                    onOk={this.handleOkTask}
                    onCancel={this.handleCancelTask}
                    confirmLoading={this.state.loading}
                >
                    <div style={{ padding: 10 }}>
                        <span style={{ paddingRight: 63 }}>name:</span>
                        <Input placeholder="name" style={{ width: "70%" }} value={taskName} onChange={this.updateTaskName} />
                    </div>
                    <div style={{ padding: 10 }}>
                        <span style={{ paddingRight: 69 }}>描述:</span>
                        <Input placeholder="描述" style={{ width: "70%" }} value={taskDesc} onChange={this.updateTaskDesc} />
                    </div>
                    <div style={{ padding: 10 }}>
                        <span style={{ paddingRight: 69 }}>类型:</span>
                        <Select value={taskType} style={{ width: 260 }} onChange={this.updateTaskType} >
                            <Option value="Hive2Hive">Hive离线计算任务</Option>
                            <Option value="Hdfs2RelDb">Hdfs同步到关系数据库</Option>
                            <Option value="RelDb2RelDb" >关系型数据库同步到关系型数据库</Option>
                            <Option value="execDBscript" >执行DB脚本</Option>
                        </Select>
                    </div>
                </Modal>

                <Modal
                    title='创建SUB_FLOW'
                    visible={visibleSubFlow}
                    onOk={this.handleOkSubF}
                    onCancel={this.handleCancelSubF}
                    confirmLoading={this.state.loading}
                >
                    <div style={{ padding: 10 }}>
                        <span style={{ paddingRight: 43 }}>name:</span>
                        <Input placeholder="name" style={{ width: "70%" }} value={flowName} onChange={this.updateFlowName} />
                    </div>
                    <div style={{ padding: 10 }}>
                        <span style={{ paddingRight: 21 }}>描述信息:</span>
                        <Input placeholder="描述信息" style={{ width: "70%" }} value={flowDesc} onChange={this.updateFlowDesc} />
                    </div>
                </Modal>

                <Modal
                    title='依赖关系图'
                    visible={visibleChart}
                    onOk={this.handleOkChart}
                    onCancel={this.handleCancelChart}
                    width={1000}
                >
                    <div style={{ padding: 10 }}>
                        <ReactEcharts
                            option={this.getOption()}
                            style={{ height: 500, width: "100%" }}
                        />
                    </div>
                </Modal>

                <Modal
                    title='是否有依赖'
                    visible={visibleDepend}
                    onOk={this.handleOkDepend}
                    onCancel={this.handleCancelDepend}
                    confirmLoading={this.state.loading}
                >
                    {this.state.showDel}
                </Modal>

                <Modal
                    title='重命名'
                    visible={visibleTaskRe}
                    onOk={this.handleOkTaskRe}
                    onCancel={this.handleCancelTaskRe}
                    confirmLoading={this.state.loading}
                >
                    <span style={{ paddingRight: 21 }}>名称:</span>
                    <Input placeholder="name" style={{ width: "70%" }} value={treeName} onChange={this.updateTreeName} />
                </Modal>

            </div>
        )
    }
}

export default NavSide;