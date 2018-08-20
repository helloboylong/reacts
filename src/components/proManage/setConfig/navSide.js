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
                    <Menu.Item key="1" value="ENV">环境配置</Menu.Item>
                    <Menu.Item key="2" value="PARAMS">参数配置</Menu.Item>
                </Menu>
            </div>
        )
    }
}

export default NavSide;