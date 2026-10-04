import React, { Component, ErrorInfo, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Prevent uncaught runtime crashes from unhandled promise rejections
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    console.warn('Prevented unhandled promise rejection:', event.reason);
    event.preventDefault();
  });

  window.addEventListener('error', (event) => {
    // Suppress third-party / browser extension errors from breaking the page
    if (event.message?.includes('ResizeObserver') || event.message?.includes('Script error')) {
      event.preventDefault();
    }
  });
}

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

class RootErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, errorMessage: error?.message || 'Unexpected application state' };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Captured in RootErrorBoundary:', error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, errorMessage: '' });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-6">
          <div className="max-w-md w-full rounded-2xl bg-slate-800 border border-slate-700 p-6 shadow-2xl text-center space-y-4">
            <div className="h-12 w-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto text-xl font-bold">
              !
            </div>
            <h2 className="text-lg font-bold text-white">System Recovered from Error</h2>
            <p className="text-xs text-slate-400">
              The application encountered a runtime issue and prevented a crash: {this.state.errorMessage}
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                Reload Application
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <RootErrorBoundary>
    <App />
  </RootErrorBoundary>
);
