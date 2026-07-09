import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="logo-container" style={{ justifyContent: 'center', marginBottom: '8px', gap: '8px' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
            <rect x="3" y="3" width="7" height="7" rx="2" fill="url(#logo-grad-footer)" fillOpacity="0.15" stroke="url(#logo-grad-footer)" strokeWidth="2.2" />
            <rect x="14" y="3" width="7" height="7" rx="2" fill="url(#logo-grad-footer)" fillOpacity="0.15" stroke="url(#logo-grad-footer)" strokeWidth="2.2" />
            <rect x="3" y="14" width="7" height="7" rx="2" fill="url(#logo-grad-footer)" fillOpacity="0.15" stroke="url(#logo-grad-footer)" strokeWidth="2.2" />
            <rect x="14" y="14" width="7" height="7" rx="2" fill="url(#logo-grad-footer)" stroke="url(#logo-grad-footer)" strokeWidth="2.2" />
            <path d="M16 17.2L17.5 18.7L20 15.5" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            <defs>
              <linearGradient id="logo-grad-footer" x1="3" y1="3" x2="21" y2="21" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#7c3aed" />
                <stop offset="100%" stopColor="#4f46e5" />
              </linearGradient>
            </defs>
          </svg>
          <span style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-heading)', background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.5px' }}>
            Wakti
          </span>
        </div>
        <p style={{ maxWidth: '500px', fontSize: '0.9rem', marginBottom: '16px' }}>
          La plateforme tout-en-un pour réserver vos rendez-vous de santé, beauté, restauration, et bien plus encore, en quelques clics.
        </p>
        <div className="footer-links">
          <Link to="/" className="footer-link">Accueil</Link>
          <Link to="/search" className="footer-link">Rechercher</Link>
          <Link to="/about" className="footer-link">À propos</Link>
          <a href="#" className="footer-link">Mentions légales</a>
          <a href="#" className="footer-link">Contact</a>
        </div>
        <p className="footer-text">
          &copy; {new Date().getFullYear()} Wakti. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
