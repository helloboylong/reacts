import React, { Component } from 'react';
import axios from 'axios';
import url from '../../../../url';
import './maskbox.css';
import { Button, Modal, Progress } from 'antd';


class test extends Component {
    constructor(props){
        super(props);
        this.state = {
            percent:0,
            visible: false,
            confirmLoading:false,
            isShow:{display:"none"},
        }
    }
    showConfirm = () => {
        this.setState({visible:true})
    }
    handleCancel = () => {
        this.setState({visible:false,percent:0})
    }
    handleOk = () => {
        let data = this.props;
        let params = {
            projectId: data.proId,
            envId: data.envId,
            deployType: "DEPLOY_TYPE_ALL",
            userName: localStorage.getItem("username")
        }
        if (!params.projectId) {
            Modal.warning({
                title: '警告',
                content: 'projectId 不能为空',
            });
            return false;
        }
        if (!params.envId) {
            Modal.warning({
                title: '警告',
                content: 'envId 不能为空',
            });
            return false;
        }
        this.setState({ confirmLoading: true, isShow: { display: 'block' } })
        let point = this.state.percent;
        axios.get(url + "/deployment/deploy-All_project", {
            params: params,
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
                    this.setState({ visible: false, percent: 0, confirmLoading: false, isShow: { display: 'none' } })
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
    render() {
        return (
            <div>
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

export default test;