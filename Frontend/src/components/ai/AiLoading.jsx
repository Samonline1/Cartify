import { Check, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

const steps = [
    "Understanding your request",
    "Finding relevant products",
    "Filtering results",
    "Preparing your results",
];

const AiLoading = () => {
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentStep((prev) =>
                prev < steps.length - 1 ? prev + 1 : prev
            );
        }, 1200);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="flex min-h-[320px] items-center justify-center px-4">
            <div className="w-full max-w-md">

                {/* Agent header */}
                <div className="mb-6 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                        <Loader2
                            size={23}
                            className="animate-spin"
                        />
                    </div>

                    <h3 className="mt-4 text-base font-bold text-slate-900">
                        Cartify is working on it
                    </h3>

                    <p className="mt-1 text-xs text-slate-400">
                        Finding the best matches for your request
                    </p>
                </div>

                {/* Steps */}
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

                    {steps.map((step, index) => {
                        const completed = index < currentStep;
                        const active = index === currentStep;
                        const upcoming = index > currentStep;

                        return (
                            <div
                                key={step}
                                className="relative flex items-center gap-3"
                            >

                                {/* Connector */}
                                {index < steps.length - 1 && (
                                    <div
                                        className={`
                                            absolute left-[11px] top-7
                                            h-7 w-px
                                            transition-colors duration-500
                                            ${
                                                completed
                                                    ? "bg-blue-500"
                                                    : "bg-slate-200"
                                            }
                                        `}
                                    />
                                )}

                                {/* Status */}
                                <div
                                    className={`
                                        relative z-10 flex h-6 w-6
                                        shrink-0 items-center justify-center
                                        rounded-full
                                        transition-all duration-500
                                        ${
                                            completed
                                                ? "bg-blue-600 text-white"
                                                : active
                                                    ? "bg-blue-100 text-blue-600 ring-4 ring-blue-50"
                                                    : "bg-slate-100 text-slate-300"
                                        }
                                    `}
                                >
                                    {completed ? (
                                        <Check size={13} strokeWidth={3} />
                                    ) : active ? (
                                        <Loader2
                                            size={13}
                                            className="animate-spin"
                                        />
                                    ) : (
                                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                                    )}
                                </div>

                                {/* Text */}
                                <div
                                    className={`
                                        py-2.5 text-sm transition-all duration-500
                                        ${
                                            active
                                                ? "font-semibold text-slate-900"
                                                : completed
                                                    ? "text-slate-500"
                                                    : upcoming
                                                        ? "text-slate-300"
                                                        : ""
                                        }
                                    `}
                                >
                                    {step}

                                    {active && (
                                        <span className="ml-1 inline-flex">
                                            <span className="animate-pulse">...</span>
                                        </span>
                                    )}
                                </div>

                            </div>
                        );
                    })}

                </div>

                {/* Bottom status */}
                <p className="mt-4 text-center text-[11px] text-slate-400">
                    This usually takes just a moment
                </p>

            </div>
        </div>
    );
};

export default AiLoading;