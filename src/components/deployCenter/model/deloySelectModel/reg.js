import React, { Component } from 'react';
import axios from 'axios';
import url from '../../../../url';
import './maskbox.css';
import { Select, Button, Modal, Progress } from 'antd';
const Option = Select.Option;
class RegSelect extends Component{
    constructor(props){
        super(props);
        this.state = {
            regData:[],
            regId:"",
            percent: 0,
            visible: false,
            confirmLoading: false,
            isShow: { display: "none" },
        }
    }
    componentDidMount() {
        let params = {
            projectId: this.props.proId,
            deployType: this.props.deployType
        }
        this.getData(params);
    }
    getData = (obj) => {
        axios.get(url + '/process-center/get-reg-of-project', {
            params: obj,
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }).then((res) => {
            if(res.data.resCode){
                if(res.data.resCode === "00"){
                    this.setState({ regData: res.data.data })
                }
            }else{
                window.location.href = (window.location.origin + window.location.pathname).replace("index.html","")+"login.html"
            }
        }).catch((err) => {
            console.log(err.status);
        })
    }
    showOption = (arr) => {
        return arr.map((item,i)=>{
            return < Option value={item.id} key={i} >{item.regName}</Option >
        })
    }
    handleRegName = (value) =>{
        this.setState({regId:value})
    }
    showConfirm = () => {
        this.setState({ visible: true })
    }
    handleCancel = () => {
        this.setState({ visible: false, percent: 0 })
    }
    handleOk = () => {
        let data = this.props;
        let params = {
            regId: this.state.regId,
            envId: data.envId,
            deployType: "DEPLOY_TYPE_REG",
            userName: localStorage.getItem("username")
        }
        if (!params.envId) {
            Modal.warning({
                title: '警告',
                content: 'envId 不能为空',
            });
            return false;
        }
        if (!params.regId) {
            Modal.warning({
                title: '警告',
                content: 'regId 不能为空',
            });
            return false;
        }
        this.setState({ confirmLoading: true, isShow: { display: 'block' } })
        let point = this.state.percent;
        axios.get(url + "/deployment/deploy-reg", {
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
    render(){
        return(
            <div>
                <div>
                    <span style={{ paddingRight: 10 }}>reg部署:</span>
                    <Select style={{ width: 200 }} onChange={this.handleRegName}>
                        {this.showOption(this.state.regData)}
                    </Select>
                </div>
                <Button type="primary" style={{ marginTop: 10 }} onClick={this.showConfirm}>部署</Button>
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
        )
    }
}

export default RegSelect;