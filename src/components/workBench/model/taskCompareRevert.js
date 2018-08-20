import React, { Component } from 'react';
import axios from 'axios';
import url from '../../../url';
import { Button, Table, Modal, message, Checkbox } from 'antd';
import DiffEditor from 'react-ace/lib/diff.js';
import 'brace/theme/github';
import 'brace/mode/mysql';
import 'brace/mode/json';

export default class TaskCompareRevert extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [{
                title: '可选项(只能选两项)',
                dataIndex: 'checkbox',
                width: "100px",
                align: 'center',
                render: (text, record) => {
                    return <Checkbox
                        onChange={this.onChange.bind(this, record)}
                    />
                }
            }, {
                title: '提交时间',
                dataIndex: 'updatedAt',
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
                    return < span > {timeChange(text)}</span>
                }
            }, {
                title: '提交人',
                dataIndex: 'updatedBy',
            }, {
                title: '更多操作',
                dataIndex: 'btn',
                width: "200px",
                align: 'center',
                render: (text, record) => {
                    return (
                        <div>
                            <Button type="primary" className='add-project' style={{ left: 0, marginRight: 10 }} onClick={() => this.showCompare(record)} >查看</Button>
                            <Button type="primary" className='add-project' style={{ left: 0 }} onClick={() => this.isRevet(record)} >回滚</Button>
                        </div>
                    )
                }
            }],
            data: [],   //table的源数据
            tagId: '',  //flag
            type: 'mysql', //ace mode
            value: ['', ''], // ace diff 源数据
            visible: false,
            valueData: ['', ''],
            historyValue: [], // 保存选中的项
            visibleH: false,
            configValue:['',''],
            historyConfigVal:['','']
        }
    }
    showCompare = (data) => {
        let value = this.state.value;
        if(!data.content){
            value[1] = "";
        }else{
            value[1] = data.content;
        }
        let configValue = this.state.configValue;
        if (!data.confContent) {
            configValue[1] = "";
        } else {
            configValue[1] = JSON.stringify(JSON.parse(data.confContent), null, 4)
        }
        this.setState({ value, configValue, visible: true })
    }
    handleOk = () => {
        this.setState({ visible: false })
    }
    handleCancel = () => {
        this.setState({ visible: false })
    }
    isRevet = (data) => {
        let params = {
            taskId: data.taskId,
            taskVersionId: data.id,
            projectId: localStorage.getItem("projectId")
        }
        axios.post(url + '/workspace/execute-task-revert', params, {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }).then((res) => {
            if(res.data.resCode){
                if (res.data.resCode === '00') {
                    message.info(res.data.resMsg, 1)
                    this.props.getCodeData(data.taskId);
                    this.props.getCompareData(data.taskId)
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
    showHistory = () => {
        let data = this.state.historyValue;
        if (data.length === 2) {
            let value = [];
            value[0] = data[0].content;
            value[1] = data[1].content;
            let historyConfigVal = [];
            historyConfigVal[0] = JSON.stringify(JSON.parse(data[0].confContent), null, 4);
            historyConfigVal[1] = JSON.stringify(JSON.parse(data[1].confContent), null, 4);
            this.setState({ visibleH: true, valueData: value, historyConfigVal})
        } else {
            Modal.warning({
                title: '警告',
                content: '请确认只选择了两项，如超过两条，请去除多余项。。。',
            });
            return false;
        }
    }
    handleOkH = () => {
        this.setState({ visibleH: false })
    }

    handleCancelH = () => {
        this.setState({ visibleH: false })
    }
    onChange = (record, e) => {
        let value = this.state.historyValue;
        if (e.target.checked === false) {
            value.forEach((item, i) => {
                if (item.id === record.id) {
                    value.splice(i, 1)
                }
            })
        } else {
            value.push(record);
        }
        if (value.length > 2) {
            Modal.warning({
                title: '警告',
                content: '请确认只选择了两项，如超过两条，请去除多余项。。。',
            });
        }
        this.setState({ historyValue: value })
    }
    componentDidMount() {
        let data = this.props.taskCompareRevert.taskConfCompareInfoDtos;
        if (data){
            data.forEach((item, i) => {
                item.key = i;
            })
            let type = this.props.taskCompareRevert.type.code;
            let value = ['', ''];
            let configValue = ['', ''];
            if (type === 'Hive2Hive') {
                type = 'mysql';
                value[0] = this.props.taskCompareRevert.content;
            } else if (type === 'Hdfs2RelDb' || type === 'RelDb2RelDb' || type === 'execDBscript') {
                type = 'json';
                value[0] = JSON.stringify(JSON.parse(this.props.taskCompareRevert.content), null, 4);
            }
            configValue[0] = JSON.stringify(JSON.parse(this.props.taskCompareRevert.confContent), null, 4);
            this.setState({ data, type, value, configValue })
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.tagId !== nextProps.taskCompareRevert.taskId) {
            let type = nextProps.taskCompareRevert.type.code;
            let value = ['', ''];
            let configValue = ['', ''];
            if (type === 'Hive2Hive') {
                type = 'mysql';
                value[0] = nextProps.taskCompareRevert.content;
            }else if(type === 'Hdfs2RelDb' || type === 'RelDb2RelDb' || type === 'execDBscript'){
                type = 'json';
                value[0] = JSON.stringify(JSON.parse(nextProps.taskCompareRevert.content), null, 4);
            }
            configValue[0] = JSON.stringify(JSON.parse(nextProps.taskCompareRevert.confContent), null, 4);
            this.setState({ type, value , configValue })
            if (nextProps.taskCompareRevert.taskConfCompareInfoDtos){
                nextProps.taskCompareRevert.taskConfCompareInfoDtos.forEach((item, i) => {
                    item.key = i;
                })
                this.setState({ data: nextProps.taskCompareRevert.taskConfCompareInfoDtos })
            }
        }
    }

    render() {
        console.log(this.props)
        return (
            <div>
                <Button type="primary" className='add-project' style={{ left: 0, marginBottom: 20 }} onClick={this.showHistory}>查看选中版本差异</Button>
                <Table
                    columns={this.state.columns}
                    dataSource={this.state.data}
                    bordered
                />

                <Modal
                    title="查看当前版本与历史版本差异"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    width='1100px'
                    destroyOnClose={true}
                >   
                    <h3>配置对比</h3>
                    <DiffEditor
                        value={this.state.configValue}
                        height="200px"
                        width="1000px"
                        mode="json"
                        theme="github"
                        readOnly={true}
                        style={{ border: '1px solid #dcdcdc' }}
                        editorProps={{ $blockScrolling: true }}
                    />
                    <br/>
                    <h3>代码对比</h3>
                    <DiffEditor
                        value={this.state.value}
                        height="500px"
                        width="1000px"
                        mode={this.state.type}
                        theme="github"
                        readOnly={true}
                        style={{ border: '1px solid #dcdcdc' }}
                        editorProps={{ $blockScrolling: true }}
                    />
                </Modal>

                <Modal
                    title="查看选中版本差异"
                    visible={this.state.visibleH}
                    onOk={this.handleOkH}
                    onCancel={this.handleCancelH}
                    width='1100px'
                    destroyOnClose={true}
                >
                    <h3>配置对比</h3>
                    <DiffEditor
                        value={this.state.historyConfigVal}
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
                        value={this.state.valueData}
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
