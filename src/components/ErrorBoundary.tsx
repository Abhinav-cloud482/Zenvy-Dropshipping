import React, { ErrorInfo, ReactNode } from 'react';
import { Button } from './ui/button';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      let errorMessage = "An unexpected error occurred.";
      let isPermissionError = false;

      try {
        if (this.state.error?.message) {
          const parsed = JSON.parse(this.state.error.message);
          if (parsed.error && parsed.error.includes('insufficient permissions')) {
            errorMessage = "You don't have permission to perform this action. Please make sure you are logged in with the correct account.";
            isPermissionError = true;
          }
        }
      } catch (e) {
        // Not a JSON error
        if (this.state.error?.message.includes('insufficient permissions')) {
          errorMessage = "Permission denied. Please check your access rights.";
          isPermissionError = true;
        }
      }

      return (
        <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-6 text-white">
          <div className="max-w-md w-full bg-[#161616] border border-[#333333] p-8 rounded-2xl text-center shadow-2xl">
            <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle size={32} />
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tighter mb-4">
              {isPermissionError ? "Access Denied" : "Something went wrong"}
            </h2>
            <p className="text-[#A0A0A0] text-sm mb-8 leading-relaxed">
              {errorMessage}
            </p>
            <div className="space-y-3">
              <Button 
                onClick={this.handleReset}
                className="w-full bg-[#F27D26] hover:bg-[#d96a1a] text-black font-black uppercase tracking-widest py-6"
              >
                Return Home
              </Button>
              <Button 
                variant="outline"
                onClick={() => window.location.reload()}
                className="w-full border-[#333333] hover:bg-[#222222] text-white font-black uppercase tracking-widest py-6"
              >
                Try Again
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
