import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Users, Calendar, Award, MessageSquare, ShieldCheck, UserX, CheckCircle } from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    users: 0,
    reservations: 0,
    services: 0,
    avis: 0,
    pendingPrestataires: 0
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
        pendingPrestataires: 1
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
      setStats(prev => ({ ...prev, pendingPrestataires: Math.max(0, prev.pendingPrestataires - 1) }));
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

  return (
    <div className="container animate-fade-in" style={{ textAlign: 'left' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2.25rem', marginBottom: '8px' }}>Panneau d'Administration Wakti</h1>
        <p>Gérez les prestataires, surveillez les statistiques globales et validez les nouvelles inscriptions.</p>
      </div>

      {actionSuccess && <div style={{ padding: '12px 16px', borderRadius: '8px', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', fontSize: '0.9rem', fontWeight: 600, marginBottom: '24px' }}>{actionSuccess}</div>}
      {error && <div style={{ padding: '12px 16px', borderRadius: '8px', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', fontSize: '0.9rem', fontWeight: 600, marginBottom: '24px' }}>{error}</div>}

      {/* Stats Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px' }} className="grid-4">
        <style>{`
          @media (max-width: 900px) {
            .grid-4 {
              grid-template-columns: repeat(2, 1fr) !important;
            }
          }
          @media (max-width: 600px) {
            .grid-4 {
              grid-template-columns: 1fr !important;
            }
          }
          .admin-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 12px;
          }
          .admin-table th, .admin-table td {
            padding: 12px 16px;
            text-align: left;
            border-bottom: 1px solid var(--border);
          }
          .admin-table th {
            font-weight: 700;
            background-color: var(--bg);
            font-size: 0.85rem;
            color: var(--text-muted);
            text-transform: uppercase;
          }
          .admin-table td {
            font-size: 0.9rem;
          }
        `}</style>

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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '32px' }}>
        
        {/* Prestataires Validation Panel */}
        <div className="card" style={{ padding: '32px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={20} style={{ color: 'var(--primary)' }} />
            Gestion et Validation des Prestataires ({prestataires.length})
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
              </tbody>
            </table>
          </div>
        </div>

        {/* Clients management panel */}
        <div className="card" style={{ padding: '32px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <UserX size={20} style={{ color: 'var(--danger)' }} />
            Gestion des Clients ({clients.length})
          </h2>

          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Nom Complet</th>
                  <th>Email</th>
                  <th>Statut</th>
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
                          Bloqué
                        </span>
                      ) : (
                        <span style={{ padding: '4px 8px', borderRadius: '4px', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: 'rgb(5, 150, 105)', fontSize: '0.75rem', fontWeight: 700 }}>
                          Actif
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
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Aucune action</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
