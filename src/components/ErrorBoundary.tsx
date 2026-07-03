import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export default class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="panel p-8 max-w-md w-full text-center">
          <p className="text-4xl mb-4" aria-hidden="true">
            💔
          </p>
          <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
          <p className="text-emerald-200/70 mb-6">
            The scorekeeper hit an unexpected error. Reloading usually fixes it — your game is
            saved on this device.
          </p>
          <button onClick={this.handleReload} className="btn-primary py-2 px-6">
            Reload app
          </button>
        </div>
      </div>
    );
  }
}
