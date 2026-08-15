const AskSearchResults = ({ data }) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-bold text-slate-900">
        Ask Search Results
      </h2>

      <pre className="mt-4 overflow-auto rounded-xl bg-slate-950 p-4 text-xs text-green-400">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
};

export default AskSearchResults;