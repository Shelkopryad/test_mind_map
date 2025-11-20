import { useCallback } from 'react';
import { Handle, Position, useConnection } from '@xyflow/react';

function TextUpdaterNode({ id }) {
    const onChange = useCallback((evt) => {
        // console.log(evt.target.value);
    }, []);

    const connection = useConnection();

    const isTarget = connection.inProgress && connection.fromNode.id !== id;

    return (
        <div className="text-updater-node">
            <div>
                <label htmlFor="text">Text:</label>
                <input id="text" name="text" onChange={onChange} className="nodrag" />
            </div>
            {!connection.inProgress && (
                <Handle
                    className="customHandle"
                    position={Position.Right}
                    type="source"
                />
            )}
            {/* We want to disable the target handle, if the connection was started from this node */}
            {(!connection.inProgress || isTarget) && (
                <Handle className="customHandle" position={Position.Left} type="target" isConnectableStart={false} />
            )}
        </div>
    );
}

export default TextUpdaterNode;