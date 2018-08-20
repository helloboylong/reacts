import React, { Component } from 'react';
import axios from 'axios';
import url from '../../../../url';
import './maskbox.css';
import { Button, Select, Modal, Progress } from 'antd';
const Option = Select.Option;

let point = -1;
class NowSelect extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listdata: [],
            proId: "",
            percent: 0,
            visible: false,
            confirmLoading: false,
            isShow: { display: "none" },
        }
    }
    componentDidMount() {
        this.setState({ proId: this.props.proId })
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.proId !== nextProps.proId) {
            this.setState({ proId: nextProps.proId })
        }
    }

    handleAdd = (mes) => {
        this.setState({
            listdata: mes
        });
    }
    handleFlowChange = (obj, i, cur) => {
        let data = this.state.listdata;
        data[i].flowId = cur;
        this.setState({
            listdata: data,
        })
    }
    showConfirm = () => {
        this.setState({ visible: true })
    }
    handleCancel = () => {
        this.setState({ visible: false, percent: 0 })
    }
    handleOk = () => {
        if (!this.props.envId) {
            Modal.warning({
                title: '警告',
                content: 'envId 不能为空',
            });
            return false;
        }
        let arr = this.state.listdata;
        for (let i = 0; i < arr.length; i++) {
            if (!arr[i].flowId) {
                Modal.warning({
                    title: '警告',
                    content: 'flow名称不能为空',
                });
                return false;
            }
            delete arr[i].key;
        }
        let data = this.props;
        let params = {
            projectId: data.proId,
            envId: data.envId,
            flowList: this.state.listdata,
            deployType: "DEPLOY_TYPE_CURRENT",
            userName: localStorage.getItem("username")
        }
        if(params.flowList.length===0){
            Modal.warning({
                title: '警告',
                content: 'flow名称不能为空',
            });
            return false;
        }
        this.setState({ confirmLoading: true, isShow: { display: 'block' } })
        let point = this.state.percent;
        axios.post(url + "/deployment/deploy-flow", params, {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }).then((res) => {
            if (res.data.resCode) {
                if (res.data.resCode === '00') {
                    let _this = this;
                    let myPoint = setInterval(function () {
                        point += 20;
                        if (point === 100) {
                            clearInterval(myPoint);
                        }
                        _this.setState({ percent: point })
                    }, 1000);
                    setTimeout(function () {
                        _this.setState({ visible: false, percent: 0, confirmLoading: false, isShow: { display: 'none' } })
                    }, 5500);
                } else {
                    Modal.warning({
                        title: '警告',
                        content: res.data.resMsg,
                    });
                    this.setState({ visible: false, percent: 0, confirmLoading: false, isShow: { display: 'none' } })
                }
            } else {
                window.location.href = (window.location.origin + window.location.pathname).replace("index.html", "") + "login.html"
            }
        }).catch((err) => {
            console.log(err.status);
        })
        
    }
    render() {
        return (
            <div>
                <Add
                    add={this.handleAdd}
                    list={this.state.listdata}
                />
                <UlList
                    del={this.handleAdd}
                    list={this.state.listdata}
                    proId={this.state.proId}
                    handleFlowChange={this.handleFlowChange}
                />
                <Button type="primary" onClick={this.showConfirm}>部署</Button>
                <div className='maskBox' style={this.state.isShow}></div>
                <Modal
                    title="是否部署"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    maskClosable={false}
                    confirmLoading={this.state.confirmLoading}
                    closable={false}
                >
                    <Progress percent={this.state.percent} />
                </Modal>
            </div>
        );
    }
}
class Add extends Component {
    addContent = (e) => {
        for (let i = 0; i < this.props.list.length; i++) {
            if (!this.props.list[i].flowId) {
                return false;
            }
        }
        point++;
        let obj = {
            flowId: "",
            key: point
        }
        this.props.list.push(obj);
        this.props.add(this.props.list);
    }
    render() {
        return (
            <div>
                <Button type="primary" shape="circle" icon="plus" style={{ position: 'relative', left: 210, top: -10 }} onClick={this.addContent} />
            </div>
        )
    }
}
class UlList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            flowOption: [],
            flowData: [],
        }
    }
    componentWillMount() {
        this.mounted = true;
    }

    componentWillUnmount() {
        this.mounted = false;
    }
    componentWillReceiveProps(nextProps) {
        axios.get(url + '/workspace/flow', {
            params: { projectId: nextProps.proId },
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }).then((res) => {
            if(res.data.resCode){
                if(res.data.resCode === "00"){
                    if(this.mounted){
                        this.setState({ flowOption: res.data.data })
                    }
                }
            }else{
                window.location.href = (window.location.origin + window.location.pathname).replace("index.html","")+"login.html"
            }
        }).catch((err) => {
            console.log(err.status);
        })
    }
    showFlowOption = (arr) => {
        return arr.map((item, i) => {
            return < Option value={item.id} key={i}>{item.name}</Option >
        })
    }
    // showTagOption = (arr) => {
    //     return arr.map((item, i) => {
    //         return < Option value={item.id} key={i}>{item.tagName}</Option >
    //     })
    // }
    delContent = (e) => {
        var i = e.target.getAttribute("data-index");
        this.props.list.splice(i, 1);
        this.props.del(this.props.list);
    }
    render() {
        return (
            <ul>
                {
                    this.props.list.map((item, i) => {
                        return (
                            <li className="content" key={item.key}>
                                <span style={{ paddingRight: 10 }}>flow名称:</span>
                                <Select style={{ width: 200}} onChange={this.props.handleFlowChange.bind(this, item, i)}>
                                    {this.showFlowOption(this.state.flowOption)}
                                </Select>
                                <span className="del" onClick={this.delContent} data-index={i}>×</span>
                            </li>
                        );
                    })
                }
            </ul>
        )
    }
}

export default NowSelect;