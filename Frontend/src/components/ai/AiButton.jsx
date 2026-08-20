import { Bot, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import AiShoppingModal from "./AiShoppingModal";

const messages = [
    "Compare products",
    "Check reviews",
    "Ask anything",
    "Find products based on your preferences",
];

const AiButton = () => {
    const [open, setOpen] = useState(false);
    const [messageIndex, setMessageIndex] = useState(0);
    const [showMessage, setShowMessage] = useState(true);

    useEffect(() => {
        if (open) return;

        let hideTimer;
        let nextTimer;

        const cycleMessage = () => {
            setShowMessage(true);

            hideTimer = setTimeout(() => {
                setShowMessage(false);

                nextTimer = setTimeout(() => {
                    setMessageIndex((prev) => (prev + 1) % messages.length);
                    cycleMessage();
                }, 5000);
            }, 4500);
        };

        const initialTimer = setTimeout(() => {
            setShowMessage(false);

            nextTimer = setTimeout(() => {
                setMessageIndex((prev) => (prev + 1) % messages.length);
                cycleMessage();
            }, 5000);
        }, 4500);

        return () => {
            clearTimeout(initialTimer);
            clearTimeout(hideTimer);
            clearTimeout(nextTimer);
        };
    }, [open]);

    return (
        <>
            {!open && (
                <div className="fixed bottom-5 right-5 z-50 sm:bottom-6 sm:right-6">

                    {/* Floating capability message */}

                    <div
                        className={`
                            absolute bottom-full right-0 mb-3
                            w-[260px]
                            origin-bottom-right
                            transition-all duration-500 ease-out
                            ${
                                showMessage
                                    ? "translate-y-0 scale-100 opacity-100"
                                    : "pointer-events-none translate-y-2 scale-95 opacity-0"
                            }
                        `}
                    >
                        <div className="relative rounded-2xl border border-blue-100 bg-white p-3.5 shadow-[0_12px_35px_rgba(15,23,42,0.15)]">

                            <div className="flex items-start gap-2.5">

                                {/* Sparkle */}

                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                    <Sparkles
                                        size={17}
                                        className="animate-pulse"
                                    />
                                </div>

                                <div className="min-w-0">
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-blue-500">
                                        AI Shopping
                                    </p>

                                    <p className="mt-0.5 text-sm font-semibold leading-5 text-slate-800">
                                        {messages[messageIndex]}
                                    </p>
                                </div>

                            </div>

                            {/* Small pointer */}

                            <div
                                className="
                                    absolute -bottom-1.5 right-8
                                    h-3 w-3 rotate-45
                                    border-r border-b
                                    border-blue-100
                                    bg-white
                                "
                            />

                        </div>
                    </div>


                    {/* AI Button */}

                    <button
                        type="button"
                        onClick={() => setOpen(true)}
                        className="
                            group relative
                            flex items-center gap-2.5
                            overflow-hidden
                            rounded-full
                            bg-blue-600
                            px-5 py-3
                            text-white
                            shadow-[0_8px_25px_rgba(37,99,235,0.35)]
                            transition-all duration-300
                            hover:scale-105
                            hover:bg-blue-700
                            hover:shadow-[0_12px_35px_rgba(37,99,235,0.45)]
                            active:scale-95
                            sm:px-6 sm:py-3.5
                        "
                        aria-label="Open AI Shopping"
                    >

                        {/* Glow */}

                        <span
                            className="
                                absolute inset-0
                                rounded-full
                                bg-white/10
                                opacity-0
                                transition-opacity duration-300
                                group-hover:opacity-100
                            "
                        />

                        {/* Icon */}

                        <span className="relative flex items-center justify-center">

                            <Sparkles
                                size={25}
                                strokeWidth={2.2}
                                className="
                                    transition-all duration-500
                                    group-hover:rotate-12
                                    group-hover:scale-110
                                "
                            />

                            <span
                                className="
                                    absolute
                                    h-9 w-9
                                    rounded-full
                                    border border-white/30
                                    animate-[ping_2.5s_ease-out_infinite]
                                "
                            />

                        </span>

                        {/* Text */}

                        <span className="relative text-sm font-bold sm:text-base">
                            Cartify Assistant
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