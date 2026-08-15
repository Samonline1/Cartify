import { Bot } from "lucide-react";
import { useState } from "react";
import AiShoppingModal from "./AiShoppingModal";

const AiButton = () => {
    const [open, setOpen] = useState(false);

    return (
        <>
            {!open && (
                <div className="fixed bottom-5 right-5 z-50 sm:bottom-6 sm:right-6">
                    <button
                        onClick={() => setOpen(true)}
                        className="
              flex items-center gap-2.5
              rounded-full
              bg-blue-600
              px-5 py-3
              text-white
              shadow-xl
              transition-all duration-200
              hover:scale-105
              hover:bg-blue-700
              hover:shadow-2xl
              active:scale-95
              sm:px-6 sm:py-3.5
            "
                        aria-label="Open AI Shopping"
                    >
                        <Bot size={22} />

                        <span className="text-sm font-bold sm:text-base">
                            AI Shopping
                        </span>
                    </button>
                </div>
            )}

            <AiShoppingModal
                open={open}
                onClose={() => setOpen(false)}
            />
        </>
    );
};

export default AiButton;