import React, { Component } from 'react';
import axios from 'axios';
import url from '../../../url';
import RegSelect from './deloySelectModel/reg';
import AllSelect from './deloySelectModel/all';
import { Select, Modal } from 'antd';
const Option = Select.Option;
class Main2 extends Component {
    constructor(props) {
        super(props)
        this.state = {
            proOption:[],
            defaultProId:"",
            EnvOption:[],
            defaultEnvId:"",
            defaultDeloy:"",
        }
    }
    componentDidMount() {
        this.getEnvData(localStorage.getItem("projectId"));
        this.setState({defaultProId:localStorage.getItem("projectId")})
    }
    componentWillReceiveProps(nextProps) {
        this.getEnvData(localStorage.getItem("projectId"))
        this.setState({ defaultProId: localStorage.getItem("projectId") })
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
                    let data = [];
                    res.data.data.forEach((item,i)=>{
                        if(item.type === "PRODUCT"){
                            data.push(item)
                        }
                    })
                    // console.log(data)
                    this.setState({ EnvOption: data, defaultEnvId: "",defaultDeloy: "" })
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
    showProOption = (arr) => {
        return arr.map((item, i) => {
            return < Option value={item.id} key={i}>{item.name}</Option >
        })
    }
    handleProChange = (value) => {
        this.setState({ defaultProId: value, defaultDeloy: "", defaultEnvId:"" })
        this.getEnvData(value);
    }
    handleEnvChange = (value) => {
        this.setState({ defaultEnvId: value, defaultDeloy: "" })
    }
    handleDeloyChange = (value) => {
        this.setState({ defaultDeloy: value })
    }
    render() {
        const { EnvOption, defaultEnvId, defaultDeloy } = this.state;
        const isRender = (val) => {
            switch (val) {
                case "0":
                    return <AllSelect proId={this.state.defaultProId} envId={this.state.defaultEnvId} defaultDeloy={this.state.defaultDeloy} />;
                case '1':
                    return <RegSelect proId={this.state.defaultProId} envId={this.state.defaultEnvId} defaultDeloy={this.state.defaultDeloy} deployType={this.props.processType}/>;
                default:
                    break;
            }
        }
        return (
            <div className="deploy-main">
                <div style={{ padding: 10 }}>
                    <span style={{ paddingRight: 10 }}>选择环境:</span>
                    <Select value={defaultEnvId} style={{ width: 200 }} onChange={this.handleEnvChange}>
                        {this.showProOption(EnvOption)}
                    </Select>
                </div>
                <div style={{ padding: 10 }}>
                    <span style={{ paddingRight: 10 }}>部署方式:</span>
                    <Select value={defaultDeloy} style={{ width: 200 }} onChange={this.handleDeloyChange}>
                        < Option value="0" >全量复制生产版本</Option >
                        < Option value="1" >reg部署</Option >
                    </Select>
                </div>
                <div style={{ padding: 10 }}>
                    {isRender(defaultDeloy)}
                </div>
            </div>
        )
    }
}

export default Main2;