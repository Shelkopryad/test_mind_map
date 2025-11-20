import React from 'react';
import { Handle, Position, useConnection } from '@xyflow/react';

export function TextNode({ id, data }) {
    const connection = useConnection();
    const inProgress = connection?.inProgress;
    const fromId = connection?.fromNode?.id;
    const isTarget = inProgress && fromId !== id;

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative'
        }}>
            <div style={{
                marginTop: '8px',
                fontSize: '12px',
                fontWeight: '500',
                color: '#1f2937',
                whiteSpace: 'nowrap',
                userSelect: 'none',
                pointerEvents: 'none'
            }}>
                {data.label}
            </div>

            {/* Circular dot node */}
            <div style={{
                width: '0px',
                height: '0px',
                borderRadius: '50%',
                background: '#5b21b6',
                border: '2px solid #7c3aed',
                boxShadow: '0 2px 8px rgba(91, 33, 182, 0.3)',
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
                position: 'relative'
            }}>
                {!inProgress && <Handle position={Position.Right} type="source" style={{ opacity: 1 }} />}
                {(!inProgress || isTarget) && <Handle position={Position.Left} type="target" isConnectableStart={false} style={{ opacity: 0 }} />}
            </div>

            {/* Label below the dot */}

        </div>
    );
}
