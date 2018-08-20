import React, { Component } from 'react';
import NavSide from './navSide';
import SysApp from './model/sysApp';
import SysAzkaban from './model/sysAzkaban';
import ApplyAdmin from './model/applyAdmin';
import ApprovelAdmin from './model/approvelAdmin';
import SysMember from './model/sysMember';
export default class SysMange extends Component{
    constructor(props){
        super(props);
        this.state = {
            type: "app",
        }
    }
    handleClick = (e) => {
        this.setState({ type: e.item.props.value })
    }
    render(){
        let isRender = (val) => {
            switch (val) {
                case "app":
                    return <SysApp />;
                case 'azkaban':
                    return <SysAzkaban />;
                case 'admin':
                    return <ApplyAdmin />;
                case "approvelAdmin":
                    return <ApprovelAdmin />;
                case "sysMember":
                    return <SysMember />;
                default:
                    break;
            }
        }
        return (
            <div className='main'>
                <NavSide handleClick={this.handleClick}/>
                <div className='main-col'>
                    <div className='message-main'>
                        {isRender(this.state.type)}
                    </div>
                </div>
            </div>
        )
    }
}