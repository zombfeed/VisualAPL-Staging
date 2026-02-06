import React, { useRef, useCallback } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  useReactFlow,
  Background,
} from '@xyflow/react';
 
import '@xyflow/react/dist/style.css';

import {AbilityNode} from './nodes';
 
import Sidebar from './Sidebar';
import { DnDProvider, useDnD } from './DnDContext';


const nodeTypes = {
    ability: AbilityNode,
  };

const initialNodes = [
  {
    id: '1',
    type: 'input',
    data: { label: 'APL Start' },
    position: { x: 250, y: 5 },
  },
  {
    id: '2',
    type:'ability',
    data:{ label: 'ability'},
    position:{x:300, y: 100},
  }
];
 
let id = 0;
const getId = () => `dndnode_${id++}`;

function DnDFlow(){
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { screenToFlowPosition } = useReactFlow();
  const [type] = useDnD();

 
  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), []);
 
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);
 
  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
 
      // check if the dropped element is valid
      if (!type) {
        return;
      }
 
      // project was renamed to screenToFlowPosition
      // and you don't need to subtract the reactFlowBounds.left/top anymore
      // details: https://reactflow.dev/whats-new/2023-11-10
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const newNode = {
        id: getId(),
        type,
        position,
        data: { label: `${type} node` },
      };
 
      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition, type],
  );
 
  const onDragStart = (event, nodeType) => {
    setType(nodeType);
    event.dataTransfer.setData(nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };
 
  return (
    <div className="dndflow">
      <Sidebar />
      <div className="reactflow-wrapper" ref={reactFlowWrapper} style={{ width: '100vw', height: '100vh' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          fitView
        >
          <Controls />
          <Background />
        </ReactFlow>
      </div>

    </div>
  );
};
 
function FlowWithProvider (){
  return(
    <ReactFlowProvider>
      <DnDProvider>
        <DnDFlow />
      </DnDProvider>
    </ReactFlowProvider>
  );
}

export default FlowWithProvider;