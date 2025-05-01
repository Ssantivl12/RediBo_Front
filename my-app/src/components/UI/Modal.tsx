// src/components/UI/Modal.tsx
import { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose}></div>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-6 shadow-lg relative max-w-lg w-full">
          <button
            className="absolute top-3 right-3 bg-red-500 text-white rounded-full px-2 py-1 text-sm"
            onClick={onClose}
          >
            ✕
          </button>
          {children}
        </div>
      </div>
    </>
  );
}
