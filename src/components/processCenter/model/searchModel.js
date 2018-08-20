import React,{Component} from 'react';
import { Tree } from 'antd';
const TreeNode = Tree.TreeNode;
class TreeModel extends Component{
    constructor(props) {
        super(props);
        this.state = {
            tree:"",
            // tree: [{
            //     "project": {
            //         "originLockerVersion": null,
            //         "id": 3,
            //         "createdAt": 1521825276000,
            //         "createdBy": "sys",
            //         "updatedAt": 1521825276000,
            //         "updatedBy": "sys",
            //         "name": "pd",
            //         "description": "pd",
            //         "status": "REVIEW_SUCCESS",
            //         "lockerVersion": 1,
            //         "new": false
            //     },
            //     "nodes": [{
            //         "originLockerVersion": null,
            //         "id": 16,
            //         "createdAt": 1522033791000,
            //         "createdBy": "sys",
            //         "updatedAt": 1523175621000,
            //         "updatedBy": "sys",
            //         "name": "Statement2101",
            //         "taskId": null,
            //         "dependencyNodeIds": "",
            //         "type": "FLOW",
            //         "rootNodeId": 16,
            //         "status": "NOMAL",
            //         "versionStatus": "INIT",
            //         "projectId": 3,
            //         "cronScheduler": "12",
            //         "tagId": 3,
            //         "md5": "0eff093af7ae150f447692aa1f2e6996",
            //         "lockerVersion": 20,
            //         "description": "testdesc",
            //         "retryCnt": 6,
            //         "new": false
            //     }, {
            //         "originLockerVersion": null,
            //         "id": 21,
            //         "createdAt": 1522053961000,
            //         "createdBy": "SYS",
            //         "updatedAt": 1522202717000,
            //         "updatedBy": "sys",
            //         "name": "t2test",
            //         "taskId": -1,
            //         "dependencyNodeIds": "",
            //         "type": "FLOW",
            //         "rootNodeId": 21,
            //         "status": "NOMAL",
            //         "versionStatus": "INIT",
            //         "projectId": 3,
            //         "cronScheduler": "02",
            //         "tagId": null,
            //         "md5": "004077d3db8032e26b6c02b121d3e19a",
            //         "lockerVersion": 4,
            //         "description": "110",
            //         "retryCnt": 1,
            //         "new": false
            //     }]
            // }, {
            //     "project": {
            //         "originLockerVersion": null,
            //         "id": 31,
            //         "createdAt": 1521825276000,
            //         "createdBy": "sys",
            //         "updatedAt": 1521825276000,
            //         "updatedBy": "sys",
            //         "name": "pd",
            //         "description": "pd",
            //         "status": "REVIEW_SUCCESS",
            //         "lockerVersion": 1,
            //         "new": false
            //     },
            //     "nodes": [{
            //         "originLockerVersion": null,
            //         "id": 161,
            //         "createdAt": 1522033791000,
            //         "createdBy": "sys",
            //         "updatedAt": 1523175621000,
            //         "updatedBy": "sys",
            //         "name": "Statement2101",
            //         "taskId": null,
            //         "dependencyNodeIds": "",
            //         "type": "FLOW",
            //         "rootNodeId": 16,
            //         "status": "NOMAL",
            //         "versionStatus": "INIT",
            //         "projectId": 3,
            //         "cronScheduler": "12",
            //         "tagId": 3,
            //         "md5": "0eff093af7ae150f447692aa1f2e6996",
            //         "lockerVersion": 20,
            //         "description": "testdesc",
            //         "retryCnt": 6,
            //         "new": false
            //     }, {
            //         "originLockerVersion": null,
            //         "id": 211,
            //         "createdAt": 1522053961000,
            //         "createdBy": "SYS",
            //         "updatedAt": 1522202717000,
            //         "updatedBy": "sys",
            //         "name": "t2test",
            //         "taskId": -1,
            //         "dependencyNodeIds": "",
            //         "type": "FLOW",
            //         "rootNodeId": 21,
            //         "status": "NOMAL",
            //         "versionStatus": "INIT",
            //         "projectId": 3,
            //         "cronScheduler": "02",
            //         "tagId": null,
            //         "md5": "004077d3db8032e26b6c02b121d3e19a",
            //         "lockerVersion": 4,
            //         "description": "110",
            //         "retryCnt": 1,
            //         "new": false
            //     }]
            // }],
        }
    }
    componentDidMount() {
        
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.treeData!==this.props.treeData){
            this.setState({tree:nextProps.treeData})
        }
    }

    loopTree = (arr) => {
        if (arr && Array.isArray(arr) && arr.length > 0){
            return arr.map((item) => {
                // console.log(item)
                return (
                    <TreeNode title={item.project.name} key={item.project.id} projectId={item.project.id}>
                        {this.loopSubTree(item.nodes)}
                    </TreeNode>
                )
            })
        }
    }
    loopSubTree = (arr) =>{
        if (arr && Array.isArray(arr) && arr.length > 0) {
            return arr.map((item)=>{
                return <TreeNode title={item.name} key={item.id} projectId={item.projectId} flowId={item.id}/>
            })
        }
    }
    
    render(){
        return(
            <Tree
                showLine
                onSelect={this.props.onSelect}
            >
                {this.loopTree(this.state.tree)}
            </Tree>
        )
    }
}

export default TreeModel;