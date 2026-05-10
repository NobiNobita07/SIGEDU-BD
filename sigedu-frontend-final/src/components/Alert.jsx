import React, { useEffect, useState } from 'react';

const Alert = ({ type, message, onClose, autoClose = 5000 }) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        if (autoClose && onClose) {
            const timer = setTimeout(() => {
                setVisible(false);
                onClose();
            }, autoClose);
            return () => clearTimeout(timer);
        }
    }, [autoClose, onClose]);

    if (!visible) return null;

    const styles = {
        success: 'bg-green-50 border-green-400 text-green-700',
        error: 'bg-red-50 border-red-400 text-red-700',
        warning: 'bg-yellow-50 border-yellow-400 text-yellow-700',
        info: 'bg-blue-50 border-blue-400 text-blue-700'
    };

    const icons = {
        success: '✓',
        error: '✗',
        warning: '⚠',
        info: 'ℹ'
    };

    return (
        <div className={`border-l-4 p-4 mb-4 rounded ${styles[type]}`}>
            <div className="flex">
                <div className="flex-shrink-0">
                    <span className="text-lg">{icons[type]}</span>
                </div>
                <div className="ml-3">
                    <p className="text-sm">{message}</p>
                </div>
                {onClose && (
                    <button onClick={() => { setVisible(false); onClose(); }} className="ml-auto">
                        <span className="text-gray-400 hover:text-gray-600">×</span>
                    </button>
                )}
            </div>
        </div>
    );
};

export default Alert;