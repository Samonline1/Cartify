const HomeSkeleton = () => {
  return (
    <div className="min-h-screen bg-[#f8f9ff]">
      <div className="h-[300px] animate-pulse bg-slate-200 sm:h-[400px]" />

      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8 flex gap-4 overflow-hidden">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="h-28 min-w-28 animate-pulse rounded-full bg-slate-200" />
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
            <div key={item} className="h-72 animate-pulse rounded-2xl bg-slate-200" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeSkeleton;
