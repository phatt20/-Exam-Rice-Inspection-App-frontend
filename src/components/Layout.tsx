import { Link } from 'react-router-dom';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', fontFamily: 'Arial, sans-serif', backgroundColor: '#f9f9f9' }}>
      <header
        style={{
          padding: '1rem 2rem',
          borderBottom: '1px solid #e0e0e0',
          backgroundColor: '#ffffff',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          display: 'flex',
          justifyContent: 'center',
          gap: '1rem',
        }}
      >
        <Link
          to="/"
          style={{
            textDecoration: 'none',
            color: '#4a90e2',
            fontWeight: 600,
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#e6f0ff')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          Create Inspection
        </Link>
        <Link
          to="/history"
          style={{
            textDecoration: 'none',
            color: '#4a90e2',
            fontWeight: 600,
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#e6f0ff')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          History
        </Link>
      </header>
      <main
        style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          padding: '2rem',
        }}
      >
        {children}
      </main>
    </div>
  );
};

export default Layout;
