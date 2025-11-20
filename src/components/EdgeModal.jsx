import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function EdgeModal({ edge, onAddCase }) {
    const [newCaseTitle, setNewCaseTitle] = useState('');
    const [priority, setPriority] = useState('Medium');
    const navigate = useNavigate();

    const handleAdd = () => {
        if (newCaseTitle.trim()) {
            onAddCase(edge.id, { title: newCaseTitle.trim(), priority, tags: [] });
            setNewCaseTitle('');
        }
    };

    const sortedCases = [...(edge.data.history || [])].sort((a, b) => {
        const priorities = { High: 3, Medium: 2, Low: 1 };
        return priorities[b.priority] - priorities[a.priority];
    });

    const topCases = sortedCases.slice(0, 3);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #ccc', padding: '6px', borderRadius: '6px' }}>
                {topCases.length > 0 ? topCases.map((c) => (
                    <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0' }}>
                        <span>{c.title}</span>
                        <span style={{ fontSize: '12px', padding: '2px 6px', borderRadius: '4px', background: c.priority === 'High' ? '#ffcccc' : c.priority === 'Medium' ? '#fff4cc' : '#ccffcc' }}>
                            {c.priority}
                        </span>
                    </div>
                )) : <div>Нет кейсов</div>}
            </div>
            <button onClick={() => navigate(`/edge/${edge.id}/cases`)} style={{ fontSize: '12px', color: 'blue', background: 'none', border: 'none', cursor: 'pointer', alignSelf: 'flex-start' }}>
                Показать все ({edge.data.history ? edge.data.history.length : 0})
            </button>
            <div style={{ display: 'flex', gap: '5px' }}>
                <input type="text" value={newCaseTitle} onChange={e => setNewCaseTitle(e.target.value)} placeholder="Новый кейс" style={{ flexGrow: 1, padding: '6px' }} />
                <select value={priority} onChange={e => setPriority(e.target.value)} style={{ padding: '6px' }}>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                </select>
            </div>
            <button onClick={handleAdd}>Добавить кейс</button>
        </div>
    );
}
