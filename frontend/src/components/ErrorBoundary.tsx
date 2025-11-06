import React, { Component, ErrorInfo, ReactNode } from 'react';
import { FaExclamationTriangle, FaRedo } from 'react-icons/fa';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
    window.location.href = '/dashboard';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
        }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '48px',
            maxWidth: '600px',
            width: '100%',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            textAlign: 'center',
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
            }}>
              <FaExclamationTriangle size={40} color="white" />
            </div>

            <h1 style={{
              fontSize: '28px',
              fontWeight: 'bold',
              color: '#1f2937',
              marginBottom: '16px',
            }}>
              Oops! Something went wrong
            </h1>

            <p style={{
              fontSize: '16px',
              color: '#6b7280',
              marginBottom: '32px',
              lineHeight: '1.6',
            }}>
              We're sorry, but something unexpected happened. Don't worry, your data is safe. 
              Please try refreshing the page or going back to the dashboard.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details style={{
                background: '#f3f4f6',
                padding: '16px',
                borderRadius: '8px',
                marginBottom: '24px',
                textAlign: 'left',
                fontSize: '14px',
              }}>
                <summary style={{ cursor: 'pointer', fontWeight: '600', marginBottom: '8px' }}>
                  Error Details (Development Only)
                </summary>
                <pre style={{
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  fontSize: '12px',
                  color: '#ef4444',
                  margin: '8px 0',
                }}>
                  {this.state.error.toString()}
                </pre>
                {this.state.errorInfo && (
                  <pre style={{
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    fontSize: '12px',
                    color: '#6b7280',
                  }}>
                    {this.state.errorInfo.componentStack}
                  </pre>
                )}
              </details>
            )}

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={() => window.location.reload()}
                style={{
                  background: '#e5e7eb',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '16px',
                  color: '#374151',
                }}
              >
                <FaRedo />
                Refresh Page
              </button>

              <button
                onClick={this.handleReset}
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '16px',
                  color: 'white',
                }}
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
