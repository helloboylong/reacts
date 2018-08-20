import React, { Component } from 'react';
import { Menu } from 'antd';
class NavSide extends Component {
    constructor(props) {
        super(props)
        this.state = {
            current: '1',
        }
    }
    handleClick = (e) => {
        this.setState({
            current: e.key,
        });
    }
    render() {
        return (
            <div className='nav-side'>
                <Menu
                    onSelect={this.handleClick}
                    onClick={this.props.handleClick}
                    style={{ width: "100%" }}
                    selectedKeys={[this.state.current]}
                    mode="inline"
                >
                    <Menu.Item key="1" value="OFFLINE">线下部署</Menu.Item>
                    <Menu.Item key="2" value="ONLINE">线上部署</Menu.Item>
                    <Menu.Item key="3" value="3">TAG查询</Menu.Item>
                    <Menu.Item key="4" value="4">回滚</Menu.Item>
                </Menu>
            </div>
        )
    }
}

export default NavSide;