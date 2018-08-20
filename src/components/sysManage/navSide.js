import React, { Component } from 'react';
import { Menu } from 'antd';
class NavSide extends Component {
    constructor(props) {
        super(props);
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
                    <Menu.Item key="1" value="app">app的配置</Menu.Item>
                    <Menu.Item key="2" value="azkaban">azkaban的配置</Menu.Item>
                    <Menu.Item key="3" value="admin">申请系统管理员</Menu.Item>
                    <Menu.Item key="4" value="approvelAdmin">审批系统管理员权限</Menu.Item>
                    <Menu.Item key="5" value="sysMember">系统管理员管理</Menu.Item>
                </Menu>
            </div>
        )
    }
}

export default NavSide;