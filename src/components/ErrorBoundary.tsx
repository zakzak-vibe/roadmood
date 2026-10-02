import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#fff8f5] flex items-center justify-center p-6 font-sans">
          <div className="max-w-md w-full bg-white rounded-3xl p-6 shadow-xl border border-[#ffd8d4] text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#ffdad7] flex items-center justify-center text-3xl">
              ⚠️
            </div>
            <h1 className="text-xl font-black text-[#211a15] mb-2">Road Moods Encountered an Issue</h1>
            <p className="text-sm text-[#5f524a] mb-4">
              We recovered gracefully from a display error:
            </p>
            <div className="bg-[#f5ece6] p-3 rounded-xl text-left text-xs font-mono text-[#ba1a1a] mb-5 overflow-x-auto max-h-32">
              {this.state.error?.message || 'Unknown runtime error'}
            </div>
            <button
              onClick={this.handleReset}
              className="w-full py-3 px-5 rounded-2xl bg-[#006c49] text-white font-extrabold text-sm shadow-md hover:bg-[#005237] transition-colors cursor-pointer"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
