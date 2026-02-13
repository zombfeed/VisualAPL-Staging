import React, { useRef, useCallback, useEffect } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  useReactFlow,
  Background,
  Panel,
  getConnectedEdges, getIncomers, getOutgoers,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';

import { AbilityNode, APLStartNode, APLEndNode, ConditionalAbilityNode, ConditionalAndNode, ConditoinalOrNode } from './nodes';

import Sidebar from './Sidebar';
import { DnDProvider, useDnD } from './DnDContext';
import { NfcIcon } from 'lucide-react';

const APLKey = 'apl-flow';
const nodeTypes = {
  ability: AbilityNode,
  'apl-start': APLStartNode,
  'apl-end': APLEndNode,
  'conditional-ability': ConditionalAbilityNode,
  'conditional-or': ConditoinalOrNode,
  'conditional-and': ConditionalAndNode,
};

let id = 0;
const getId = () => `dndnode_${id++}`;

function convertToAPL(flow) {
  var apl = ""
  var abilityList = "actions";
  var relevant_data = {}
  for (var i = 0; i < flow.nodes.length; i++) {
    relevant_data[flow.nodes[i].id] = {
      'type': flow.nodes[i].type,
      'data': Object.fromEntries(Object.entries(flow.nodes[i].data).map(([key, value]) => {
        if (typeof value === 'string') {
          return [key, value.toLowerCase()]; ''
        }
        return [key, value];
      }))
    };
  }
  var edges = []
  for (var i = 0; i < flow.edges.length; i++) {
    edges.push({
      'source': flow.edges[i].source,
      'target': flow.edges[i].target,
    });
  }
  for (var i = 0; i < flow.edges.length; i++) {
    if (relevant_data[edges[i].source].type === 'apl-start') {
      if (relevant_data[edges[i].target].type === 'ability') {
        apl += `${abilityList}=${relevant_data[edges[i].target].data.abilityName}\n`;
      }
    } else if (relevant_data[edges[i].source].type === 'ability') {
      apl += `${abilityList}+=${relevant_data[edges[i].target].data.abilityName}\n`;
    } else if (relevant_data[edges[i].target].type === 'apl-end') {
      abilityList = `actions${i}`;
    }
  }
  return apl;
}


function DnDFlow() {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { screenToFlowPosition } = useReactFlow();
  const [APLInstance, setAPLInstance] = React.useState(null);
  const [type, setType] = useDnD();

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
          data.conditional = n.data?.hasConditionals;
        }
        return { ...n, data };
      });

      const fullFlow = { ...flow, nodes: prunedNodes, edges: edges || [] };
      const json = JSON.stringify(fullFlow, null, 2);
      console.log(json);
      const aplfile = convertToAPL(flow);
      localStorage.setItem(APLKey, aplfile);

      const blob = new Blob([aplfile], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const now = new Date().toISOString().replace(/[:.]/g, '-');
      a.download = `apl-flow-${now}.txt`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    }
  }, [APLInstance, nodes, edges]);

  const onNodesDelete = useCallback((deleted) => {
    if (!deleted || deleted.length === 0) return;

    setEdges((eds) => {
      let nextEdges = eds.filter((e) => !deleted.some((n) => n.id === e.source || n.id === e.target));

      deleted.forEach((node) => {
        const incomers = getIncomers(node, nodes, eds);
        const outgoers = getOutgoers(node, nodes, eds);

        incomers.forEach((inc) => {
          outgoers.forEach((out) => {
            if (inc.id === out.id) return;
            const exists = nextEdges.find((e) => e.source === inc.id && e.target === out.id);
            if (!exists) {
              nextEdges = nextEdges.concat({ id: `e_${inc.id}_${out.id}`, source: inc.id, target: out.id });
            }
          });
        });
      });

      return nextEdges;
    });

    setNodes((nds) => nds.filter((n) => !deleted.some((d) => d.id === n.id)));
  }, [nodes, setNodes, setEdges]);

  useEffect(() => {
    const handler = (event) => {
      if (event.key !== 'Delete' && event.key !== 'Backspace') return;
      const allNodes = APLInstance?.getNodes ? APLInstance.getNodes() : nodes;
      const selected = (allNodes || []).filter((n) => n.selected);
      if (selected && selected.length) {
        onNodesDelete(selected);
      }
    };

    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [APLInstance, onNodesDelete, nodes]);

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
          onNodesDelete={onNodesDelete}
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

function FlowWithProvider() {
  return (
    <ReactFlowProvider>
      <DnDProvider>
        <DnDFlow />
      </DnDProvider>
    </ReactFlowProvider>
  );
}

export default FlowWithProvider;