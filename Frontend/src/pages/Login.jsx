import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, ShieldAlert, LogIn } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [mdp, setMdp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !mdp) {
      setError('Veuillez remplir tous les champs.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const user = await login(email, mdp);
      const redirectUrl = searchParams.get('redirect');
      if (redirectUrl) {
        navigate(decodeURIComponent(redirectUrl));
      } else {
        // Default dashboard routing
        if (user.role === 'admin') {
          navigate('/admin-dashboard');
        } else if (user.role === 'prestataire') {
          navigate('/provider-dashboard');
        } else {
          navigate('/client-dashboard');
        }
      }
    } catch (err) {
      setError(err.message || 'Email ou mot de passe incorrect.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 200px)', padding: '20px' }}>
      <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '440px', padding: '36px', boxShadow: 'var(--shadow-lg)' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div className="logo-container" style={{ justifyContent: 'center', marginBottom: '16px', gap: '8px' }}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
              <path d="M6 10C6 8.89543 6.89543 8 8 8H24C25.1046 8 26 8.89543 26 10V13C24.5 13 24.5 15 26 15V17C24.5 17 24.5 19 26 19V22C26 23.1046 25.1046 24 24 24H8C6.89543 24 6 23.1046 6 22V19C7.5 19 7.5 17 6 17V15C7.5 15 7.5 13 6 13V10Z" fill="url(#logo-grad-login-bg)" stroke="url(#logo-grad-login)" strokeWidth="2"/>
              <path d="M15 9V23" stroke="url(#logo-grad-login)" strokeWidth="1.5" stroke-dasharray="3 3" opacity="0.6"/>
              <path d="M10 13.5L10.9 14.8L12.4 15.0L11.3 15.9L11.7 17.3L10 16.5L8.3 17.3L8.7 15.9L7.6 15.0L9.1 14.8L10 13.5Z" fill="#7c3aed"/>
              <path d="M18 16L20 18L23 14" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <defs>
                <linearGradient id="logo-grad-login" x1="6" y1="8" x2="26" y2="24" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#7c3aed" />
                  <stop offset="100%" stopColor="#4f46e5" />
                </linearGradient>
                <linearGradient id="logo-grad-login-bg" x1="6" y1="8" x2="26" y2="24" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="rgba(124, 58, 237, 0.12)" />
                  <stop offset="100%" stopColor="rgba(79, 70, 229, 0.12)" />
                </linearGradient>
              </defs>
            </svg>
            <span style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-heading)', background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.5px' }}>
              Wakti
            </span>
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Ravis de vous revoir</h2>
          <p style={{ fontSize: '0.9rem', marginTop: '6px' }}>Connectez-vous pour gérer vos réservations</p>
        </div>

        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', borderRadius: '8px', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '20px' }}>
            <ShieldAlert size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Email input */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Adresse email</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="email"
                className="form-input"
                placeholder="nom@exemple.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: '48px' }}
                required
              />
            </div>
          </div>

          {/* Password input */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Mot de passe</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={mdp}
                onChange={(e) => setMdp(e.target.value)}
                style={{ paddingLeft: '48px' }}
                required
              />
            </div>
          </div>

          {/* Remember me and Forgot password mock */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <input type="checkbox" style={{ accentColor: 'var(--primary)' }} />
              Se souvenir de moi
            </label>
            <a href="#" style={{ color: 'var(--primary)', fontWeight: 600 }}>Mot de passe oublié ?</a>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '12px', justifyContent: 'center', fontSize: '1rem', marginTop: '8px' }}
          >
            {loading ? 'Connexion en cours...' : (
              <>
                <LogIn size={18} />
                Se connecter
              </>
            )}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '28px', borderTop: '1px solid var(--border)', paddingTop: '20px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Vous n'avez pas de compte ?{' '}
          <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 700 }}>
            S'inscrire gratuitement
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
