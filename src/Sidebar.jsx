import React, { useEffect, useState } from 'react';
import { useDnD } from './DnDContext';
import { useReactFlow } from '@xyflow/react';
import abilitiesJson from '../public/SpellIcons/abilities.json';
import { Collapse } from '@kunukn/react-collapse';

const iconURL = '/VisualAPL-Staging/SpellIcons';

export default () => {
  const [type, setType] = useDnD();
  const { setNodes } = useReactFlow();
  const [isAOpen, setIsAOpen] = useState(false);

  const [isCAOpen, setIsCAOpen] = useState(false);

  const [classSpecs, setClassSpecs] = useState({});
  const [classes, setClasses] = useState([]);
  const [className, setClassName] = useState('');
  const [specName, setSpecName] = useState('');

  const onAToggle = () => setIsAOpen((s) => !s);
  const onCAToggle = () => setIsCAOpen((s) => !s);

  useEffect(() => {
    try {
      const json = Array.isArray(abilitiesJson) ? abilitiesJson : [];
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
      const defaultClass = cls[0] || '';
      const defaultSpec = mapping[defaultClass] ? mapping[defaultClass][0] : '';
      setClassName(defaultClass);
      setSpecName(defaultSpec);
    } catch (e) {
      setClassSpecs({});
      setClasses([]);
    }
  }, []);

  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.type === 'apl-start') {
          return { ...node, data: { ...node.data, className, specName } };
        }
        return node;
      })
    );
  }, [className, specName, setNodes]);

  const onDragStart = (event, nodeType, payload) => {
    setType(payload ? { nodeType, payload } : nodeType);
    try {
      event.dataTransfer.setData('application/json', JSON.stringify(payload || nodeType));
    } catch (e) { }
    event.dataTransfer.effectAllowed = 'move';
  };

  const onClassChange = (e) => {
    const newClass = e.target.value;
    setClassName(newClass);
    const specs = classSpecs[newClass] || [];
    setSpecName(specs[0] || '');
  };

  const onSpecChange = (e) => setSpecName(e.target.value);

  const options = (classSpecs[className] && className && specName) ?
    (abilitiesJson.find((ent) => !!ent[className])?.[className]?.[specName] || []) : [];

  const abilityItems = options.map((opt) => {
    const fullUrl = opt.url?.startsWith(iconURL) ? opt.url : `${iconURL}${opt.url}`;
    return { ...opt, url: fullUrl };
  });

  return (
    <aside>
      <div className="description">Drag nodes into the flow; ability list updates by class/spec.</div>
      <div style={{ display: 'flex', gap: 8, margin: '8px 0' }}>
        <select value={className} onChange={onClassChange}>
          {classes.length ? classes.map((c) => (
            <option key={c} value={c}>{c}</option>
          )) : <option value="">(no classes)</option>}
        </select>
        <select value={specName} onChange={onSpecChange} disabled={!classSpecs[className]}>
          {classSpecs[className] && classSpecs[className].length ? classSpecs[className].map((s) => (
            <option key={s} value={s}>{s}</option>
          )) : <option value="">(no specs)</option>}
        </select>
      </div>

      <div className="dndnode input" onDragStart={(event) => onDragStart(event, 'apl-start')} draggable>
        APL Start Node
      </div>
      <div className="dndnode output" onDragStart={(event) => onDragStart(event, 'apl-end')} draggable>
        End Node
      </div>
      <div className="dndnode" onDragStart={(event) => onDragStart(event, "conditional-or")} draggable>
        OR
      </div>
      <div className="dndnode" onDragStart={(event) => onDragStart(event, "conditional-and")} draggable>
        AND
      </div>

      <div style={{ marginTop: 12 }}>
        <button onClick={onAToggle}>Abilities</button>
        <Collapse
          isOpen={isAOpen}
          transition="height 300ms cubic-bezier(0.4, 0, 0.2, 1)"
        >
          {abilityItems.length ? abilityItems.map((a) => (
            <div key={a.id ?? a.name} className="dndnode" draggable
              onDragStart={(event) => onDragStart(event, 'ability', { options: [a], abilityName: a.name, imageUrl: a.url, types: a.types })}>
              <img src={a.url} alt={a.name} style={{ width: 20, height: 20, marginRight: 6, verticalAlign: 'middle' }} />
              {a.name}
            </div>
          )) : <div style={{ fontSize: 12, opacity: 0.8 }}>No abilities for selected class/spec</div>}
        </Collapse>
      </div>
      <div style={{ marginTop: 12 }}>
        <button onClick={onCAToggle}>Contional Abilities</button>
        <Collapse
          isOpen={isCAOpen}
          transition="height 300ms cubic-bezier(0.4, 0, 0.2, 1)"
        >
          {abilityItems.length ? abilityItems.map((a) => (
            <div key={a.id ?? a.name} className="dndnode" draggable
              onDragStart={(event) => onDragStart(event, 'conditional-ability', { options: [a], abilityName: a.name, imageUrl: a.url, types: a.types })}>
              <img src={a.url} alt={a.name} style={{ width: 20, height: 20, marginRight: 6, verticalAlign: 'middle' }} />
              {a.name}
            </div>
          )) : <div style={{ fontSize: 12, opacity: 0.8 }}>No conditional abilities for selected class/spec</div>}
        </Collapse>
      </div>
    </aside>
  );
};