import { Bot, Sparkles } from "lucide-react";
import { useState } from "react";

const AiButton = () => {
  const [showComingSoon, setShowComingSoon] = useState(false);

  const handleClick = () => {
    setShowComingSoon(true);

    setTimeout(() => {
      setShowComingSoon(false);
    }, 2500);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 sm:bottom-6 sm:right-6">
      {showComingSoon && (
        <div className="absolute bottom-full right-0 mb-3 w-52 rounded-2xl bg-white p-4 text-center shadow-xl ring-1 ring-slate-100">
          <div className="mb-1 flex items-center justify-center gap-1.5 font-bold text-slate-800">
            <Sparkles size={16} className="text-blue-600" />
            AI Shopping
          </div>

          <p className="text-xs text-slate-500">
            Coming soon! We're building something smart for your shopping.
          </p>
        </div>
      )}

      <button
        onClick={handleClick}
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
        aria-label="AI Shopping"
      >
        <Bot size={22} />

        <span className="text-sm font-bold sm:text-base">
          AI Shopping
        </span>
      </button>
    </div>
  );
};

export default AiButton;