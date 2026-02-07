import {Position, Handle, useReactFlow} from '@xyflow/react';
import { useEffect, useState } from 'react';

export function AbilityNode({id, data}){
    const {setNodes} = useReactFlow();
    const [images, setImages] = useState([]);
    const [selectedImage, setSelectedImage] = useState(data?.imageUrl || '');

    useEffect(() =>{
        fetch('/SpellIcons/rogue_abilities.json')
            .then((response)=>response.json())
            .then((json) => setImages(json))
            .catch(() => setImages([]));
    }, []);

    const handleChange = (event) => {
        const newUrl = event.target.value;
        setSelectedImage(newUrl);

        setNodes((nds) =>
            nds.map((node) =>{
                if (node.id === id) {
                    return { ...node, data: {...node.data, imageUrl: newUrl}};
                }
                return node;
            }));
    };

    const options = images.length ? images : (data?.options || []);

    return(
        <div className="ability-node">
            <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                <select onChange={handleChange} value={selectedImage} style={{minWidth:120}}>
                    <option value="">-- select ability --</option>
                    {options.map((opt) => {
                        const fullUrl = opt.url?.startsWith('/SpellIcons') ? opt.url : `/SpellIcons${opt.url}`;
                        return (
                            <option key={opt.id ?? opt.name} value={fullUrl}>{opt.name}</option>
                        );
                    })}
                </select>

                {selectedImage && (
                    <img src={selectedImage} alt="Selected" style={{display:'block', marginTop: '5px'}}/>
                )}
            </div>
            <Handle type="source" position={Position.Right} id="right-source-handle" />
            <Handle type="target" position={Position.Left} id="left-target-handle" />
        </div>
    );
}

export function APLStartNode(){
    return(
        <div className="apl-start-node">
            Start
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