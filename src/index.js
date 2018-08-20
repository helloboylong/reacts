import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, hashHistory,IndexRoute } from 'react-router';

import './index.css';
import App from './components/App';
import workBench from './components/workBench/workBench';
import proManage from './components/proManage/proManage';
import processCenter from './components/processCenter/processCenter';
import deployCenter from './components/deployCenter/deployCenter';
import setConfig from './components/proManage/setConfig/setConfig';
import authorityManage from './components/authorityManage/authorityManage';
import sysManage from './components/sysManage/sysManage';

ReactDOM.render((
    <Router history={hashHistory}>
        <Route path="/" component={App}>
            <IndexRoute  component={workBench}  />
            <Route path="/workBench" component={workBench} />
            <Route path="/proManage" component={proManage} />
            <Route path="/proManage/setConfig" component={setConfig} />
            <Route path="/processCenter" component={processCenter} />
            <Route path="/deployCenter" component={deployCenter} />
            <Route path="/authorityManage" component={authorityManage} />
            <Route path="/sysManage" component={sysManage} />
        </Route>
    </Router>
), document.getElementById('root'));
