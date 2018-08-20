import React, { Component } from 'react';
import axios from 'axios';
import url from '../../url';
import { Modal } from 'antd';
import NavSide from './navSide';
import MessageMain from './showMessage';
import "./wordBench.css";
class workBench extends Component {
    constructor(props) {
        super(props);
        this.state = {
            panes: [],
            activeKey: "",
            messageData: "",
            flowVersionData: [],
            tagFlag: "",
            taskData: "",
            taskCompareRevert:""
        }
    }
    onSelect = (selectedKeys, info) => {
        this.getData(info.node.props.nodeId)
        if(info.node.props.value === 'TASK'){ 
            axios.get(url + '/workspace/get-task-roll-compare-info', {
                params: { nodeId: info.node.props.nodeId },
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            }).then((res) => {
                if(res.data.resCode){
                    if(res.data.resCode === "00"){
                        this.setState({ taskCompareRevert:res.data.data})
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
    }

    onEdit = (targetKey, action) => {
        this[action](targetKey);
    }

    remove = (targetKey) => {
        let activeKey = this.state.activeKey;
        let lastIndex;
        this.state.panes.forEach((pane, i) => {
            if (pane.key === targetKey) {
                lastIndex = i - 1;
            }
        });
        const panes = this.state.panes.filter(pane => pane.key !== targetKey);
        if (lastIndex >= 0 && activeKey === targetKey) {
            activeKey = panes[lastIndex].key;
        }
        this.setState({ panes, activeKey });
    }
    onChange = (activeKey) => {
        this.getData(activeKey);
    }

    getData = (params) => {
        axios.get(url + '/workspace/node', {
            params: { nodeId: params },
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
        .then((res) => {
            if(res.data.resCode){
                if(res.data.resCode === "00"){
                    let panes = this.state.panes;
                    let activeKey = res.data.data.id.toString();
                    panes.push({ title: res.data.data.name, key: activeKey });
                    let obj = {};
                    panes = panes.reduce((cur, next) => {
                        if (!obj[next.key]) {
                            obj[next.key] = true;
                            cur.push(next)
                        }
                        return cur;
                    }, [])
                    this.setState({
                        panes,
                        activeKey,
                        messageData: res.data.data
                    });

                    if (res.data.data.type === 'FLOW' ) {
                        axios.get(url + '/workspace/get-tag?flowNodeId=' + res.data.data.id, {
                            headers: {
                                'X-Requested-With': 'XMLHttpRequest'
                            }
                        })
                        .then((res) => {
                            if(res.data.resCode){
                                if(res.data.resCode === "00"){
                                    this.setState({ flowVersionData: res.data.data })
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
                        axios.get(url + '/workspace/get-create-tag-status', {
                            params: { flowNodeId: res.data.data.id },
                            headers: {
                                'X-Requested-With': 'XMLHttpRequest'
                            }
                        }).then((res) => {
                            if(res.data.resCode){
                                if(res.data.resCode === "00"){
                                    this.setState({ tagFlag: res.data.data })
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

                    if (res.data.data.type === 'TASK') {
                        axios.get(url + '/workspace/task', {
                            params: { taskId: res.data.data.taskId },
                            headers: {
                                'X-Requested-With': 'XMLHttpRequest'
                            }
                        }).then((res) => {
                            if(res.data.resCode){
                                if(res.data.resCode === "00"){
                                    this.setState({ taskData: res.data.data })
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
                        axios.get(url + '/workspace/get-task-roll-compare-info', {
                            params: { nodeId: res.data.data.id },
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
            <div className='main'>
                <NavSide onSelect={this.onSelect} />
                <div className='main-col'>
                    <div className='message-main'>
                        <MessageMain
                            panes={this.state.panes}
                            activeKey={this.state.activeKey}
                            onEdit={this.onEdit}
                            messageData={this.state.messageData}
                            flowVersionData={this.state.flowVersionData}
                            onChange={this.onChange}
                            tagFlag={this.state.tagFlag}
                            taskData={this.state.taskData}
                            taskCompareRevert={this.state.taskCompareRevert}
                        />
                    </div>
                </div>

            </div>
        )
    }
}

export default workBench;