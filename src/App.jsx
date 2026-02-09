import React, { useRef, useCallback, use } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  useReactFlow,
  Background,
  Panel
} from '@xyflow/react';
 
import '@xyflow/react/dist/style.css';

import {AbilityNode, APLStartNode, APLEndNode} from './nodes';
 
import Sidebar from './Sidebar';
import { DnDProvider, useDnD } from './DnDContext';

const APLKey = 'apl-flow';
const nodeTypes = {
    ability: AbilityNode,
    'apl-start': APLStartNode,
    'apl-end': APLEndNode,
  };
 
let id = 0;
const getId = () => `dndnode_${id++}`;

function DnDFlow(){
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { screenToFlowPosition } = useReactFlow();
  const [APLInstance, setAPLInstance] = React.useState(null);
  const [type] = useDnD();

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), []);
 
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);
 
  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
 
      if (!type) {
        return;
      }
 
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

  const onSave = useCallback(() => {
    if (APLInstance) {
      const flow = APLInstance.toObject();

      const prunedNodes = (nodes || []).map((n) => {
        const data = {};
        if (n.type === 'apl-start') {
          data.className = n.data?.className;
          data.specName = n.data?.specName;
        } else if (n.type === 'ability') {
          data.abilityName = n.data?.abilityName;
        }
        return { ...n, data };
      });

      const fullFlow = { ...flow, nodes: prunedNodes, edges: edges || [] };
      const json = JSON.stringify(fullFlow, null, 2);
      localStorage.setItem(APLKey, json);

      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const now = new Date().toISOString().replace(/[:.]/g, '-');
      a.download = `apl-flow-${now}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    }
  }, [APLInstance, nodes, edges]);
 
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
          onInit={setAPLInstance}
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          fitView
        >
          <Controls />
          <Background />
          <Panel position="top-right">
            <button className="xy-theme__button" onClick={onSave}>save</button>
          </Panel>
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