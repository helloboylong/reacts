import React, { Component } from 'react';
import NavSide from './navSide';
import Approvel from './model/approvel';
import Apply from './model/apply';
import Demand from './model/demand';
import ProMember from './model/proMember';
class authorityManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            status:"apply",
        }
    }
    handleClick = (e) => {
        this.setState({status:e.item.props.value});
    }
    render() {
        let isRender = (val) => {
            switch (val) {
                case 'apply':
                    return <Apply />;
                case "approvel":
                    return <Approvel />;
                case 'demand':
                    return <Demand />;
                case 'proMember':
                    return <ProMember />;
                default:
                    break;
            }
        }
        return (
            <div className='main'>
                <NavSide handleClick={this.handleClick} />
                <div className='main-col'>
                    <div className='message-main'>
                        {isRender(this.state.status)}
                    </div>
                </div>
            </div>
        )
    }
}

export default authorityManage;