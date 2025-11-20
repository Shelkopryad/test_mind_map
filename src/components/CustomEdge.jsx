import React from 'react';

export function CustomEdge({ id, sourceX, sourceY, targetX, targetY, markerEnd, data }) {
    const edgePath = `M${sourceX},${sourceY}L${targetX},${targetY}`;
    return <path id={id} d={edgePath} stroke="#b1b1b7" strokeWidth={2} fill="none" markerEnd={markerEnd} />;
}
