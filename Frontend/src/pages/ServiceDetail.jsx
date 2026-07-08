import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Star, MapPin, Calendar, Clock, ChevronRight, CheckCircle, ShieldAlert } from 'lucide-react';
import { getCategoryStyles } from '../components/ServiceCard';

const ServiceDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Mock services list to find detail in case backend is empty
  const mockServices = [
    {
      _id: 'mock-1',
      id: 'mock-1',
      nom: 'Consultation Cardiologie',
      description: 'Bilan complet de santé cardiaque avec le Dr. Elyes, comprenant électrocardiogramme et suivi préventif. Le Dr. Elyes Gharbi est un spécialiste renommé diplômé de la Faculté de Médecine de Tunis, fort de plus de 15 ans d\'expérience dans le domaine des maladies cardio-vasculaires.',
      prix: 80,
      categorie: 'medecin',
      prestataire: {
        _id: 'provider-1',
        nom: 'Dr. Elyes Gharbi',
        adresse: 'Cabinet 204, Centre Médical, Lac 2, Tunis',
        note: 4.9,
        telephone: '+216 71 900 800'
      }
    },
    {
      _id: 'mock-2',
      id: 'mock-2',
      nom: 'Soin du Visage & Massage Spa',
      description: 'Détente absolue avec un massage relaxant aux huiles essentielles et un soin hydratant complet du visage. Notre spa utilise exclusivement des produits biologiques haut de gamme certifiés pour offrir à votre peau tout l\'éclat et le repos qu\'elle mérite.',
      prix: 65,
      categorie: 'centre de beaute',
      prestataire: {
        _id: 'provider-2',
        nom: 'Nirvana Spa & Beauté',
        adresse: 'Avenue Hédi Nouira, Ennasr 2, Tunis',
        note: 4.8,
        telephone: '+216 70 800 900'
      }
    },
    {
      _id: 'mock-3',
      id: 'mock-3',
      nom: 'Menu Dégustation Gastronomique',
      description: 'Une expérience culinaire inoubliable avec un menu complet 4 services composé de produits locaux frais. Notre chef vous invite à redécouvrir la cuisine tunisienne moderne à travers des saveurs raffinées et des accords surprenants.',
      prix: 110,
      categorie: 'restaurant',
      prestataire: {
        _id: 'provider-3',
        nom: 'Le Petit Restaurant',
        adresse: 'Rue de la Mer, La Marsa, Tunis',
        note: 4.7,
        telephone: '+216 71 700 600'
      }
    },
    {
      _id: 'mock-4',
      id: 'mock-4',
      nom: 'Bilan de Santé Pédiatrique',
      description: 'Examen complet de croissance pour enfant avec conseils de vaccination et alimentation par un pédiatre agréé. Nous accueillons les enfants dans un cadre chaleureux et apaisant pour désamorcer l\'anxiété des examens médicaux.',
      prix: 90,
      categorie: 'clinique',
      prestataire: {
        _id: 'provider-4',
        nom: 'Clinique Pédiatrique du Lac',
        adresse: 'Rue du Lac Victoria, Les Berges du Lac, Tunis',
        note: 4.9,
        telephone: '+216 71 888 999'
      }
    }
  ];

  useEffect(() => {
    const fetchService = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/services/${id}`);
        if (response.ok) {
          const data = await response.json();
          setService(data.service);
        } else {
          // Check mock
          const mock = mockServices.find(s => s._id === id || s.id === id);
          if (mock) {
            setService(mock);
          } else {
            setError('Service introuvable');
          }
        }
      } catch (err) {
        // Fallback to mock
        const mock = mockServices.find(s => s._id === id || s.id === id);
        if (mock) {
          setService(mock);
        } else {
          setError('Erreur lors du chargement du service');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }

    if (user.role !== 'client') {
      setBookingError('Seuls les clients peuvent effectuer des réservations.');
      return;
    }

    if (!selectedDate || !selectedTime) {
      setBookingError('Veuillez sélectionner une date et un créneau horaire.');
      return;
    }

    setSubmitting(true);
    setBookingError('');

    try {
      const dateTime = new Date(`${selectedDate}T${selectedTime}`);
      
      const payload = {
        date: dateTime.toISOString(),
        statut: 'en_attente',
        prixTotal: service.prix,
        service: service._id || service.id,
        prestataire: service.prestataire?._id || service.prestataire || '64a9efdf158c30f40d85efaa' // Default fallback ID if none
      };

      const response = await fetch(`/users/${user._id}/faireReservation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la réservation');
      }

      setBookingSuccess(true);
    } catch (err) {
      setBookingError(err.message || 'Impossible d\'effectuer la réservation.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px' }}>
        <div style={{ display: 'inline-block', width: '50px', height: '50px', border: '5px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <p style={{ marginTop: '20px', color: 'var(--text-muted)' }}>Chargement de la prestation...</p>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="card" style={{ padding: '60px 20px', textAlign: 'center', maxWidth: '600px', margin: '40px auto' }}>
        <ShieldAlert size={48} style={{ color: 'var(--danger)', marginBottom: '16px' }} />
        <h2 style={{ marginBottom: '12px' }}>Une erreur est survenue</h2>
        <p style={{ marginBottom: '24px' }}>{error || 'Prestation introuvable ou inexistante.'}</p>
        <Link to="/search" className="btn btn-primary">
          Retourner aux services
        </Link>
      </div>
    );
  }

  const catStyles = getCategoryStyles(service.categorie);
  const CatIcon = catStyles.icon;
  const provider = service.prestataire || {};

  // Available times slots mock
  const timeSlots = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];

  return (
    <div className="animate-fade-in" style={{ textAlign: 'left' }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
        <Link to="/" style={{ hover: 'color: var(--primary)' }}>Accueil</Link>
        <ChevronRight size={14} />
        <Link to="/search" style={{ hover: 'color: var(--primary)' }}>Services</Link>
        <ChevronRight size={14} />
        <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{service.nom}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '32px' }} className="detail-layout">
        <style>{`
          @media (max-width: 900px) {
            .detail-layout {
              grid-template-columns: 1fr !important;
            }
          }
          .time-slot-btn {
            border: 1px solid var(--border);
            background-color: var(--surface);
            padding: 10px;
            border-radius: var(--radius-sm);
            text-align: center;
            font-weight: 600;
            font-size: 0.9rem;
            cursor: pointer;
            transition: all var(--transition-fast);
          }
          .time-slot-btn:hover {
            border-color: var(--primary);
            background-color: var(--primary-light);
          }
          .time-slot-btn.selected {
            background-color: var(--primary);
            color: white;
            border-color: var(--primary);
          }
        `}</style>

        {/* Left Side: Info */}
        <main style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Main Card */}
          <div className="card" style={{ padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
              <div>
                <span style={{
                  backgroundColor: catStyles.bg,
                  color: catStyles.color,
                  padding: '6px 12px',
                  borderRadius: '8px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  marginBottom: '12px'
                }}>
                  <CatIcon size={12} />
                  {catStyles.label}
                </span>
                <h1 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '8px' }}>{service.nom}</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{provider.nom || 'Prestataire Indépendant'}</span>
                  <div className="stars">
                    <Star size={16} fill="currentColor" />
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, marginLeft: '4px' }}>{(provider.note || 4.5).toFixed(1)}</span>
                  </div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block' }}>Tarif de la prestation</span>
                <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>{service.prix} DT</span>
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '24px 0' }} />

            <h3 style={{ fontSize: '1.25rem', marginBottom: '12px' }}>Description du service</h3>
            <p style={{ color: 'var(--text-main)', fontSize: '0.95rem', lineHeight: '1.6', whiteSpace: 'pre-line', marginBottom: '24px' }}>
              {service.description || "Aucune description détaillée n'est disponible."}
            </p>

            {provider.adresse && (
              <div style={{ display: 'flex', gap: '12px', padding: '16px', backgroundColor: 'var(--bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <MapPin size={20} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '4px' }}>Lieu de rendez-vous</h4>
                  <p style={{ fontSize: '0.85rem' }}>{provider.adresse}</p>
                  {provider.telephone && <p style={{ fontSize: '0.85rem', marginTop: '4px' }}>Téléphone : <strong>{provider.telephone}</strong></p>}
                </div>
              </div>
            )}
          </div>

          {/* Feedback & Reviews Section */}
          <div className="card" style={{ padding: '32px' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '20px' }}>Avis clients</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <strong style={{ fontSize: '0.95rem' }}>Kamel M.</strong>
                  <div className="stars"><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /></div>
                </div>
                <p style={{ fontSize: '0.9rem' }}>Service impeccable ! Professionnel très ponctuel et à l'écoute. Je recommande vivement.</p>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <strong style={{ fontSize: '0.95rem' }}>Sarah B.</strong>
                  <div className="stars"><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} style={{ color: 'var(--border)' }} /></div>
                </div>
                <p style={{ fontSize: '0.9rem' }}>Très bon accueil et explications claires. Le cabinet est très propre. J'y retournerai.</p>
              </div>
            </div>
          </div>
        </main>

        {/* Right Side: Booking Panel */}
        <aside>
          <div className="card" style={{ position: 'sticky', top: '94px', padding: '28px', boxShadow: 'var(--shadow-lg)', border: '1px solid hsla(var(--primary-hsl), 0.15)' }}>
            {bookingSuccess ? (
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <CheckCircle size={56} style={{ color: 'var(--success)', marginBottom: '16px' }} />
                <h3 style={{ fontSize: '1.35rem', marginBottom: '12px' }}>Réservation Confirmée !</h3>
                <p style={{ fontSize: '0.9rem', marginBottom: '24px' }}>
                  Votre demande de réservation pour le <strong>{new Date(selectedDate).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</strong> à <strong>{selectedTime}</strong> a été enregistrée avec succès.
                </p>
                <Link to="/client-dashboard" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  Aller à mon espace client
                </Link>
              </div>
            ) : (
              <form onSubmit={handleBooking} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border)', paddingBottom: '12px', margin: 0 }}>
                  <Calendar size={20} style={{ color: 'var(--primary)' }} />
                  Planifier un RDV
                </h3>

                {bookingError && (
                  <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', fontSize: '0.85rem', fontWeight: 600 }}>
                    {bookingError}
                  </div>
                )}

                {/* Choose Date */}
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">1. Choisissez une date</label>
                  <input
                    type="date"
                    className="form-input"
                    min={new Date().toISOString().split('T')[0]}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    required
                  />
                </div>

                {/* Choose Time */}
                {selectedDate && (
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={12} />
                      2. Choisissez l'heure
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginTop: '6px' }}>
                      {timeSlots.map(time => {
                        const isSelected = selectedTime === time;
                        return (
                          <button
                            key={time}
                            type="button"
                            className={`time-slot-btn ${isSelected ? 'selected' : ''}`}
                            onClick={() => setSelectedTime(time)}
                          >
                            {time}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Pricing summary */}
                {selectedDate && selectedTime && (
                  <div style={{ padding: '16px', backgroundColor: 'var(--bg)', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.9rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Prestation :</span>
                      <span style={{ fontWeight: 600 }}>{service.nom}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Date & Heure :</span>
                      <span style={{ fontWeight: 600 }}>{selectedDate} à {selectedTime}</span>
                    </div>
                    <hr style={{ border: 'none', borderTop: '1px dashed var(--border)', margin: '6px 0' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.05rem', fontWeight: 800 }}>
                      <span>Total :</span>
                      <span style={{ color: 'var(--primary)' }}>{service.prix} DT</span>
                    </div>
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '12px', justifyContent: 'center', fontSize: '1rem' }}
                >
                  {submitting ? 'Réservation...' : user ? 'Réserver maintenant' : 'Se connecter pour réserver'}
                </button>
                
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', margin: 0 }}>
                  Aucun paiement requis en ligne. Vous payez sur place lors de votre rendez-vous.
                </p>
              </form>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ServiceDetail;
