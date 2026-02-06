import React from 'react';

const StudentDashboard = () => {
    return (
        <div style={{ padding: '5rem', textAlign: 'center', background: '#f0f0f0', minHeight: '100vh' }}>
            <h1 style={{ color: '#8B0000' }}>DEBUG MODE: Student Dashboard</h1>
            <p>If you can see this message, the routing and basic rendering are working.</p>
            <div style={{ marginTop: '2rem', padding: '2rem', background: 'white', borderRadius: '1rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                <h3>Diagnostic Information:</h3>
                <p>Check the console for any API errors.</p>
                <button onClick={() => window.location.reload()} style={{ padding: '0.5rem 1rem', background: '#8B0000', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer' }}>
                    Reload Page
                </button>
            </div>
        </div>
    );
};

export default StudentDashboard;
