import React, { useCallback, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Background,
    ReactFlow,
    Controls,
    MarkerType,
} from '@xyflow/react';
import { useGraph } from '../context/GraphContext';
import { TextNode } from '../components/TextNode';
import { Modal } from '../components/Modal';
import { EdgeModal } from '../components/EdgeModal';
import { CustomEdge } from '../components/CustomEdge';

import '@xyflow/react/dist/style.css';
import '../styles/App.css';

const nodeTypes = { textNode: TextNode };
const edgeTypes = { custom: CustomEdge };
const defaultEdgeOptions = { type: 'custom', markerEnd: { type: MarkerType.ArrowClosed, color: '#b1b1b7' } };

function MyGraphEditor() {
    const { nodes, edges, onNodesChange, onEdgesChange, onConnect, addNode, addTestCase } = useGraph();
    const [showModal, setShowModal] = useState(false);
    const [activeEdgeId, setActiveEdgeId] = useState(null);
    const [selectedNodeId, setSelectedNodeId] = useState(null);
    const [nodeModalOpen, setNodeModalOpen] = useState(false);
    const [activeNode, setActiveNode] = useState(null);
    const [hoveredNodeId, setHoveredNodeId] = useState(null);
    const navigate = useNavigate();

    const handleAddNode = (name) => {
        addNode(name);
    };

    const handleAddCase = (edgeId, newCase) => {
        addTestCase(edgeId, newCase);
    };

    const onEdgeClick = (_, edge) => setActiveEdgeId(edge.id);

    const onNodeClick = useCallback((_, node) => {
        setSelectedNodeId((currentId) => (currentId === node.id ? null : node.id));
        setActiveNode(node);
        setNodeModalOpen(true);
    }, []);

    const onPaneClick = useCallback(() => setSelectedNodeId(null), []);
    const onNodeMouseEnter = useCallback((_, node) => setHoveredNodeId(node.id), []);
    const onNodeMouseLeave = useCallback(() => setHoveredNodeId(null), []);

    const { nodes: processedNodes, edges: processedEdges } = useMemo(() => {
        const highlightId = hoveredNodeId || selectedNodeId;

        if (!highlightId) {
            const allNodes = nodes.map(n => ({ ...n, style: { ...n.style, opacity: 1 } }));
            const allEdges = edges.map(e => ({ ...e, animated: false, style: { ...e.style, stroke: '#b1b1b7', strokeWidth: 2 } }));
            return { nodes: allNodes, edges: allEdges };
        }

        const connectedNodeIds = new Set([highlightId]);
        const edgesToHighlight = new Set();

        edges.forEach(edge => {
            if (edge.source === highlightId || edge.target === highlightId) {
                edgesToHighlight.add(edge.id);
                connectedNodeIds.add(edge.source);
                connectedNodeIds.add(edge.target);
            }
        });

        const finalNodes = nodes.map(node => ({
            ...node,
            style: {
                ...node.style,
                opacity: connectedNodeIds.has(node.id) ? 1 : 0.2,
                transition: 'opacity 0.2s ease-in-out'
            }
        }));

        const finalEdges = edges.map(edge => ({
            ...edge,
            animated: edgesToHighlight.has(edge.id),
            style: {
                ...edge.style,
                stroke: edgesToHighlight.has(edge.id) ? '#2686f0' : '#b1b1b7',
                strokeWidth: edgesToHighlight.has(edge.id) ? 3 : 2,
                opacity: edgesToHighlight.has(edge.id) ? 1 : 0.2,
                transition: 'all 0.2s ease-in-out'
            }
        }));

        return { nodes: finalNodes, edges: finalEdges };

    }, [selectedNodeId, hoveredNodeId, nodes, edges]);

    const activeEdge = useMemo(() => edges.find(e => e.id === activeEdgeId), [edges, activeEdgeId]);

    return (
        <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <button onClick={() => setShowModal(true)} style={{ padding: '10px 20px', margin: '10px', fontSize: '16px', cursor: 'pointer', alignSelf: 'flex-start', zIndex: 10 }}>Добавить Новую Ноду</button>
            <div style={{ flexGrow: 1, position: 'relative' }}>
                <ReactFlow
                    nodes={processedNodes}
                    edges={processedEdges}
                    nodeTypes={nodeTypes}
                    edgeTypes={edgeTypes}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    onEdgeClick={onEdgeClick}
                    onNodeClick={onNodeClick}
                    onNodeMouseEnter={onNodeMouseEnter}
                    onNodeMouseLeave={onNodeMouseLeave}
                    onPaneClick={onPaneClick}
                    defaultEdgeOptions={defaultEdgeOptions}
                    fitView
                >
                    <Controls />
                    <Background variant="dots" gap={12} size={1} />
                </ReactFlow>
            </div>

            {showModal && <Modal title="Введите название новой ноды" onClose={() => setShowModal(false)}>
                <input type="text" placeholder="Название ноды" onBlur={(e) => handleAddNode(e.target.value)} style={{ padding: '6px' }} />
            </Modal>}

            {activeEdge && <Modal title="Кейсы связи" onClose={() => setActiveEdgeId(null)}>
                <EdgeModal edge={activeEdge} onAddCase={handleAddCase} />
            </Modal>}

            {nodeModalOpen && activeNode && (
                <Modal title={activeNode.data.label} onClose={() => setNodeModalOpen(false)}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div>{activeNode.data.description || 'No description available.'}</div>
                        <button
                            onClick={() => navigate(`/docs/${activeNode.id}`)}
                            style={{ padding: '8px 16px', cursor: 'pointer', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', alignSelf: 'flex-end' }}
                        >
                            Подробнее
                        </button>
                    </div>
                </Modal>
            )}
        </div>
    );
}

export default MyGraphEditor;

