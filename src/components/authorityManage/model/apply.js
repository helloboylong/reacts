import React, { Component } from 'react';
import axios from 'axios';
import url from '../../../url';
import { Button, Checkbox, Modal, message } from 'antd';
const CheckboxGroup = Checkbox.Group;
export default class Apply extends Component {
    constructor(props) {
        super();
        this.state = {
            limitList:[],
            limitingList:[],
            allList:[],
            options:[],
            roleIds:[],
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
            projectId: localStorage.getItem("projectId")
        }
        axios.get(url + '/authority/get-user-role-info', {
            params: params, headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }).then((res) => {
            if(res.data.resCode){
                if(res.data.resCode === "00"){
                    let limitList = []; //用户所拥有的权限
                    let limitingList = []; //用户正在申请的权限
                    let dataList = [];
                    // console.log(res.data.data)
                    res.data.data.forEach((item,i)=>{
                        if(item.status.code === "APPROVAL"){
                            limitList.push(item.roleName)
                        }else if (item.status.code === "INIT") {
                            limitingList.push(item.roleName)
                        } else if (item.status.code === "NONE"|| item.status.code === "DISAPPROVE"){
                            dataList.push(item.roleName)
                        }
                    })
                    // console.log(dataList)
                    this.showCheckBoxOptions(dataList)
                    this.setState({ limitList, limitingList });
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
        if(obj && Array.isArray(obj) && obj.length){
            return obj.map((item, i) => {
                return <Button key={i} style={{margin:"0 5px"}}>{item.name}</Button>
            })
        }
    }
    showCheckBoxOptions = (data) => {
        if(data && Array.isArray(data) && data.length>0){
            let arr = [];
            data.forEach((item, i) => {
                arr.push({ value: item.id, label: item.name })
            })
            this.setState({ options: arr })
        }
    }
    onChange = (checkedValues) => {
        this.setState({ roleIds: checkedValues})
    }
    commit = () => {
        let params = {
            projectId: localStorage.getItem("projectId"),
            userName:localStorage.getItem("username"),
            roleIds:this.state.roleIds
        }
        if(params.roleIds.length === 0){
            Modal.warning({
                title: '警告',
                content: "请选择你需要申请的权限",
            });
            return false;
        }
        this.setState({ loading: true });
        axios.post(url + '/authority/apply-permissions', params, {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }).then((res) => {
            if(res.data.resCode){
                if (res.data.resCode === "00") {
                    message.info(res.data.resMsg, 1)
                    this.getData();
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
            <div style={{ padding: "20px", display: 'flex', flexDirection: "column" }}>
                <div >
                    <span style={{ marginRight: 10 }}>用户现有的权限:</span>
                    {this.showList(this.state.limitList)}
                </div>
                <div style={{margin:"20px 0"}} >
                    <span style={{ marginRight: 10 }}>用户正在申请的权限:</span>
                    {this.showList(this.state.limitingList)}
                </div>
                <div>
                    <span style={{marginRight:10}}>用户能申请的权限:</span>
                    <CheckboxGroup options={this.state.options}  onChange={this.onChange} />
                </div>
                <Button type="primary" style={{width:100,marginTop:50}} onClick={this.commit} loading={this.state.loading}>提交</Button>
            </div>
        )
    }
}