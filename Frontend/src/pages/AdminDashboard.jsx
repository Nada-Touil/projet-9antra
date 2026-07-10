import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Calendar, 
  Award, 
  MessageSquare, 
  ShieldCheck, 
  UserX, 
  CheckCircle, 
  BarChart3, 
  Grid, 
  Heart, 
  Utensils, 
  Hotel, 
  HelpCircle,
  TrendingUp,
  LayoutDashboard
} from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    users: 0,
    reservations: 0,
    services: 0,
    avis: 0,
    pendingPrestataires: 0,
    reservationsParCategorie: {
      sante: 0,
      beaute: 0,
      restaurant: 0,
      hotel: 0,
      autre: 0
    }
  });
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  const fetchAdminData = async () => {
    try {
      // 1. Fetch dashboard stats
      const statsResponse = await fetch('/admin/dashboard');
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData.stats);
      }

      // 2. Fetch all users to display & manage
      const usersResponse = await fetch('/users');
      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        setUsersList(usersData.users || []);
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
      setError('Impossible de se connecter au serveur backend.');
      // Mock fallback data for demonstration
      setStats({
        users: 9,
        reservations: 12,
        services: 13,
        avis: 4,
        pendingPrestataires: 1,
        reservationsParCategorie: {
          sante: 4,
          beaute: 3,
          restaurant: 3,
          hotel: 2,
          autre: 0
        }
      });
      setUsersList([
        { _id: 'prest-salma', nom: 'Dr. Salma Touil', email: 'salma@wakti.tn', role: 'prestataire', categorie: 'medecin', statutPrestataire: 'valide', isBlocked: false },
        { _id: 'prest-amel', nom: 'Restaurant El Amel', email: 'amel@wakti.tn', role: 'prestataire', categorie: 'restaurant', statutPrestataire: 'valide', isBlocked: false },
        { _id: 'prest-mouradi', nom: 'El Mouradi Palm Marina', email: 'mouradi@wakti.tn', role: 'prestataire', categorie: 'hotel', statutPrestataire: 'en_attente', isBlocked: false },
        { _id: 'client-nour', nom: 'Nour Ben Ali', email: 'nour@client.tn', role: 'client', isBlocked: false },
        { _id: 'client-yassine', nom: 'Yassine Kefi', email: 'yassine@client.tn', role: 'client', isBlocked: true }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user || user.email !== 'nadaatouil00@gmail.com') {
      navigate('/');
    } else {
      fetchAdminData();
    }
  }, [user, navigate]);

  const handleValidatePrestataire = async (providerId) => {
    setActionSuccess('');
    setError('');
    try {
      const response = await fetch(`/admin/prestataires/${providerId}/valider`, {
        method: 'POST'
      });
      if (response.ok) {
        setActionSuccess('Le prestataire a été validé avec succès !');
        fetchAdminData();
      } else {
        const data = await response.json();
        throw new Error(data.error || 'Erreur lors de la validation');
      }
    } catch (err) {
      // Local fallback
      setUsersList(prev => prev.map(u => u._id === providerId ? { ...u, statutPrestataire: 'valide' } : u));
      setActionSuccess('Prestataire validé (simulation hors-ligne).');
      setStats(prev => ({ 
        ...prev, 
        pendingPrestataires: Math.max(0, prev.pendingPrestataires - 1) 
      }));
    }
  };

  const handleBlockUser = async (targetUserId) => {
    setActionSuccess('');
    setError('');
    try {
      const response = await fetch(`/admin/utilisateurs/${targetUserId}/bloquer`, {
        method: 'POST'
      });
      if (response.ok) {
        setActionSuccess('L’utilisateur a été bloqué avec succès !');
        fetchAdminData();
      } else {
        const data = await response.json();
        throw new Error(data.error || 'Erreur lors du blocage');
      }
    } catch (err) {
      // Local fallback
      setUsersList(prev => prev.map(u => u._id === targetUserId ? { ...u, isBlocked: true } : u));
      setActionSuccess('Utilisateur bloqué (simulation hors-ligne).');
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '80px' }}>
        <div style={{ display: 'inline-block', width: '40px', height: '40px', border: '4px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <p style={{ marginTop: '16px' }}>Chargement du panneau d'administration...</p>
      </div>
    );
  }

  const prestataires = usersList.filter(u => u.role === 'prestataire');
  const clients = usersList.filter(u => u.role === 'client');

  // Category Configuration for beautiful rendering
  const categoryConfigs = {
    sante: { label: 'Santé / Médecine', color: 'rgb(37, 99, 235)', bg: 'rgba(59, 130, 246, 0.1)', icon: Heart },
    beaute: { label: 'Esthétique / Beauté', color: 'rgb(219, 39, 119)', bg: 'rgba(236, 72, 153, 0.1)', icon: Award },
    restaurant: { label: 'Restauration / Restaurant', color: 'rgb(5, 150, 105)', bg: 'rgba(16, 185, 129, 0.1)', icon: Utensils },
    hotel: { label: 'Hébergement / Hôtel', color: 'rgb(217, 119, 6)', bg: 'rgba(245, 158, 11, 0.1)', icon: Hotel },
    autre: { label: 'Autres Services', color: 'rgb(107, 114, 128)', bg: 'rgba(156, 163, 175, 0.1)', icon: HelpCircle }
  };

  const reservationsParCategorie = stats.reservationsParCategorie || {
    sante: 0,
    beaute: 0,
    restaurant: 0,
    hotel: 0,
    autre: 0
  };

  const totalCategoryReservations = Object.values(reservationsParCategorie).reduce((a, b) => a + b, 0) || stats.reservations || 1;

  return (
    <div className="container animate-fade-in" style={{ textAlign: 'left' }}>
      <style>{`
        .admin-layout {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 32px;
          margin-top: 24px;
        }
        .admin-sidebar {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .sidebar-btn {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 14px 18px;
          border: none;
          background: transparent;
          border-radius: var(--radius-md);
          color: var(--text-muted);
          font-weight: 600;
          font-size: 0.95rem;
          text-align: left;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .sidebar-btn:hover {
          background-color: var(--surface);
          color: var(--text);
        }
        .sidebar-btn.active {
          background: linear-gradient(135deg, rgba(124, 58, 237, 0.1), rgba(79, 70, 229, 0.1));
          color: var(--primary);
          box-shadow: inset 0 0 0 1px rgba(124, 58, 237, 0.2);
        }
        .admin-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 12px;
        }
        .admin-table th, .admin-table td {
          padding: 14px 16px;
          text-align: left;
          border-bottom: 1px solid var(--border);
        }
        .admin-table th {
          font-weight: 700;
          background-color: var(--bg);
          font-size: 0.8rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .admin-table td {
          font-size: 0.9rem;
        }
        @media (max-width: 900px) {
          .admin-layout {
            grid-template-columns: 1fr !important;
            gap: 20px;
          }
          .admin-sidebar {
            flex-direction: row !important;
            overflow-x: auto;
            padding-bottom: 8px;
            border-bottom: 1px solid var(--border);
          }
          .sidebar-btn {
            white-space: nowrap;
            width: auto;
          }
        }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '20px' }}>
        <h1 style={{ fontSize: '2.25rem', marginBottom: '6px', fontWeight: 800 }}>Espace Administration</h1>
        <p style={{ color: 'var(--text-muted)' }}>Supervisez l'écosystème Wakti, analysez les performances et validez les comptes prestataires.</p>
      </div>

      {actionSuccess && <div style={{ padding: '12px 16px', borderRadius: '8px', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', fontSize: '0.9rem', fontWeight: 600, marginBottom: '24px' }}>{actionSuccess}</div>}
      {error && <div style={{ padding: '12px 16px', borderRadius: '8px', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', fontSize: '0.9rem', fontWeight: 600, marginBottom: '24px' }}>{error}</div>}

      <div className="admin-layout">
        
        {/* Sidebar Menu */}
        <aside className="admin-sidebar">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`sidebar-btn ${activeTab === 'overview' ? 'active' : ''}`}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <LayoutDashboard size={18} />
              Vue d'ensemble
            </div>
          </button>

          <button 
            onClick={() => setActiveTab('prestataires')}
            className={`sidebar-btn ${activeTab === 'prestataires' ? 'active' : ''}`}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <ShieldCheck size={18} />
              Validation Pros
            </div>
            {stats.pendingPrestataires > 0 && (
              <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '12px', backgroundColor: 'var(--danger)', color: '#fff', fontWeight: 700 }}>
                {stats.pendingPrestataires}
              </span>
            )}
          </button>

          <button 
            onClick={() => setActiveTab('clients')}
            className={`sidebar-btn ${activeTab === 'clients' ? 'active' : ''}`}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Users size={18} />
              Gestion Clients
            </div>
          </button>

          <button 
            onClick={() => setActiveTab('stats-categories')}
            className={`sidebar-btn ${activeTab === 'stats-categories' ? 'active' : ''}`}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <BarChart3 size={18} />
              Stats par Catégorie
            </div>
          </button>
        </aside>

        {/* Main Content Pane */}
        <main className="admin-content-pane">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="animate-fade-in">
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '20px' }}>Indicateurs clés de performance</h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
                
                <div className="card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ padding: '12px', borderRadius: '12px', backgroundColor: 'rgba(59, 130, 246, 0.1)', color: 'rgb(37, 99, 235)' }}>
                    <Users size={24} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block' }}>Utilisateurs</span>
                    <span style={{ fontSize: '1.75rem', fontWeight: 800 }}>{stats.users}</span>
                  </div>
                </div>

                <div className="card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ padding: '12px', borderRadius: '12px', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'rgb(5, 150, 105)' }}>
                    <Calendar size={24} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block' }}>Réservations</span>
                    <span style={{ fontSize: '1.75rem', fontWeight: 800 }}>{stats.reservations}</span>
                  </div>
                </div>

                <div className="card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ padding: '12px', borderRadius: '12px', backgroundColor: 'rgba(245, 158, 11, 0.1)', color: 'rgb(217, 119, 6)' }}>
                    <Award size={24} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block' }}>Prestations</span>
                    <span style={{ fontSize: '1.75rem', fontWeight: 800 }}>{stats.services}</span>
                  </div>
                </div>

                <div className="card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ padding: '12px', borderRadius: '12px', backgroundColor: 'rgba(236, 72, 153, 0.1)', color: 'rgb(219, 39, 119)' }}>
                    <MessageSquare size={24} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block' }}>Avis Clients</span>
                    <span style={{ fontSize: '1.75rem', fontWeight: 800 }}>{stats.avis}</span>
                  </div>
                </div>

              </div>

              {/* Quick Info Alert Card */}
              <div className="card" style={{ padding: '24px', background: 'linear-gradient(135deg, var(--surface), var(--bg))', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '4px' }}>Demandes de validation en attente</h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Il y a actuellement {stats.pendingPrestataires} prestataire(s) en attente de vérification.</p>
                </div>
                <button 
                  onClick={() => setActiveTab('prestataires')} 
                  className="btn btn-primary"
                  style={{ padding: '10px 20px', fontSize: '0.9rem' }}
                >
                  Voir les demandes
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: PRESTATAIRES VALIDATION */}
          {activeTab === 'prestataires' && (
            <div className="card animate-fade-in" style={{ padding: '32px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={20} style={{ color: 'var(--primary)' }} />
                Validation et Gestion des Prestataires ({prestataires.length})
              </h2>

              <div style={{ overflowX: 'auto' }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Nom Complet</th>
                      <th>Catégorie</th>
                      <th>Email</th>
                      <th>Statut</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {prestataires.map(p => (
                      <tr key={p._id || p.id}>
                        <td><strong>{p.nom}</strong></td>
                        <td style={{ textTransform: 'capitalize' }}>{p.categorie || 'Service'}</td>
                        <td>{p.email}</td>
                        <td>
                          {p.statutPrestataire === 'valide' || p.isValidatedPrestataire ? (
                            <span style={{ padding: '4px 8px', borderRadius: '4px', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: 'rgb(5, 150, 105)', fontSize: '0.75rem', fontWeight: 700 }}>
                              Actif / Validé
                            </span>
                          ) : (
                            <span style={{ padding: '4px 8px', borderRadius: '4px', backgroundColor: 'rgba(245, 158, 11, 0.15)', color: 'rgb(217, 119, 6)', fontSize: '0.75rem', fontWeight: 700 }}>
                              En attente
                            </span>
                          )}
                        </td>
                        <td>
                          {!(p.statutPrestataire === 'valide' || p.isValidatedPrestataire) && (
                            <button
                              onClick={() => handleValidatePrestataire(p._id || p.id)}
                              className="btn btn-primary"
                              style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                            >
                              Valider Pro
                            </button>
                          )}
                          {p.isBlocked ? (
                            <span style={{ color: 'var(--danger)', fontSize: '0.8rem', fontWeight: 600, marginLeft: '8px' }}>Bloqué</span>
                          ) : (
                            <button
                              onClick={() => handleBlockUser(p._id || p.id)}
                              className="btn"
                              style={{ padding: '6px 12px', fontSize: '0.8rem', marginLeft: '8px', border: '1px solid var(--border)', backgroundColor: 'transparent', color: 'var(--danger)' }}
                            >
                              Bloquer
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                    {prestataires.length === 0 && (
                      <tr>
                        <td colSpan="5" style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                          Aucun prestataire inscrit pour le moment.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: CLIENTS MANAGEMENT */}
          {activeTab === 'clients' && (
            <div className="card animate-fade-in" style={{ padding: '32px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <UserX size={20} style={{ color: 'var(--danger)' }} />
                Gestion des Comptes Clients ({clients.length})
              </h2>

              <div style={{ overflowX: 'auto' }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Nom Complet</th>
                      <th>Email</th>
                      <th>Statut Accessibilité</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clients.map(c => (
                      <tr key={c._id || c.id}>
                        <td><strong>{c.nom}</strong></td>
                        <td>{c.email}</td>
                        <td>
                          {c.isBlocked ? (
                            <span style={{ padding: '4px 8px', borderRadius: '4px', backgroundColor: 'rgba(239, 68, 68, 0.15)', color: 'rgb(220, 38, 38)', fontSize: '0.75rem', fontWeight: 700 }}>
                              Accès Bloqué
                            </span>
                          ) : (
                            <span style={{ padding: '4px 8px', borderRadius: '4px', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: 'rgb(5, 150, 105)', fontSize: '0.75rem', fontWeight: 700 }}>
                              Actif / Autorisé
                            </span>
                          )}
                        </td>
                        <td>
                          {!c.isBlocked ? (
                            <button
                              onClick={() => handleBlockUser(c._id || c.id)}
                              className="btn"
                              style={{ padding: '6px 12px', fontSize: '0.8rem', border: '1px solid var(--border)', backgroundColor: 'transparent', color: 'var(--danger)' }}
                            >
                              Bloquer l'accès
                            </button>
                          ) : (
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Bloqué</span>
                          )}
                        </td>
                      </tr>
                    ))}
                    {clients.length === 0 && (
                      <tr>
                        <td colSpan="4" style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                          Aucun client inscrit pour le moment.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: RESERVATIONS BY CATEGORY STATS */}
          {activeTab === 'stats-categories' && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              <div className="card" style={{ padding: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: 'rgba(124, 58, 237, 0.1)', color: 'var(--primary)' }}>
                    <BarChart3 size={20} />
                  </div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>Répartition des Réservations par Catégorie</h2>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>
                  Statistiques et volumes de rendez-vous enregistrés dans chaque secteur d'activité de la plateforme.
                </p>

                {/* Categories progress breakdown */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {Object.entries(reservationsParCategorie).map(([key, count]) => {
                    const cfg = categoryConfigs[key] || categoryConfigs.autre;
                    const IconComponent = cfg.icon;
                    const pct = totalCategoryReservations > 0 ? ((count / totalCategoryReservations) * 100).toFixed(1) : 0;
                    
                    return (
                      <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ padding: '6px', borderRadius: '6px', backgroundColor: cfg.bg, color: cfg.color, display: 'flex', alignItems: 'center' }}>
                              <IconComponent size={16} />
                            </div>
                            <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{cfg.label}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{count} réservation(s)</span>
                            <span style={{ padding: '2px 8px', borderRadius: '12px', backgroundColor: cfg.bg, color: cfg.color, fontSize: '0.75rem', fontWeight: 700 }}>
                              {pct}%
                            </span>
                          </div>
                        </div>
                        {/* Progress Bar Container */}
                        <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
                          <div 
                            style={{ 
                              width: `${pct}%`, 
                              height: '100%', 
                              backgroundColor: cfg.color, 
                              borderRadius: '4px',
                              transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)' 
                            }} 
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Insights Card */}
              <div className="card" style={{ padding: '24px', borderLeft: '4px solid var(--primary)' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <TrendingUp size={18} style={{ color: 'var(--primary)' }} />
                  Analyse d'Audience et Recommandations
                </h3>
                <ul style={{ paddingLeft: '20px', fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  <li style={{ marginBottom: '6px' }}>
                    La catégorie <strong>{
                      Object.entries(reservationsParCategorie).reduce((a, b) => a[1] > b[1] ? a : b)[0] === 'sante' ? 'Santé' : 
                      Object.entries(reservationsParCategorie).reduce((a, b) => a[1] > b[1] ? a : b)[0] === 'beaute' ? 'Beauté' :
                      Object.entries(reservationsParCategorie).reduce((a, b) => a[1] > b[1] ? a : b)[0] === 'restaurant' ? 'Restauration' : 'Hôtellerie'
                    }</strong> est actuellement la plus active en volume de rendez-vous sur Wakti.
                  </li>
                  <li style={{ marginBottom: '6px' }}>
                    Le taux moyen de validation des nouveaux prestataires est de <strong>{((prestataires.filter(p => p.statutPrestataire === 'valide').length / Math.max(1, prestataires.length)) * 100).toFixed(0)}%</strong>.
                  </li>
                  <li>
                    Assurez-vous de vérifier les documents professionnels des prestataires en attente sous 24h pour optimiser la conversion des clients.
                  </li>
                </ul>
              </div>

            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
