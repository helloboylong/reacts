import React, { Component } from 'react';
import NavSide from './navSide';
import Main1 from './model/main-1';
import Main2 from './model/main-2';
import Main3 from './model/main-3';
import Main4 from './model/main-4';
import "./deploy.css";
class deployCenter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            processType: "OFFLINE",
        };
    }

    handleClick = (e) => {
        this.setState({ processType: e.item.props.value })
    }
    render() {
        const isRender = (val) => {
            switch (val) {
                case "OFFLINE":
                    return <Main1 processType={this.state.processType}/>;
                case 'ONLINE':
                    return <Main2 processType={this.state.processType}/>;
                case '3':
                    return <Main3 />;
                case '4':
                    return <Main4 />;
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

export default deployCenter;