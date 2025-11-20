import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGraph } from '../context/GraphContext';

function DocumentationPage() {
    const { nodeId } = useParams();
    const navigate = useNavigate();
    const { nodes, updateNodeData } = useGraph();

    const node = nodes.find(n => n.id === nodeId);

    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    useEffect(() => {
        if (node) {
            setTitle(node.data.label || '');
            setContent(node.data.documentation || node.data.description || '');
        }
    }, [node]);

    if (!node) {
        return <div style={{ padding: '40px' }}>Node not found</div>;
    }

    const handleSave = () => {
        updateNodeData(nodeId, { label: title, documentation: content });
        setIsEditing(false);
    };

    const handleCancel = () => {
        setTitle(node.data.label || '');
        setContent(node.data.documentation || node.data.description || '');
        setIsEditing(false);
    };

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
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
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

                {isEditing ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            style={{ fontSize: '24px', fontWeight: 'bold', padding: '8px', width: '100%', boxSizing: 'border-box' }}
                            placeholder="Title"
                        />
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            style={{ minHeight: '300px', padding: '10px', fontSize: '16px', lineHeight: '1.5', width: '100%', resize: 'vertical', boxSizing: 'border-box' }}
                            placeholder="Write your documentation here..."
                        />
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                            <button onClick={handleCancel} style={{ padding: '8px 16px', cursor: 'pointer', background: '#ccc', border: 'none', borderRadius: '4px' }}>Cancel</button>
                            <button onClick={handleSave} style={{ padding: '8px 16px', cursor: 'pointer', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}>Save</button>
                        </div>
                    </div>
                ) : (
                    <div>
                        <div style={{
                            position: 'relative',
                            borderBottom: '1px solid #eee',
                            paddingBottom: '10px',
                            marginBottom: '20px',
                            minHeight: '40px',
                            display: 'flex',
                            alignItems: 'center'
                        }}>
                            <h1 style={{ margin: 0, paddingRight: '100px' }}>{node.data.label}</h1>
                            <button
                                onClick={() => setIsEditing(true)}
                                style={{
                                    position: 'absolute',
                                    right: 0,
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    padding: '8px 16px',
                                    cursor: 'pointer',
                                    background: '#007bff',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px'
                                }}
                            >
                                Edit
                            </button>
                        </div>
                        <div style={{ lineHeight: '1.6', color: '#333', whiteSpace: 'pre-wrap' }}>
                            {node.data.documentation || node.data.description || 'No documentation available.'}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default DocumentationPage;
