import { Search, Star, GitCompare } from "lucide-react";

const options = [
    {
        id: "ask",
        label: "Ask Search",
        description: "Find products using natural language",
        icon: Search,
    },
    {
        id: "rating",
        label: "Rating",
        description: "Find highly rated products",
        icon: Star,
    },
    {
        id: "compare",
        label: "Compare",
        description: "Compare products",
        icon: GitCompare,
    },
];

const SearchTypeSelector = ({ selected, onSelect }) => {
    return (
        <div className="absolute bottom-full left-0 mb-3 w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl">
            {options.map((option) => {
                const Icon = option.icon;
                const active = selected === option.id;

                return (
                    <button
                        key={option.id}
                        type="button"
                        onClick={() => onSelect(option.id)}
                        className={`flex w-full items-start gap-3 rounded-xl p-3 text-left transition ${active
                                ? "bg-blue-50 text-blue-700"
                                : "text-slate-700 hover:bg-slate-50"
                            }`}
                    >
                        <div
                            className={`mt-0.5 rounded-lg p-2 ${active
                                    ? "bg-blue-600 text-white"
                                    : "bg-slate-100 text-slate-600"
                                }`}
                        >
                            <Icon size={16} />
                        </div>

                        <div>
                            <p className="text-sm font-bold">
                                {option.label}
                            </p>

                            <p className="mt-0.5 text-xs text-slate-500">
                                {option.description}
                            </p>
                        </div>
                    </button>
                );
            })}
        </div>
    );
};

export default SearchTypeSelector;