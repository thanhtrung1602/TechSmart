import { IoClose } from "react-icons/io5";
export default function Modal({ children, open, onClose }: { children: React.ReactNode, open: boolean, onClose: () => void }) {
    return (
        <div
            onClick={onClose}
            className={`
          fixed z-50 inset-0 flex justify-center items-center transition-colors
          ${open ? "visible bg-black/20" : "invisible"}
        `}>
            <div
                onClick={(e) => e.stopPropagation()}
                className={`bg-white p-4 rounded-lg shadow transition-all
            ${open ? "scale-100 opacity-100" : "scale-125 opacity-0"}`}>
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 p-1 rounded-lg">
                    <IoClose className="text-gray-200 bg-white hover:bg-gray-50 hover:text-gray-600" />
                </button>
                {children}
            </div>

        </div>
    );
}