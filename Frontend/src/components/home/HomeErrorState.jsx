const HomeErrorState = ({ onRetry }) => {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-[#f8f9ff] px-4">
      <div className="max-w-md rounded-3xl border border-red-100 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500">
          !
        </div>

        <h2 className="mt-4 text-xl font-bold text-slate-900">Something went wrong</h2>

        <p className="mt-2 text-sm text-slate-500">We couldn't load products right now.</p>

        <button
          onClick={onRetry}
          className="mt-6 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

export default HomeErrorState;
