import React, { Component } from 'react';
import NavSide from './navSide';
import ENVMain from './ENVMain';
import ParamsMain from './ParamsMain';

class SetConfig extends Component{
    constructor(props){
        super(props);
        this.state={
            setConfig:"ENV",
        }
    }
    
    componentDidMount() {

    }
    handleClick = (e) => {
        this.setState({ setConfig: e.item.props.value })
    }
    render(){
        let isRender = (val) =>{
            switch (val) {
                case "ENV":
                    return <ENVMain />;
                case 'PARAMS':
                    return <ParamsMain />;
                default:
                    break;
            }
        }
        return(

                <div className='main' >
                    <NavSide handleClick={this.handleClick} />
                    <div className='main-col'>
                        <div className='message-main'>
                            {isRender(this.state.setConfig)}
                        </div>
                    </div>

                </div>

        )
    }
}

export default SetConfig;