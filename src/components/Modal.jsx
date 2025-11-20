import React from 'react';
import { createPortal } from 'react-dom';

export function Modal({ onClose, children, title }) {
    return createPortal(
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
            <div style={{ background: 'white', padding: '20px', borderRadius: '10px', minWidth: '400px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <h3>{title}</h3>
                {children}
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button onClick={onClose}>Закрыть</button>
                </div>
            </div>
        </div>,
        document.body
    );
}
