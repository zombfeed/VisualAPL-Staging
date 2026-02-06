import { useCallback} from "react";
import {Position, Handle} from '@xyflow/react';

function AbilityNode(props){
    const onChange = useCallback((evt) => {
        console.log(evt.target.value);
    }, []);
    return(
    <div className="ability-node">
        <div>
            <label htmlFor="text">Text:</label>
            <input id="text" name="text" onChange={onChange} className ="drag"/>
            
            <Handle type="source" position={Position.Right} id="right-source-handle" />
            <Handle type="target" position={Position.Left} id="left-target-handle" />
        </div>
    </div>);
}
export default AbilityNode;