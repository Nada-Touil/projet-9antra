import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Calendar, MessageSquare, Star, Trash2, Send, Bot, Clock, AlertTriangle, ShieldCheck } from 'lucide-react';

const ClientDashboard = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  // Redirect if not logged in or not a client
  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (user.role === 'prestataire') {
      navigate('/provider-dashboard');
    }
  }, [user]);

  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Chatbot state
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState(user?.chatbotHistory || []);
  const [chatLoading, setChatLoading] = useState(false);

  // Review state
  const [reviewServiceId, setReviewServiceId] = useState(null);
  const [rating, setRating] = useState(5);
  const [commentaire, setCommentaire] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);

  // Mock reservations fallback
  const mockReservations = [
    {
      _id: 'mock-res-1',
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days in future
      statut: 'en_attente',
      prixTotal: 80,
      service: { nom: 'Consultation Cardiologie', categorie: 'medecin' },
      prestataire: { nom: 'Dr. Elyes Gharbi', adresse: 'Cabinet 204, Centre Médical, Lac 2, Tunis' }
    },
    {
      _id: 'mock-res-2',
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days in past
      statut: 'complete',
      prixTotal: 65,
      service: { _id: 'service-beaute-id', nom: 'Soin du Visage & Massage Spa', categorie: 'centre de beaute' },
      prestataire: { nom: 'Nirvana Spa & Beauté', adresse: 'Avenue Hédi Nouira, Ennasr 2, Tunis' }
    }
  ];

  const fetchHistory = async () => {
    if (!user?._id) return;
    try {
      const response = await fetch(`/users/${user._id}/historique`);
      if (response.ok) {
        const data = await response.json();
        // Backend returns: { message, reservations, avis, chatbotHistory }
        if (data.reservations && data.reservations.length > 0) {
          setReservations(data.reservations);
        } else {
          setReservations(mockReservations);
        }
        if (data.chatbotHistory) {
          setChatHistory(data.chatbotHistory);
        }
      } else {
        setReservations(mockReservations);
      }
    } catch (err) {
      console.warn('Backend history retrieval failed, using mock data');
      setReservations(mockReservations);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [user]);

  // Cancel reservation
  const handleCancelReservation = async (reservationId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir annuler ce rendez-vous ?')) return;

    try {
      const response = await fetch(`/users/${user._id}/annulerReservation/${reservationId}`, {
        method: 'POST',
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l\'annulation');
      }

      alert('Rendez-vous annulé avec succès.');
      // Refresh list
      fetchHistory();
    } catch (err) {
      alert(err.message || 'Impossible d\'annuler la réservation.');
    }
  };

  // Submit review
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewServiceId) return;

    setReviewLoading(true);
    setReviewSuccess('');
    setReviewError('');

    try {
      const response = await fetch(`/users/${user._id}/laisserAvis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          note: rating,
          commentaire,
          service: reviewServiceId
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la soumission de l\'avis');
      }

      setReviewSuccess('Merci ! Votre avis a été enregistré.');
      setCommentaire('');
      setReviewServiceId(null);
      fetchHistory();
    } catch (err) {
      setReviewError(err.message || 'Impossible de laisser l\'avis.');
    } finally {
      setReviewLoading(false);
    }
  };

  // Submit chat message to Bot
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const userMsg = chatMessage;
    setChatMessage('');
    setChatLoading(true);

    // Optimistically update chat history
    setChatHistory(prev => [...prev, { message: userMsg, response: 'Le bot est en train d\'analyser votre message...', createdAt: new Date() }]);

    try {
      const response = await fetch(`/users/${user._id}/chatbot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMsg }),
      });

      const data = await response.json();

      if (response.ok && data.result) {
        setChatHistory(prev => {
          const list = [...prev];
          list[list.length - 1] = data.result; // Replace optimistic loading message with real result
          return list;
        });
        
        // Sync context chatbotHistory state
        if (user) {
          const updatedUser = { ...user, chatbotHistory: [...(user.chatbotHistory || []), data.result] };
          setUser(updatedUser);
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }
      } else {
        throw new Error('Erreur de communication avec le chatbot');
      }
    } catch (err) {
      setChatHistory(prev => {
        const list = [...prev];
        list[list.length - 1] = { message: userMsg, response: 'Erreur: Le service chatbot est actuellement indisponible.', createdAt: new Date() };
        return list;
      });
    } finally {
      setChatLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'complete':
        return <span className="badge" style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: 'rgb(5, 150, 105)' }}>Complété</span>;
      case 'annule':
        return <span className="badge" style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', color: 'rgb(220, 38, 38)' }}>Annulé</span>;
      default:
        return <span className="badge" style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)', color: 'rgb(217, 119, 6)' }}>En attente</span>;
    }
  };

  if (!user) return null;

  return (
    <div className="animate-fade-in" style={{ textAlign: 'left' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2.25rem', marginBottom: '8px' }}>Mon Espace Client</h1>
        <p>Gérez vos réservations, exprimez votre avis, et discutez avec notre assistant intelligent.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '32px' }} className="dashboard-layout">
        <style>{`
          @media (max-width: 1024px) {
            .dashboard-layout {
              grid-template-columns: 1fr !important;
            }
          }
          .chat-box {
            height: 350px;
            overflow-y: auto;
            border: 1px solid var(--border);
            padding: 16px;
            border-radius: var(--radius-md);
            background-color: var(--bg);
            display: flex;
            flex-direction: column;
            gap: 16px;
          }
          .chat-bubble-user {
            align-self: flex-end;
            background-color: var(--primary);
            color: white;
            padding: 10px 14px;
            border-radius: 14px 14px 2px 14px;
            max-width: 80%;
            font-size: 0.9rem;
          }
          .chat-bubble-bot {
            align-self: flex-start;
            background-color: var(--surface);
            border: 1px solid var(--border);
            color: var(--text-main);
            padding: 10px 14px;
            border-radius: 14px 14px 14px 2px;
            max-width: 80%;
            font-size: 0.9rem;
          }
        `}</style>

        {/* Left Side: Booking History */}
        <main style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* Client Details Summary Card */}
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '24px', backgroundColor: 'var(--surface)' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.75rem',
              fontWeight: 800
            }}>
              {user.nom.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '4px' }}>{user.nom}</h2>
              <div style={{ display: 'flex', gap: '16px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                <span>Email : <strong>{user.email}</strong></span>
                <span>Téléphone : <strong>{user.telephone}</strong></span>
              </div>
            </div>
          </div>

          {/* Booking History Card */}
          <div className="card" style={{ padding: '28px' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={20} style={{ color: 'var(--primary)' }} />
              Historique de mes rendez-vous
            </h3>

            {loading ? (
              <p>Chargement de vos réservations...</p>
            ) : reservations.length > 0 ? (
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Prestation</th>
                      <th>Professionnel</th>
                      <th>Date de RDV</th>
                      <th>Tarif</th>
                      <th>Statut</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservations.map((res) => {
                      const resDate = new Date(res.date);
                      const isPast = resDate < new Date();
                      
                      return (
                        <tr key={res._id || res.id}>
                          <td>
                            <strong style={{ display: 'block', fontSize: '0.95rem' }}>{res.service?.nom || 'Prestation'}</strong>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                              {res.service?.categorie || 'Service'}
                            </span>
                          </td>
                          <td>
                            <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{res.prestataire?.nom || 'Prestataire'}</span>
                            <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              {res.prestataire?.adresse || 'Cabinet'}
                            </span>
                          </td>
                          <td>
                            <span style={{ fontSize: '0.9rem', display: 'block' }}>
                              {resDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Clock size={12} />
                              {resDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </td>
                          <td style={{ fontWeight: 700, color: 'var(--primary)' }}>{res.prixTotal} DT</td>
                          <td>{getStatusBadge(res.statut)}</td>
                          <td>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              {res.statut === 'en_attente' && !isPast && (
                                <button
                                  onClick={() => handleCancelReservation(res._id || res.id)}
                                  className="btn-icon"
                                  title="Annuler le rendez-vous"
                                  style={{ color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.2)' }}
                                >
                                  <Trash2 size={14} />
                                </button>
                              )}
                              {isPast && res.statut !== 'annule' && (
                                <button
                                  onClick={() => setReviewServiceId(res.service?._id || res.service)}
                                  className="btn btn-secondary"
                                  style={{ padding: '6px 12px', fontSize: '0.75rem', gap: '4px' }}
                                >
                                  <Star size={12} fill="currentColor" />
                                  Noter
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 10px' }}>
                <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>Vous n'avez pas encore effectué de réservation.</p>
                <button onClick={() => navigate('/search')} className="btn btn-primary">
                  Réserver un service maintenant
                </button>
              </div>
            )}
          </div>
        </main>

        {/* Right Side: Chatbot Assistant & Review Popup */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* Review Card Modal/Widget */}
          {reviewServiceId && (
            <div className="card animate-fade-in" style={{ padding: '24px', border: '1px solid var(--primary)', backgroundColor: 'var(--surface)' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '12px' }}>Laisser une évaluation</h3>
              
              {reviewSuccess && <p style={{ color: 'var(--success)', fontSize: '0.85rem', marginBottom: '10px' }}>{reviewSuccess}</p>}
              {reviewError && <p style={{ color: 'var(--danger)', fontSize: '0.85rem', marginBottom: '10px' }}>{reviewError}</p>}

              <form onSubmit={handleReviewSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Note (sur 5)</label>
                  <div style={{ display: 'flex', gap: '6px', color: '#fbbf24', cursor: 'pointer', fontSize: '1.25rem' }}>
                    {[1, 2, 3, 4, 5].map((starVal) => (
                      <button
                        key={starVal}
                        type="button"
                        onClick={() => setRating(starVal)}
                        style={{ background: 'none', border: 'none', color: '#fbbf24', cursor: 'pointer', padding: 0 }}
                      >
                        <Star size={24} fill={starVal <= rating ? 'currentColor' : 'none'} stroke="currentColor" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Votre avis</label>
                  <textarea
                    className="form-input"
                    rows="3"
                    placeholder="Écrivez un commentaire sincère sur votre expérience..."
                    value={commentaire}
                    onChange={(e) => setCommentaire(e.target.value)}
                    required
                    style={{ resize: 'vertical' }}
                  ></textarea>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button type="submit" disabled={reviewLoading} className="btn btn-primary" style={{ flexGrow: 1, padding: '8px' }}>
                    {reviewLoading ? 'Envoi...' : 'Soumettre'}
                  </button>
                  <button type="button" onClick={() => setReviewServiceId(null)} className="btn btn-secondary" style={{ padding: '8px' }}>
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Chatbot Card */}
          <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', height: '480px' }}>
            <h3 style={{ fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border)', paddingBottom: '12px', marginBottom: '16px', margin: 0 }}>
              <Bot size={22} style={{ color: 'var(--primary)' }} />
              Chatbot Wakti Assistant
            </h3>
            
            {/* Scrollable chat body */}
            <div className="chat-box" style={{ flexGrow: 1, marginBottom: '16px' }}>
              <div className="chat-bubble-bot">
                Bonjour <strong>{user.nom}</strong> ! Je suis votre assistant virtuel Wakti. Comment puis-je vous aider aujourd'hui ? 
                Vous pouvez me demander comment réserver, ou me poser des questions sur les catégories.
              </div>

              {chatHistory.map((chat, idx) => (
                <React.Fragment key={idx}>
                  <div className="chat-bubble-user">{chat.message}</div>
                  <div className="chat-bubble-bot">{chat.response}</div>
                </React.Fragment>
              ))}

              {chatLoading && (
                <div style={{ display: 'flex', gap: '6px', padding: '10px 14px', backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '14px', width: 'fit-content' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--text-muted)', animation: 'bounce 0.6s infinite alternate' }}></span>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--text-muted)', animation: 'bounce 0.6s infinite alternate 0.2s' }}></span>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--text-muted)', animation: 'bounce 0.6s infinite alternate 0.4s' }}></span>
                  <style>{`
                    @keyframes bounce {
                      from { transform: translateY(0); }
                      to { transform: translateY(-4px); }
                    }
                  `}</style>
                </div>
              )}
            </div>

            {/* Input message form */}
            <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Tapez un message..."
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                style={{ padding: '10px 14px' }}
                disabled={chatLoading}
              />
              <button type="submit" className="btn btn-primary" style={{ padding: '10px' }} disabled={chatLoading}>
                <Send size={16} />
              </button>
            </form>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ClientDashboard;
