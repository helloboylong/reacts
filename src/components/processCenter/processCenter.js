import React, { Component } from 'react';
import NavSide from './navSide';
import TestVersion from './model/testVersion';
import OnlineVersion from './model/onlineVersion'
import './processCenter.css';
class processCenter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            processType :"TAG",
        };
    } 
    
    handleClick = (e) => {
        this.setState({ processType: e.item.props.value})
    }
    render() {
        let isRender = (val) => {
            switch (val) {
                case "TAG":
                    return <TestVersion />;
                case 'REG':
                    return <OnlineVersion />;
                default:
                    break;
            }
        }
        return (
            <div className='main'>
                <NavSide handleClick={this.handleClick}/>
                <div className='main-col'>
                    <div className='message-main'>
                        {isRender(this.state.processType)}
                        
                    </div>
                </div>
            </div>
        )
    }
}

export default processCenter;