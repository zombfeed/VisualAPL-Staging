import React from 'react';
import { useDnD } from './DnDContext';
 
export default () => {
  const [_, setType] = useDnD();
 
  const onDragStart = (event, nodeType) => {
    setType(nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };
 
  return (
    <aside>
      <div className="description">You can drag these nodes to the pane on the right.</div>
      <div className="dndnode input" onDragStart={(event) => onDragStart(event, 'apl-start')} draggable>
        APL Start Node
      </div>
      <div className="dndnode" onDragStart={(event) => onDragStart(event, 'ability')} draggable>
        Ability Node
      </div>
      <div className="dndnode output" onDragStart={(event) => onDragStart(event, 'apl-end')} draggable>
        End Node
      </div>
    </aside>
  );
};