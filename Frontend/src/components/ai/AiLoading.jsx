const messages = [
    "Understanding your request...",
    "Finding relevant products...",
    "Filtering results...",
    "Almost done...",
];

const AiLoading = () => {
    return (
        <div className="flex items-center justify-center py-10">
            <p className="animate-pulse text-sm font-medium text-slate-500">
                AI agent is working...
            </p>
        </div>
    );
};

export default AiLoading;