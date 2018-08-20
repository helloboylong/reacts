import React, { Component } from 'react';
import { Button, Table, Modal } from 'antd';
import DiffEditor from 'react-ace/lib/diff.js';
import 'brace/theme/github';
import 'brace/mode/mysql';
import 'brace/mode/json';
export default class FlowCompareRevert extends Component{
    constructor(props){
        super(props);
        this.state = {
            columns: [{
                title: '节点名称',
                dataIndex: 'name',
            }, {
                title: '节点类型',
                dataIndex: 'nodeType',
            }, {
                title: '更多操作',
                dataIndex: 'btn',
                render: (text, record)=>{
                    return <Button type="primary" className='add-project' style={{ left: 0 }} onClick={() => this.showCompare(record)} >查看</Button>
                }
            }],
            data:[],
            tagId:'',
            visible:false,
            type: 'mysql',
            value:['',''],
            taskName:"",
            visibleT:false,
            TaskConfigVal: ['', ''],
            TaskValueData:['', ''],
        }
    }
    showCompare = (data) =>{
        console.log(data)
        this.setState({ taskName: data.name })
        if(data.nodeType === "FLOW" || data.nodeType === "SUB_FLOW"){
            let value = this.state.value;
            if (!data.currentFlowConf) {
                value[0] = "";
            } else {
                value[0] = JSON.stringify(JSON.parse(data.currentFlowConf), null, 4);
            }
            if (!data.preFlowConf) {
                value[1] = "";
            } else {
                value[1] = JSON.stringify(JSON.parse(data.preFlowConf), null, 4);
            }
            this.setState({value})
            setTimeout(() => {
                this.setState({ visible: true })
            }, 500)
        }
        if(data.nodeType === "TASK"){
            let TaskConfigVal = this.state.TaskConfigVal;
            let TaskValueData = this.state.TaskValueData;
            let type = this.state.type;
            if (data.taskType === 'Hive2Hive') {
                type = 'mysql';
                if (!data.taskContent) {
                    TaskValueData[0] = "";
                } else {
                    TaskValueData[0] = data.taskContent;
                }
                if (!data.taskVersionContent) {
                    TaskValueData[1] = "";
                } else {
                    TaskValueData[1] = data.taskVersionContent;
                }
            } else if (data.taskType === 'Hdfs2RelDb' || data.taskType === 'RelDb2RelDb' || data.taskType === 'execDBscript') {
                type = 'json';
                if (!data.taskContent) {
                    TaskValueData[0] = "";
                } else {
                    TaskValueData[0] = JSON.stringify(JSON.parse(data.taskContent), null, 4);
                }
                if (!data.taskVersionContent) {
                    TaskValueData[1] = "";
                } else {
                    TaskValueData[1] = JSON.stringify(JSON.parse(data.taskVersionContent), null, 4);
                }
            }
            if (!data.currentTaskConf) {
                TaskConfigVal[0] = "";
            } else {
                TaskConfigVal[0] = JSON.stringify(JSON.parse(data.currentTaskConf), null, 4);
            }
            if (!data.preTaskConf) {
                TaskConfigVal[1] = "";
            } else {
                TaskConfigVal[1] = JSON.stringify(JSON.parse(data.preTaskConf), null, 4);
            }
            this.setState({ type, TaskConfigVal, TaskValueData});
            setTimeout(() => {
                this.setState({ visibleT: true })
            }, 500)
        }
    }
    handleOk = () => {
        this.setState({visible:false})
    }
    handleCancel = () => {
        this.setState({ visible: false })
    }
    handleOkT = () => {
        this.setState({ visibleT: false })
    }
    handleCancelT = () => {
        this.setState({ visibleT: false })
    }
    componentWillReceiveProps(nextProps) {
        if(nextProps.tagData.tagId !== this.state.tagId){
            this.setState({ data: nextProps.tagData.taskCompareInfoDtos })
        }
    }
    
    render(){
        return (
            <div>
                <Table
                    columns={this.state.columns}
                    dataSource={this.state.data}
                    bordered
                    title={() => '历史版本记录'}
                />

                <Modal
                    title={this.state.taskName}
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    width='1100px'
                    destroyOnClose={true}
                >   
                    <h3>配置对比</h3>
                    <DiffEditor
                        value={this.state.value}
                        height="700px"
                        width="1000px"
                        mode='json'
                        theme="github"
                        readOnly={true}
                        style={{ border: '1px solid #dcdcdc' }}
                        editorProps={{ $blockScrolling: true }}
                    />
                </Modal>

                <Modal
                    title={this.state.taskName}
                    visible={this.state.visibleT}
                    onOk={this.handleOkT}
                    onCancel={this.handleCancelT}
                    width='1100px'
                    destroyOnClose={true}
                >
                    <h3>配置对比</h3>
                    <DiffEditor
                        value={this.state.TaskConfigVal}
                        height="200px"
                        width="1000px"
                        mode="json"
                        theme="github"
                        readOnly={true}
                        style={{ border: '1px solid #dcdcdc' }}
                        editorProps={{ $blockScrolling: true }}
                    />
                    <br />
                    <h3>代码对比</h3>
                    <DiffEditor
                        value={this.state.TaskValueData}
                        height="500px"
                        width="1000px"
                        mode={this.state.type}
                        theme="github"
                        readOnly={true}
                        style={{ border: '1px solid #dcdcdc' }}
                        editorProps={{ $blockScrolling: true }}
                    />
                </Modal>
            </div>
        )
    }
}