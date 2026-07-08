import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Calendar, User, LogOut, Menu, X, Briefcase, UserCheck } from 'lucide-react';

const Header = () => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const getDashboardLink = () => {
    if (user?.role === 'admin') return '/admin-dashboard';
    if (user?.role === 'prestataire') return '/provider-dashboard';
    return '/client-dashboard';
  };

  return (
    <header className="header glass">
      <div className="logo-container" onClick={() => navigate('/')}>
        <div className="logo-icon">W</div>
        <span>Wakti</span>
      </div>

      {/* Desktop Navigation */}
      <nav className="nav-links" style={{ display: 'none' }}>
        {/* We use inline styles or classes depending on media query */}
      </nav>

      <style>{`
        @media (min-width: 769px) {
          .nav-links-desktop {
            display: flex !important;
            align-items: center;
            gap: 28px;
          }
          .mobile-menu-btn {
            display: none !important;
          }
        }
        @media (max-width: 768px) {
          .nav-links-desktop {
            display: none !important;
          }
          .mobile-menu-btn {
            display: flex !important;
          }
        }
        .header {
          transition: background-color 0.3s;
        }
      `}</style>

      <div className="nav-links-desktop" style={{ display: 'none' }}>
        <NavLink to="/" className={({ active }) => `nav-link ${active ? 'active' : ''}`} end>
          Accueil
        </NavLink>
        <NavLink to="/search" className={({ active }) => `nav-link ${active ? 'active' : ''}`}>
          Rechercher
        </NavLink>
        {user && (
          <NavLink to={getDashboardLink()} className={({ active }) => `nav-link ${active ? 'active' : ''}`}>
            Mon Espace
          </NavLink>
        )}
      </div>

      <div className="auth-buttons nav-links-desktop" style={{ display: 'none' }}>
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Bonjour, <strong style={{ color: 'var(--text-main)' }}>{user.nom}</strong> 
              <span style={{ marginLeft: '6px', fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', textTransform: 'capitalize' }}>
                {user.role}
              </span>
            </span>
            <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '8px 16px', gap: '6px' }}>
              <LogOut size={16} />
              Déconnexion
            </button>
          </div>
        ) : (
          <>
            <Link to="/login" className="nav-link">
              Se connecter
            </Link>
            <Link to="/register" className="btn btn-primary" style={{ padding: '8px 20px' }}>
              S'inscrire
            </Link>
          </>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button 
        className="btn-icon mobile-menu-btn" 
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        style={{ border: 'none', background: 'transparent' }}
      >
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="glass animate-fade-in" style={{
          position: 'fixed',
          top: '70px',
          left: 0,
          right: 0,
          display: 'flex',
          flexDirection: 'column',
          padding: '24px',
          gap: '20px',
          borderBottom: '1px solid var(--border)',
          zIndex: 999,
          boxShadow: 'var(--shadow-lg)'
        }}>
          <Link to="/" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Accueil</Link>
          <Link to="/search" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Rechercher</Link>
          {user ? (
            <>
              <Link to={getDashboardLink()} className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                Mon Espace ({user.nom})
              </Link>
              <button onClick={handleLogout} className="btn btn-danger" style={{ width: '100%', justifyContent: 'center' }}>
                <LogOut size={18} />
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary" style={{ justifyContent: 'center' }} onClick={() => setMobileMenuOpen(false)}>
                Se connecter
              </Link>
              <Link to="/register" className="btn btn-primary" style={{ justifyContent: 'center' }} onClick={() => setMobileMenuOpen(false)}>
                S'inscrire
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
