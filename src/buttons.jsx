import React from 'react';
import {ReactFlowProvider, useReactFlow, Controls, ControlButton} from '@xyflow/react';
import {Plus} from 'lucide-react';

const getId = () => `node_${Math.random().toString(36).substr(2,9)}`;

const AddNodeButton = () =>{
    const {addNodes} = useReactFlow();

    const onClick = () => {
        const newNode = {
            id: getId(),
            position:{
                x: 100,
                y: 100
            },
            data: {label: "New Node"},
            type: "ability",
        };
        addNodes(newNode);
    };
    return (
        <ControlButton onClick={onClick} title="Add Node">
            <Plus size={16}/>
        </ControlButton>
    );
};

export default AddNodeButton;