import { Link } from "react-router-dom";
const NotFound = () => {
    return (
        <div className="flex min-h-[70vh] items-center justify-center px-6">
            <div className="text-center">

                <p className="text-sm font-black tracking-widest text-blue-500">
                    CARTIFY
                </p>

                <h1 className="mt-2 text-7xl font-black text-slate-900">
                    404
                </h1>

                <h2 className="mt-3 text-xl font-bold text-slate-800">
                    Page not found
                </h2>

                <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500">
                    The page you're looking for doesn't exist or may have been moved.
                </p>

                <Link
                    to="/"
                    className="mt-6 inline-flex rounded-xl bg-blue-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-600"
                >
                    Back to Home
                </Link>

            </div>
        </div>
    );
};


export default NotFound;
