import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import "./Modal.css"

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
};

export function Modal({ open, onClose, children }: ModalProps) {
    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        document.addEventListener("keydown", onKey);

        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden"; // pauses the background

        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = prevOverflow;
        }; // cleaner returns previous background
    }, [open, onClose]);


    if (!open) return null;

    return createPortal(
        <div className="modal-backdrop" onMouseDown={onClose}>
            <div className="modal-panel"
                onMouseDown={(e) => e.stopPropagation()} // clicks inside don't close it
            >
            <button className="modal-close" onClick={onClose}>×</button>
                {children}
            </div>
        </div>,
        document.body
    );
}