import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGraph } from '../context/GraphContext';
import { createPortal } from 'react-dom';

function Modal({ onClose, children, title }) {
    return createPortal(
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
            <div style={{ background: 'white', padding: '20px', borderRadius: '10px', minWidth: '400px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <h3>{title}</h3>
                {children}
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button onClick={onClose} style={{ padding: '6px 12px', cursor: 'pointer' }}>Close</button>
                </div>
            </div>
        </div>,
        document.body
    );
}

function TestCasesPage() {
    const { edgeId } = useParams();
    const navigate = useNavigate();
    const { edges, nodes, addTestCase } = useGraph();

    const edge = edges.find(e => e.id === edgeId);

    const [searchTerm, setSearchTerm] = useState('');
    const [priorityFilter, setPriorityFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');

    // State for adding new test case
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newCaseTitle, setNewCaseTitle] = useState('');
    const [newCasePriority, setNewCasePriority] = useState('Medium');

    const filteredCases = useMemo(() => {
        if (!edge || !edge.data || !edge.data.history) return [];
        return edge.data.history.filter(c => {
            const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesPriority = priorityFilter === 'All' || c.priority === priorityFilter;
            const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
            return matchesSearch && matchesPriority && matchesStatus;
        });
    }, [edge, searchTerm, priorityFilter, statusFilter]);

    const titleText = useMemo(() => {
        if (!edge) return `Test Cases for Edge ${edgeId}`;
        const sourceNode = nodes.find(n => n.id === edge.source);
        const targetNode = nodes.find(n => n.id === edge.target);
        if (sourceNode && targetNode) {
            return `Test Cases for ${sourceNode.data.label} & ${targetNode.data.label}`;
        }
        return `Test Cases for Edge ${edgeId}`;
    }, [edge, nodes, edgeId]);

    const handleAddTestCase = () => {
        if (newCaseTitle.trim()) {
            addTestCase(edgeId, {
                title: newCaseTitle.trim(),
                priority: newCasePriority,
                tags: [] // Default empty tags
            });
            setNewCaseTitle('');
            setNewCasePriority('Medium');
            setIsModalOpen(false);
        }
    };

    if (!edge) {
        return <div style={{ padding: '20px' }}>Edge not found</div>;
    }

    return (
        <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            minHeight: '100vh',
            backgroundColor: '#ffffff',
            boxSizing: 'border-box',
            padding: '40px',
            fontFamily: 'sans-serif',
            color: '#333'
        }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <button
                    onClick={() => navigate('/')}
                    style={{
                        marginBottom: '20px',
                        padding: '8px 16px',
                        cursor: 'pointer',
                        background: '#f0f0f0',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        color: '#333'
                    }}
                >
                    &larr; Back to Graph
                </button>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>
                    <h1 style={{ margin: 0 }}>{titleText}</h1>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        style={{
                            padding: '10px 20px',
                            cursor: 'pointer',
                            background: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '14px',
                            fontWeight: 'bold'
                        }}
                    >
                        Add Test Case
                    </button>
                </div>

                <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', padding: '15px', background: '#f9f9f9', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', flexGrow: 1 }}>
                        <label style={{ fontSize: '14px', fontWeight: 'bold' }}>Search</label>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            placeholder="Search by title..."
                            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', width: '150px' }}>
                        <label style={{ fontSize: '14px', fontWeight: 'bold' }}>Priority</label>
                        <select
                            value={priorityFilter}
                            onChange={e => setPriorityFilter(e.target.value)}
                            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                        >
                            <option value="All">All</option>
                            <option value="High">High</option>
                            <option value="Medium">Medium</option>
                            <option value="Low">Low</option>
                        </select>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', width: '150px' }}>
                        <label style={{ fontSize: '14px', fontWeight: 'bold' }}>Status</label>
                        <select
                            value={statusFilter}
                            onChange={e => setStatusFilter(e.target.value)}
                            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                        >
                            <option value="All">All</option>
                            <option value="Active">Active</option>
                            <option value="Deprecated">Deprecated</option>
                        </select>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {filteredCases.length > 0 ? filteredCases.map(c => (
                        <div key={c.id} style={{ padding: '15px', border: '1px solid #eee', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                            <div>
                                <div style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '4px' }}>{c.title}</div>
                                <div style={{ fontSize: '12px', color: '#666' }}>
                                    Tags: {c.tags && c.tags.length > 0 ? c.tags.join(', ') : 'None'}
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                <span style={{
                                    padding: '4px 8px',
                                    borderRadius: '4px',
                                    fontSize: '12px',
                                    fontWeight: 'bold',
                                    background: c.priority === 'High' ? '#ffcccc' : c.priority === 'Medium' ? '#fff4cc' : '#ccffcc',
                                    color: c.priority === 'High' ? '#990000' : c.priority === 'Medium' ? '#996600' : '#006600'
                                }}>
                                    {c.priority}
                                </span>
                                <span style={{ fontSize: '12px', color: '#999' }}>{c.status}</span>
                            </div>
                        </div>
                    )) : (
                        <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>No test cases found matching filters.</div>
                    )}
                </div>
            </div>

            {isModalOpen && (
                <Modal title="Add New Test Case" onClose={() => setIsModalOpen(false)}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                            <label style={{ fontWeight: 'bold', fontSize: '14px' }}>Title</label>
                            <input
                                type="text"
                                value={newCaseTitle}
                                onChange={e => setNewCaseTitle(e.target.value)}
                                placeholder="Enter test case title..."
                                style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                            <label style={{ fontWeight: 'bold', fontSize: '14px' }}>Priority</label>
                            <select
                                value={newCasePriority}
                                onChange={e => setNewCasePriority(e.target.value)}
                                style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                            >
                                <option value="High">High</option>
                                <option value="Medium">Medium</option>
                                <option value="Low">Low</option>
                            </select>
                        </div>
                        <button
                            onClick={handleAddTestCase}
                            style={{
                                padding: '10px',
                                background: '#28a745',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                marginTop: '10px'
                            }}
                        >
                            Add Case
                        </button>
                    </div>
                </Modal>
            )}
        </div>
    );
}

export default TestCasesPage;
