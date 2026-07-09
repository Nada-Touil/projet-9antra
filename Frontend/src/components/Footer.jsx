import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="logo-container" style={{ justifyContent: 'center', marginBottom: '8px', gap: '8px' }}>
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
            <path d="M6 10C6 8.89543 6.89543 8 8 8H24C25.1046 8 26 8.89543 26 10V13C24.5 13 24.5 15 26 15V17C24.5 17 24.5 19 26 19V22C26 23.1046 25.1046 24 24 24H8C6.89543 24 6 23.1046 6 22V19C7.5 19 7.5 17 6 17V15C7.5 15 7.5 13 6 13V10Z" fill="url(#logo-grad-footer-bg)" stroke="url(#logo-grad-footer)" strokeWidth="2"/>
            <path d="M15 9V23" stroke="url(#logo-grad-footer)" strokeWidth="1.5" stroke-dasharray="3 3" opacity="0.6"/>
            <path d="M10 13.5L10.9 14.8L12.4 15.0L11.3 15.9L11.7 17.3L10 16.5L8.3 17.3L8.7 15.9L7.6 15.0L9.1 14.8L10 13.5Z" fill="#7c3aed"/>
            <path d="M18 16L20 18L23 14" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <defs>
              <linearGradient id="logo-grad-footer" x1="6" y1="8" x2="26" y2="24" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#7c3aed" />
                <stop offset="100%" stopColor="#4f46e5" />
              </linearGradient>
              <linearGradient id="logo-grad-footer-bg" x1="6" y1="8" x2="26" y2="24" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="rgba(124, 58, 237, 0.12)" />
                <stop offset="100%" stopColor="rgba(79, 70, 229, 0.12)" />
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
