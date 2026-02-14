import { Position, useReactFlow, useUpdateNodeInternals } from '@xyflow/react';
import { useEffect, useState } from 'react';
import abilitiesJson from '../public/SpellIcons/abilities.json';
import LimitHandle from './handles.jsx';
const iconURL = '/VisualAPL-Staging/SpellIcons';

function findAPLStart({ id, data }) {
    const { getNodes, getEdges } = useReactFlow();
    const nodesAll = typeof getNodes === 'function' ? getNodes() : [];
    const edgesAll = typeof getEdges === 'function' ? getEdges() : [];

    const nodeById = {};
    nodesAll.forEach(n => { nodeById[n.id] = n; });

    const parentsMap = {};
    edgesAll.forEach(e => {
        if (!parentsMap[e.target]) parentsMap[e.target] = [];
        parentsMap[e.target].push(e.source);
    });

    const findUpstreamStart = (startId) => {
        const visited = new Set();
        const queue = [startId];
        while (queue.length) {
            const current = queue.shift();
            if (visited.has(current)) continue;
            visited.add(current);
            const node = nodeById[current];
            if (node && node.type === 'apl-start') return node;
            const parents = parentsMap[current] || [];
            for (const p of parents) {
                if (!visited.has(p)) queue.push(p);
            }
        }
        return null;
    };

    const startNode = findUpstreamStart(id);
    return startNode;
}

export function AbilityNode({ id, data }) {
    const { setNodes } = useReactFlow();
    const [selectedImage, setSelectedImage] = useState(data?.imageUrl || '');
    const [selectedName, setSelectedName] = useState(data?.abilityName || '');
    const [selectedTypes, setSelectedTypes] = useState(data?.types || '');
    const updateNodeInternals = useUpdateNodeInternals();

    const toggleHandles = (event) => {
        const checked = event.target.checked;
        setNodes((nds) =>
            nds.map((node) => {
                if (node.id === id) {
                    const newData = { ...node.data, hasConditionals: checked };
                    return { ...node, data: newData };
                }
                return node;
            })
        );
        updateNodeInternals(id);
    };

    return (
        <div className="ability-node">
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {selectedName && (
                    <div style={{ marginTop: 4, fontSize: 12 }}>{selectedName}</div>
                )}
                    {selectedImage && (
                        <img src={selectedImage} alt={selectedName || 'Selected'} style={{ display: 'block', marginTop: '5px', maxWidth: 64 }} />
                    )}
                    <div className='conditional-checkbox' style={{ position: 'fixed', top: "38%", right: "8px", display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <label style={{ display: 'relative', alignItems: 'center', top: 5 }}>If</label>
                        <input type="checkbox" onChange={toggleHandles} checked={data.hasConditionals || false} />
                    </div>
                    <LimitHandle type="source" position={Position.Right} id="cond-left-source-handle" style={{ top: '50%' }} className={!data.hasConditionals ? 'handle-hidden' : ''} connectioncount={1} />
                </div>
            </div>
            <LimitHandle type="source" position={Position.Bottom} id="bottom-source-handle" connectioncount={1}/>
            <LimitHandle type="target" position={Position.Top} id="top-target-handle" connectioncount={1}/>
        </div>
    );
}

export function ConditionalAbilityNode({ id, data }) {
    const { setNodes } = useReactFlow();
    const [selectedImage, setSelectedImage] = useState(data?.imageUrl || '');
    const [selectedName, setSelectedName] = useState(data?.abilityName || '');
    const [selectedTypes, setSelectedTypes] = useState(data?.types || '');
    const updateNodeInternals = useUpdateNodeInternals();

    //TODO: handle various ability options, such as stack count, remaining duration, etc...


    return (
        <div className="ability-node">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 }}>
                    {selectedImage && (
                        <img src={selectedImage} alt={selectedName || 'Selected'} style={{ display: 'block', marginTop: '5px', maxWidth: 64 }} />
                    )}
                    {selectedName && (
                        <div style={{ marginTop: 4, fontSize: 12 }}>{selectedName}</div>
                    )}
                </div>
            </div>
            <LimitHandle type="source" position={Position.Right} id="cond-ability-right-source-handle" connectioncount={1}/>
            <LimitHandle type="target" position={Position.Left} id="cond-ability-left-target-handle" connectioncount={1}/>
        </div>
    );
}

export function ConditionalOrNode() {
    return (
        <div className="conditional-or-node">
            <label style={{ display: 'absolute', alignItems: 'center', top: '5px' }}>COND: OR</label>
            <LimitHandle type="target" position={Position.Left} id="cond-left-target-handle" connectioncount={1}/>
            <LimitHandle type="source" position={Position.Right} id="cond-right-source-handle" connectioncount={1}/>
        </div>
    );
}

export function ConditionalAndNode() {
    return (
        <div className="conditional-and-node">
            <label style={{ display: 'absolute', alignItems: 'center', top: '5px' }}>COND: AND</label>
            <LimitHandle type="target" position={Position.Left} id="cond-left-target-handle" connectioncount={1}/>
            <LimitHandle type="source" position={Position.Right} id="cond-right-source-handle" connectioncount={1}/>
        </div>
    );
}

export function APLStartNode({ id, data }) {
    const className = data?.className || '';
    const specName = data?.specName || '';

    return (
        <div className="apl-start-node" style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center', padding: 8 }}>
            <div>Start</div>
            <LimitHandle type="source" position={Position.Bottom} id="bottom-source-handle" connectioncount={1}/>
        </div>
    );
}

export function APLEndNode() {
    return (
        <div className="apl-end-node">
            End
            <LimitHandle type="target" position={Position.Top} id="top-target-handle" connectioncount={1}/>
        </div>
    );
}