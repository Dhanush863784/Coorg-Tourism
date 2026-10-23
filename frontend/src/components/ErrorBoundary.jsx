import React from 'react';

export default class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary caught:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ maxWidth: '600px', margin: '80px auto', padding: '40px', background: '#fff', borderRadius: '24px', textAlign: 'center', boxShadow: '0 8px 30px rgba(0,0,0,0.06)' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>🌿</div>
                    <h2 style={{ fontSize: '24px', color: '#11281D', fontWeight: '800', marginBottom: '8px' }}>
                        Something took an unexpected turn
                    </h2>
                    <p style={{ color: '#7E9085', fontSize: '14px', marginBottom: '24px' }}>
                        {this.state.error?.message || "Don't worry, you can easily continue exploring Coorg."}
                    </p>
                    <button 
                        onClick={() => { this.setState({ hasError: false }); window.location.href = '/'; }}
                        className="btn-forest"
                        style={{ padding: '12px 28px', borderRadius: '999px' }}
                    >
                        Return to Homepage
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}
