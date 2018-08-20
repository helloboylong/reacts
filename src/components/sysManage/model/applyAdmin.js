import React, { Component } from 'react';
import axios from 'axios';
import url from '../../../url';
import { Button, Checkbox, Modal, message } from 'antd';
const CheckboxGroup = Checkbox.Group;
export default class ApplyAdmin extends Component {
    constructor(props) {
        super();
        this.state = {
            arr:[],
            options:[],
            roleIds:[],
            show:"block",
            showL:"block",
            loading:false,
        }
    }
    componentDidMount() {
        this.getData();
    }
    componentWillReceiveProps(nextProps) {
        this.getData();
    }

    getData = () => {
        let params = {
            userName: localStorage.getItem("username"),
        }
        axios.get(url + '/authority/get-user-role-info', {
            params: params, headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }).then((res) => {
            if(res.data.resCode){
                if(res.data.resCode === "00"){
                    let arr = []
                    res.data.data.forEach((item,i)=>{
                        if(item.roleName.code === "ADMIN"){
                            arr.push(item)
                        }
                    })
                    arr.forEach((item)=>{
                        if(item.status.code ==="DISAPPROVE"||item.status.code ==="NONE"||item.status.code ==="INELIGIBLE"){
                            this.showCheckBoxOptions(arr);
                            this.setState({show:"none"})
                        }
                        if(item.status.code ==="APPROVAL"||item.status.code ==="INIT"){
                            this.setState({showL:"none"});
                            this.setState({ show: "block" })
                        }
                    })
                    this.setState({arr})
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
    showList = (obj) => {
        if (obj && Array.isArray(obj) && obj.length) {
            return obj.map((item, i) => {
                return <Button key={i} style={{ margin: "0 5px" }}>{item.status.code==="APPROVAL"?"已拥有该权限":item.status.name}</Button>
            })
        }
    }
    showCheckBoxOptions = (data) => {
        if (data && Array.isArray(data) && data.length > 0) {
            let arr = [];
            data.forEach((item, i) => {
                arr.push({ value: item.roleName.id, label: item.roleName.name })
            })
            this.setState({ options: arr })
        }
    }
    onChange = (checkedValues) => {
        this.setState({ roleIds: checkedValues })
    }
    commit = () => {
        let params = {
            userName: localStorage.getItem("username"),
        }
        if (this.state.roleIds.length === 0) {
            Modal.warning({
                title: '警告',
                content: "请确认你是否拥有该权限或选择你需要申请的权限",
            });
            return false;
        }
        this.setState({ loading: true });
        axios.get(url + '/authority/create-admin-user', {
            params:params,
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }).then((res) => {
            if(res.data.resCode){
                if (res.data.resCode === "00") {
                    this.getData();
                    message.info(res.data.resMsg, 1)
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
        let isShow = {
            display: this.state.show
        }
        let isShowL = {
            display: this.state.showL
        }
        return (
            <div style={{ padding: "20px", display: 'flex', flexDirection: "column" }}>
                <div style={isShow}>
                    <div style={{ margin: "20px 0" }} >
                        <span style={{ marginRight: 10 }}>用户系统管理员申请进度:</span>
                        {this.showList(this.state.arr)}
                    </div>
                </div>
                <div style={isShowL}>
                    <div>
                        <span style={{ marginRight: 10 }}>用户系统管理员申请:</span>
                        <CheckboxGroup options={this.state.options}  onChange={this.onChange} />
                    </div>
                    <Button type="primary" style={{ width: 100, marginTop: 50 }} onClick={this.commit} loading={this.state.loading}>提交</Button>
                </div>
            </div>
        )
    }
}