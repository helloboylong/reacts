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
                    <Menu.Item key="1" value="apply">权限查看及申请</Menu.Item>
                    <Menu.Item key="2" value="approvel">审批中的权限</Menu.Item>
                    <Menu.Item key="3" value="demand">审批结果查询</Menu.Item>
                    <Menu.Item key="4" value="proMember">项目成员管理</Menu.Item>
                </Menu>
            </div>
        )
    }
}

export default NavSide;