import React from "react";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-screen w-screen flex-col items-center justify-center bg-slate-50 p-6 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 font-bold text-2xl mb-4">
            S
          </div>
          <h1 className="text-2xl font-bold text-slate-900">SkillSync</h1>
          <p className="mt-2 text-sm text-slate-500 max-w-md">
            Something went wrong while loading the page.
          </p>
          <button
            onClick={() => {
              localStorage.removeItem("skillbridge_token");
              window.location.href = "/login";
            }}
            className="mt-6 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-indigo-700 transition"
          >
            Go to Login
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
export default ErrorBoundary;
