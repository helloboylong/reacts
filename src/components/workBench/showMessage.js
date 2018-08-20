import React, { Component } from 'react';
import ShowFlow from './model/showFlow';
import ShowSubFlow from './model/showSubFlow';
import ShowTask from './model/showTask';
import { Tabs } from 'antd';
const TabPane = Tabs.TabPane;
class messageMain extends Component {
    constructor(props) {
        super(props);
        this.newTabIndex = 0;
        this.state = {
            panes: [],
            activeKey: "",
        };
    }
    componentWillReceiveProps(nextProps) {
        this.setState({ panes: nextProps.panes, activeKey: nextProps.activeKey })
    }

    onChange = (activeKey) => {
        this.setState({ activeKey });
    }

    render() {
        let { messageData, flowVersionData, onEdit, onChange, tagFlag, taskData, taskCompareRevert } = this.props;
        let isRender = (val) => {
            switch (val) {
                case "FLOW":
                    return <ShowFlow messageData={messageData} flowVersionData={flowVersionData} tagFlag={tagFlag} />;
                case 'SUB_FLOW':
                    return <ShowSubFlow messageData={messageData}/>;
                case 'TASK':
                    return <ShowTask messageData={messageData} taskData={taskData} taskCompareRevert={taskCompareRevert} />;
                default:
                    break;
            }
        }
        return (
            <div>
                <Tabs
                    hideAdd
                    onChange={this.onChange}
                    activeKey={this.state.activeKey}
                    type="editable-card"
                    onEdit={onEdit}
                    onTabClick={onChange}
                >
                    {this.state.panes.map(pane => <TabPane tab={pane.title} key={pane.key}>{isRender(messageData.type)}</TabPane>)}
                </Tabs>
            </div>
        )
    }
}

export default messageMain;