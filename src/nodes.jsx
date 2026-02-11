import {Position, Handle, useReactFlow} from '@xyflow/react';
import { useEffect, useState } from 'react';

const iconURL = '/assets/SpellIcons';
const abilitiesURL = '/assets/SpellIcons/abilities.json';

function findAPLStart({id, data}){
    const {getNodes, getEdges} = useReactFlow();
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

export function AbilityNode({id, data}){
    const {setNodes} = useReactFlow();
    const [imagesJson, setImages] = useState([]);
    const [selectedImage, setSelectedImage] = useState(data?.imageUrl || '');
    const [selectedName, setSelectedName] = useState(data?.abilityName || '');

    useEffect(() =>{
        fetch(abilitiesURL)
            .then((response)=>response.json())
            .then((json) => setImages(json))
            .catch(() => setImages([]));
    }, []);

    const handleChange = (event) => {
        try {
            const parsed = JSON.parse(event.target.value || '{}');
            setSelectedImage(parsed.url || '');
            setSelectedName(parsed.name || '');
        } catch {
            setSelectedImage(event.target.value || '');
            setSelectedName('');
        }
    };

    useEffect(() => {
        setNodes((nds) =>
            nds.map((node) =>{
                if (node.id === id) {
                    return { ...node, data: {...node.data, abilityName: selectedName } };
                }
                return node;
            }));
    }, [selectedImage, selectedName, id, setNodes]);

    const startNode = findAPLStart({id, data});

    const className = startNode?.data?.className;
    const specName = startNode?.data?.specName;

    let options = [];
    if (Array.isArray(imagesJson) && imagesJson.length && className && specName) {
        for (const entry of imagesJson) {
            if (entry[className] && entry[className][specName]) {
                options = entry[className][specName].map((it) => {
                    const fullUrl = it.url?.startsWith(iconURL) ? it.url : `${iconURL}${it.url}`;
                    return { ...it, url: fullUrl };
                });
                break;
            }
        }
    }

    if (!options.length) {
        options = data?.options || [];
    }

    const selectedValue = (selectedImage && selectedName) ? JSON.stringify({url: selectedImage, name: selectedName}) : '';

    return(
        <div className="ability-node">
            <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                <select onChange={handleChange} value={selectedValue} style={{minWidth:160}}>
                    <option value="">-- select ability --</option>
                    {options.map((opt) => {
                        const value = JSON.stringify({ url: opt.url, name: opt.name });
                        return (
                            <option key={opt.id ?? opt.name} value={value}>{opt.name}</option>
                        );
                    })}
                </select>

                {selectedImage && (
                    <img src={selectedImage} alt={selectedName || 'Selected'} style={{display:'block', marginTop: '5px', maxWidth:64}}/>
                )}
                {selectedName && (
                    <div style={{marginTop:4, fontSize:12}}>{selectedName}</div>
                )}
            </div>
            <Handle type="source" position={Position.Right} id="right-source-handle" />
            <Handle type="target" position={Position.Left} id="left-target-handle" />
        </div>
    );
}

export function APLStartNode({id, data}){
    const {setNodes} = useReactFlow();
    const [classSpecs, setClassSpecs] = useState({});
    const [classes, setClasses] = useState([]);
    const [className, setClassName] = useState(data?.className || '');
    const [specName, setSpecName] = useState(data?.specName || '');

    useEffect(() =>{
        fetch(abilitiesURL)
            .then((r) => r.json())
            .then((json) => {
                const mapping = {};
                const cls = [];
                for (const entry of json) {
                    const keys = Object.keys(entry);
                    if (!keys.length) continue;
                    const c = keys[0];
                    mapping[c] = Object.keys(entry[c] || {});
                    cls.push(c);
                }
                setClassSpecs(mapping);
                setClasses(cls);

                const defaultClass = data?.className || cls[0] || '';
                const defaultSpec = data?.specName || (mapping[defaultClass] ? mapping[defaultClass][0] : '');
                setClassName(defaultClass);
                setSpecName(defaultSpec);
            })
            .catch(() => {
                setClassSpecs({});
                setClasses([]);
            });
    }, [data]);

    useEffect(() => {
        setNodes((nds) =>
            nds.map((node) => {
                if (node.id === id) {
                    return { ...node, data: { ...node.data, className, specName } };
                }
                return node;
            })
        );
    }, [className, specName, id, setNodes]);

    const onClassChange = (e) => {
        const newClass = e.target.value;
        setClassName(newClass);
        const specs = classSpecs[newClass] || [];
        setSpecName(specs[0] || '');
    };

    const onSpecChange = (e) => setSpecName(e.target.value);

    const specsForClass = classSpecs[className] || [];

    return(
        <div className="apl-start-node" style={{display:'flex', flexDirection:'column', gap:6, alignItems:'center', padding:8}}>
            <div>Start</div>
            <div style={{display:'flex', gap:8}}>
                <select value={className} onChange={onClassChange}>
                    {classes.length ? classes.map((c) => (
                        <option key={c} value={c}>{c}</option>
                    )) : <option value="">(no classes)</option>}
                </select>

                <select value={specName} onChange={onSpecChange} disabled={!specsForClass.length}>
                    {specsForClass.length ? specsForClass.map((s) => (
                        <option key={s} value={s}>{s}</option>
                    )) : <option value="">(no specs)</option>}
                </select>
            </div>

            <Handle type="source" position={Position.Right} id="right-source-handle" />
        </div>
    );
}

export function APLEndNode(){
    return(
        <div className="apl-end-node">
            End
            <Handle type="target" position={Position.Left} id="left-target-handle" />
        </div>
    );
}