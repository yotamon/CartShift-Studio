"use client";

import { Component, ErrorInfo, ReactNode } from "react";
import { logError } from "@/lib/error-handler";
import { Button } from "@/components/ui/Button";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    logError("ErrorBoundary caught an error", error, {
      componentStack: errorInfo.componentStack,
    });
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-slate-50 dark:bg-surface-900">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                Something went wrong
              </h1>
              <p className="text-slate-600 dark:text-surface-300">
                We encountered an unexpected error. Please try refreshing the page.
              </p>
              {process.env.NODE_ENV !== "production" && this.state.error && (
                <details className="mt-4 text-start">
                  <summary className="cursor-pointer text-sm text-slate-500 dark:text-surface-400">
                    Error details
                  </summary>
                  <pre className="mt-2 p-4 bg-slate-100 dark:bg-surface-800 rounded text-xs overflow-auto">
                    {this.state.error.toString()}
                    {this.state.error.stack && `\n\n${this.state.error.stack}`}
                  </pre>
                </details>
              )}
            </div>
            <div className="flex gap-4 justify-center">
              <Button onClick={this.handleReset} variant="primary">
                Try again
              </Button>
              <Button
                onClick={() => window.location.reload()}
                variant="secondary"
              >
                Refresh page
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

