import React, { Component } from 'react';
import axios from 'axios';
import url from '../../../url';
import { Select, Button, Table, Modal } from 'antd';
const Option = Select.Option;
class Main3 extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data:[],
            projectId:"",
            envId:"",
            proOption:[],
            EnvOption:[],
            defauleVal:[],
            flowOption:[]
        }
    }
    componentDidMount() {
        this.getData({ projectId: localStorage.getItem("projectId") });
        this.setState({ projectId: localStorage.getItem("projectId") });
        this.getEnvData(localStorage.getItem("projectId"))
        this.getFlowsData(localStorage.getItem("projectId"))
    }
    componentWillReceiveProps(nextProps) {
        this.getData({ projectId: localStorage.getItem("projectId")});
        this.setState({projectId:localStorage.getItem("projectId")});
        this.getEnvData(localStorage.getItem("projectId"))
        this.getFlowsData(localStorage.getItem("projectId"))
    }
    
    getEnvData = (id) => {
        axios.get(url + '/project-manage/get-ProjectEnv-List', {
            params: { projectId: id, userName: localStorage.getItem("username") },
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }).then((res) => {
            if(res.data.resCode){
                if(res.data.resCode === "00"){
                    this.setState({ EnvOption: res.data.data })
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
    getFlowsData = (id) => {
        axios.get(url + '/workspace/flow', {
            params: { projectId: id }, 
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
         }).then((res) => {
             if(res.data.resCode){
                if(res.data.resCode === "00"){
                    this.setState({ flowOption: res.data.data })
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
        if(arr && Array.isArray(arr) && arr.length>0){
            return arr.map((item, i) => {
                return < Option value={item.id} key={i}>{item.name}</Option >
            })
        }
    }
    getData = (obj) => {
        axios.get(url + '/deployment/find-tag-display', {
            params: obj,
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }).then((res) => {
            if(res.data.resCode){
                if(res.data.resCode === "00"){
                    res.data.data.forEach((item,i)=>{
                        item.key=i;
                    })
                    this.setState({data:res.data.data})
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
    handleProChange = (value) => {
        console.log(value,110)
        this.setState({projectId:value,defauleVal:[]})
        if(value){
            this.getEnvData(value)
            this.getFlowsData(value)
        }else{
            this.setState({
                EnvOption: [],
                dependData: []
            })
        }
    }
    handleEnvChange = (value) => {
        this.setState({envId:value})
    }
    handleDefaultValChange = (value) => {
        this.setState({ defauleVal: value })
    }
    handleInquire = () => {
        let data = this.state;
        let params = {
            projectId: localStorage.getItem("projectId"),
            envId:data.envId,
            flowIds: data.defauleVal.toString(),
        }
        this.getData(params)
    }
    render() {
        const columns = [{
            title: '项目名称',
            dataIndex: 'projectName',
            key: 'projectName',
        }, {
            title: '环境名称',
            dataIndex: 'envName',
            key: 'envName',
        }, {
            title: 'flow名称',
            dataIndex: 'flowName',
            key: 'flowName',
        },{
            title: 'tag名称',
            dataIndex: 'tagName',
            key: 'tagName',
        }, {
            title: '环境类型',
            dataIndex: 'envType',
            key: 'envType',
            render: (text) => {
                function showValue(param) {
                    switch (param) {
                        case "TEST":
                            return "测试环境";
                        case "DEV":
                            return "开发环境";
                        case "PRODUCT":
                            return "生产环境";
                        default:
                            break;
                    }
                }
                return <span>{showValue(text)}</span>
            }
        }, {
            title: '部署时间',
            key: 'deployTime',
            dataIndex: 'deployTime',
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
                return <span>{timeChange(text)}</span>
            }
        }];
        return (
            <div style={{ padding: 20, height: "100%", display: 'flex', flexDirection: 'column'}}>
                <div style={{ marginBottom: 20, display: 'flex',lineHeight:"36px"}}>
                    <div style={{ display: 'flex', marginRight: 20}}>
                        <span style={{ paddingRight: 5 }}>环境名称:</span>
                        <Select style={{ width: 120 }} value={this.state.envId} onChange={this.handleEnvChange}>
                            < Option value="">All</Option >
                            {this.showOption(this.state.EnvOption)}
                        </Select>
                    </div>
                    <div style={{ display: 'flex', marginRight: 20}}>
                        <span style={{paddingRight:5}}>flow名称:</span>
                        <Select
                            mode="multiple"
                            style={{ width: 500 }}
                            value={this.state.defauleVal}
                            onChange={this.handleDefaultValChange}
                        >
                            {this.showOption(this.state.flowOption)}
                        </Select>
                    </div>
                    <Button onClick={this.handleInquire}>查询</Button>
                </div>
                <Table
                    columns={columns}
                    dataSource={this.state.data}
                    bordered
                />
            </div>
        )
    }
}

export default Main3;