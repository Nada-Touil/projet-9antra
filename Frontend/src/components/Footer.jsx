import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="logo-container" style={{ justifyContent: 'center', marginBottom: '8px', gap: '8px' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
            <path d="M12 21C16 16.5 19 13 19 9C19 5.13401 15.866 2 12 2C8.13401 2 5 5.13401 5 9C5 13 8 16.5 12 21Z" stroke="url(#logo-grad-footer)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9 9L11 11L15 7" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <defs>
              <linearGradient id="logo-grad-footer" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
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
