import React, { useEffect } from "react";
import ReactDOM from "react-dom";

type DrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

const Drawer: React.FC<DrawerProps> = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (typeof window === "undefined") return null;

  return isOpen
    ? ReactDOM.createPortal(
        <div className="fixed inset-0 z-50">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={onClose}
          />

          {/* Drawer Panel */}
          <div className="absolute right-0 top-0 h-full w-80 bg-slate-900 shadow-xl p-4 transition-transform transform translate-x-0">
            <button
              className="text-gray-500 hover:text-black absolute top-4 right-4 cursor-pointer"
              onClick={onClose}
            >
              ✕
            </button>
            {children}
          </div>
        </div>,
        document.body
      )
    : null;
};

export default Drawer;
