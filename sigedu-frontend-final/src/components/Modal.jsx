import React from 'react';

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={onClose} />

            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden ring-1 ring-slate-200">
                <div className="flex items-center justify-between px-7 py-5 border-b bg-slate-50">
                    <div>
                        <h2 className="text-xl font-black text-slate-900">{title}</h2>
                        <p className="text-sm text-slate-500">Complete la información solicitada</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-2xl bg-white hover:bg-red-50 hover:text-red-600 text-slate-500 shadow-sm border transition text-xl font-bold"
                    >
                        ×
                    </button>
                </div>

                <div className="p-7 overflow-y-auto max-h-[75vh]">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
