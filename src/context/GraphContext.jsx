import React, { createContext, useState, useContext, useCallback } from 'react';
import { applyNodeChanges, applyEdgeChanges, addEdge, MarkerType } from '@xyflow/react';

const GraphContext = createContext();

export const useGraph = () => useContext(GraphContext);

const initialNodes = [
    { id: '1', position: { x: 100, y: 100 }, type: 'textNode', data: { label: '14f134fw', description: 'Handles initial user onboarding processes.' } },
    { id: '2', position: { x: 300, y: 200 }, type: 'textNode', data: { label: '245grtgwerg', description: 'Manages payment gateway integration.' } },
    { id: '3', position: { x: 200, y: 300 }, type: 'textNode', data: { label: '56g6g36h356', description: 'Responsible for order fulfillment logic.' } },
    { id: '4', position: { x: 400, y: 400 }, type: 'textNode', data: { label: '34t3t45g4', description: 'Tracks shipping and delivery updates.' } },
];

const initialEdges = [];
let id = 5;
const getId = () => `node_${id++}`;

export const GraphProvider = ({ children }) => {
    const [nodes, setNodes] = useState(initialNodes);
    const [edges, setEdges] = useState(initialEdges);

    const onNodesChange = useCallback((changes) => setNodes((nds) => applyNodeChanges(changes, nds)), []);
    const onEdgesChange = useCallback((changes) => setEdges((eds) => applyEdgeChanges(changes, eds)), []);

    const onConnect = useCallback((connection) => {
        const newEdge = addEdge(connection, []);
        const e = newEdge[0];
        e.data = { history: [] }; // history will now store objects: { id, title, priority, status, tags }
        e.type = 'custom';
        setEdges((eds) => [...eds, e]);
    }, []);

    const addNode = (name) => {
        if (!name) return;
        const newNodeId = getId();
        const newNode = { id: newNodeId, position: { x: Math.random() * 500, y: Math.random() * 400 }, data: { label: name }, type: 'textNode' };
        setNodes((prev) => [...prev, newNode]);
    };

    const addTestCase = (edgeId, testCase) => {
        setEdges((eds) => eds.map(e => {
            if (e.id === edgeId) {
                const newHistory = [...(e.data.history || []), { ...testCase, id: Date.now().toString(), status: 'Active' }];
                return { ...e, data: { ...e.data, history: newHistory } };
            }
            return e;
        }));
    };

    const updateNodeData = (nodeId, newData) => {
        setNodes((nds) => nds.map((node) => {
            if (node.id === nodeId) {
                return { ...node, data: { ...node.data, ...newData } };
            }
            return node;
        }));
    };

    return (
        <GraphContext.Provider value={{ nodes, edges, onNodesChange, onEdgesChange, onConnect, addNode, addTestCase, updateNodeData }}>
            {children}
        </GraphContext.Provider>
    );
};
