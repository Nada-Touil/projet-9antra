import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, Stethoscope, Scissors, Utensils, Shield, Clock, Award, ArrowRight, Dumbbell, Car, Wrench, Camera, Hotel } from 'lucide-react';
import ServiceCard from '../components/ServiceCard';
import heroImg from '../assets/wakti_hero.jpg';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Mock services fallback in case backend is empty
  const mockServices = [
    {
      _id: 'mock-1',
      nom: 'Consultation Cardiologie',
      description: 'Bilan complet de santé cardiaque avec le Dr. Elyes, comprenant électrocardiogramme et suivi préventif.',
      prix: 80,
      categorie: 'medecin',
      prestataire: { nom: 'Dr. Elyes Gharbi', adresse: 'Cabinet 204, Centre Médical, Lac 2, Tunis', note: 4.9 }
    },
    {
      _id: 'mock-2',
      nom: 'Soin du Visage & Massage Spa',
      description: 'Détente absolue avec un massage relaxant aux huiles essentielles et un soin hydratant complet du visage.',
      prix: 65,
      categorie: 'centre de beaute',
      prestataire: { nom: 'Nirvana Spa & Beauté', adresse: 'Avenue Hédi Nouira, Ennasr 2, Tunis', note: 4.8 }
    },
    {
      _id: 'mock-3',
      nom: 'Table 1 (2 personnes - Près de la fenêtre)',
      description: 'Réservez la table romantique de vos rêves avec vue panoramique sur le port.',
      prix: 0,
      categorie: 'restaurant',
      prestataire: { nom: 'Restaurant El Amel', adresse: 'Port El Kantaoui, Sousse', note: 4.6 }
    },
    {
      _id: 'mock-9',
      nom: 'Suite Junior (Vue sur Patio Tunisien)',
      description: 'Suite traditionnelle de 35m² décorée d’arabesques, grand lit king size, salle de bain en marbre et vue sur le patio.',
      prix: 280,
      categorie: 'hotel',
      prestataire: { nom: 'Dar El Jeld Hotel & Spa', adresse: 'Rue Dar El Jeld, La Médina, Tunis', note: 4.9 }
    },
    {
      _id: 'mock-5',
      nom: 'Session de Coaching Personnel',
      description: 'Entraînement sur-mesure de 1 heure avec évaluation physique, conseils nutritionnels et musculation.',
      prix: 40,
      categorie: 'sport',
      prestataire: { nom: 'Ramzi Fit Coach', adresse: 'California Gym, Centre Urbain Nord, Tunis', note: 4.9 }
    },
    {
      _id: 'mock-6',
      nom: 'Lavage Auto Intelligent & Polish',
      description: 'Nettoyage intérieur et extérieur en profondeur avec cire protectrice, shampoing des sièges.',
      prix: 35,
      categorie: 'auto',
      prestataire: { nom: 'Wash & Go Detailing', adresse: 'Station Shell, Route de la Marsa, Tunis', note: 4.6 }
    }
  ];

  useEffect(() => {
    const fetchPopularServices = async () => {
      try {
        const response = await fetch('/services');
        if (response.ok) {
          const data = await response.json();
          if (data.services && data.services.length > 0) {
            // Keep doctors, tables, suites that represent different providers
            setServices(data.services.slice(0, 4));
          } else {
            setServices(mockServices.slice(0, 4));
          }
        } else {
          setServices(mockServices.slice(0, 4));
        }
      } catch (err) {
        console.warn('Backend connection failed, loading mock services', err);
        setServices(mockServices.slice(0, 4));
      } finally {
        setLoading(false);
      }
    };

    fetchPopularServices();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/search?query=${encodeURIComponent(searchTerm)}&category=${encodeURIComponent(category)}`);
  };

  const handleCategoryClick = (catName) => {
    navigate(`/search?category=${encodeURIComponent(catName)}`);
  };

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="hero-section-full" style={{
        backgroundImage: `linear-gradient(rgba(15, 12, 30, 0.75), rgba(15, 12, 30, 0.75)), url(${heroImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        width: '100vw',
        marginLeft: 'calc(-50vw + 50%)',
        marginRight: 'calc(-50vw + 50%)',
        marginTop: '-40px',
        borderRadius: '0',
        padding: '100px 24px',
        color: 'white',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '80px',
        minHeight: 'calc(100vh - 70px)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ maxWidth: '800px', zIndex: 2, position: 'relative' }}>
          <h1 style={{
            color: '#ffffff',
            WebkitTextFillColor: '#ffffff',
            fontSize: '3.25rem',
            fontWeight: 800,
            marginBottom: '40px',
            lineHeight: '1.25',
            textShadow: '0 4px 20px rgba(0, 0, 0, 0.75)'
          }}>
            Gagnez du temps.<br />
            Planifiez vos réservations avec <span style={{ color: '#c084fc', WebkitTextFillColor: '#c084fc' }}>Wakti</span>.
          </h1>

          {/* Search Bar Form */}
          <form onSubmit={handleSearchSubmit} className="search-wrapper glass" style={{ width: '100%', margin: '0 auto', background: 'rgba(255, 255, 255, 0.95)', border: '1px solid rgba(255, 255, 255, 0.2)', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)' }}>
            <div className="search-input-group" style={{ borderRight: '1px solid #cbd5e1' }}>
              <Search size={20} style={{ color: '#64748b' }} />
              <input
                type="text"
                placeholder="Quel service, hôtel, restaurant ou pro ?"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ color: '#0f172a' }}
              />
            </div>
            <div className="search-input-group" style={{ borderRight: 'none' }}>
              <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ color: '#0f172a' }}>
                <option value="">Toutes les catégories</option>
                <option value="medecin">Médecins</option>
                <option value="centre de beaute">Beauté</option>
                <option value="restaurant">Restaurants</option>
                <option value="hotel">Hôtels</option>
                <option value="clinique">Cliniques</option>
                <option value="sport">Sport & Fitness</option>
                <option value="auto">Services Auto</option>
                <option value="artisan">Artisans & Maison</option>
                <option value="loisir">Loisirs & Photos</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary" style={{ padding: '12px 28px' }}>
              Rechercher
            </button>
          </form>
        </div>
      </section>

      <div className="container">
        {/* Categories Section */}
        <section className="categories-container" style={{ marginBottom: '80px', marginTop: '40px' }}>
          <h2 className="section-title" style={{ textAlign: 'center', width: '100%' }}>Parcourez par catégorie</h2>
          <p style={{ textAlign: 'center', marginBottom: '40px', marginTop: '-20px' }}>Découvrez des professionnels rigoureusement sélectionnés près de chez vous</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }} className="categories-grid">
            <style>{`
              @media (max-width: 900px) {
                .categories-grid {
                  grid-template-columns: repeat(2, 1fr) !important;
                }
              }
              @media (max-width: 600px) {
                .categories-grid {
                  grid-template-columns: 1fr !important;
                }
              }
            `}</style>
            
            {/* Medecin */}
            <div className="card card-hover" onClick={() => handleCategoryClick('medecin')} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <div className="category-icon-wrapper" style={{ backgroundColor: 'rgba(20, 184, 166, 0.12)', color: 'rgb(13, 148, 136)' }}>
                <Stethoscope size={28} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Médecins</h3>
              <p style={{ fontSize: '0.85rem' }}>Trouvez un médecin spécialiste (ophtalmologue, etc.) et réservez votre consultation.</p>
            </div>

            {/* Beaute */}
            <div className="card card-hover" onClick={() => handleCategoryClick('centre de beaute')} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <div className="category-icon-wrapper" style={{ backgroundColor: 'rgba(236, 72, 153, 0.12)', color: 'rgb(219, 39, 119)' }}>
                <Scissors size={28} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Beauté</h3>
              <p style={{ fontSize: '0.85rem' }}>Salons de coiffure, spas, massages et soins d’éclat corporel.</p>
            </div>

            {/* Resto */}
            <div className="card card-hover" onClick={() => handleCategoryClick('restaurant')} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <div className="category-icon-wrapper" style={{ backgroundColor: 'rgba(249, 115, 22, 0.12)', color: 'rgb(234, 88, 12)' }}>
                <Utensils size={28} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Restaurants</h3>
              <p style={{ fontSize: '0.85rem' }}>Réservez la table de votre choix (vue mer, terrasse, fenêtre) en direct.</p>
            </div>

            {/* Hotel */}
            <div className="card card-hover" onClick={() => handleCategoryClick('hotel')} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <div className="category-icon-wrapper" style={{ backgroundColor: 'rgba(99, 102, 241, 0.12)', color: 'rgb(79, 70, 229)' }}>
                <Hotel size={28} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Hôtels</h3>
              <p style={{ fontSize: '0.85rem' }}>Réservez des séjours, suites ou chambres selon la vue (mer/jardin) ou le prix.</p>
            </div>

            {/* Clinique */}
            <div className="card card-hover" onClick={() => handleCategoryClick('clinique')} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <div className="category-icon-wrapper" style={{ backgroundColor: 'rgba(71, 85, 105, 0.12)', color: 'rgb(71, 85, 105)' }}>
                <Shield size={28} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Cliniques</h3>
              <p style={{ fontSize: '0.85rem' }}>Bilans de santé globaux, radiologie et cliniques privées.</p>
            </div>

            {/* Sport */}
            <div className="card card-hover" onClick={() => handleCategoryClick('sport')} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <div className="category-icon-wrapper" style={{ backgroundColor: 'rgba(16, 185, 129, 0.12)', color: 'rgb(5, 150, 105)' }}>
                <Dumbbell size={28} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Sport & Fitness</h3>
              <p style={{ fontSize: '0.85rem' }}>Coachs privés, séances de fitness et salles de musculation.</p>
            </div>

            {/* Auto */}
            <div className="card card-hover" onClick={() => handleCategoryClick('auto')} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <div className="category-icon-wrapper" style={{ backgroundColor: 'rgba(59, 130, 246, 0.12)', color: 'rgb(37, 99, 235)' }}>
                <Car size={28} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Services Auto</h3>
              <p style={{ fontSize: '0.85rem' }}>Lavage écologique, vidange et mécaniciens agréés.</p>
            </div>

            {/* Artisan */}
            <div className="card card-hover" onClick={() => handleCategoryClick('artisan')} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <div className="category-icon-wrapper" style={{ backgroundColor: 'rgba(245, 158, 11, 0.12)', color: 'rgb(217, 119, 6)' }}>
                <Wrench size={28} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Artisans & Maison</h3>
              <p style={{ fontSize: '0.85rem' }}>Plombiers, électriciens et ménage à domicile.</p>
            </div>

            {/* Loisirs */}
            <div className="card card-hover" onClick={() => handleCategoryClick('loisir')} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <div className="category-icon-wrapper" style={{ backgroundColor: 'rgba(244, 63, 94, 0.12)', color: 'rgb(225, 29, 72)' }}>
                <Camera size={28} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Loisirs & Photos</h3>
              <p style={{ fontSize: '0.85rem' }}>Photographes professionnels, studios et événements.</p>
            </div>
          </div>
        </section>

        {/* Trust Badges */}
        <section className="glass" style={{ borderRadius: 'var(--radius-lg)', padding: '40px 24px', marginBottom: '80px', display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '30px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', maxWidth: '300px', textAlign: 'left' }}>
            <Clock size={36} style={{ color: 'var(--primary)', flexShrink: 0 }} />
            <div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Dispo 24h/7</h4>
              <p style={{ fontSize: '0.85rem' }}>Réservez à tout moment, depuis votre ordinateur ou votre mobile.</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', maxWidth: '300px', textAlign: 'left' }}>
            <Award size={36} style={{ color: 'var(--primary)', flexShrink: 0 }} />
            <div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Professionnels vérifiés</h4>
              <p style={{ fontSize: '0.85rem' }}>Tous les prestataires sont agréés et notés par de vrais clients.</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', maxWidth: '300px', textAlign: 'left' }}>
            <Shield size={36} style={{ color: 'var(--primary)', flexShrink: 0 }} />
            <div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Réservation sécurisée</h4>
              <p style={{ fontSize: '0.85rem' }}>Annulation sans frais et notifications de rappels SMS / Email.</p>
            </div>
          </div>
        </section>

        {/* Featured Services */}
        <section style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Prestations populaires</h2>
            <Link to="/search" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--primary)', fontWeight: 600, fontSize: '0.95rem' }}>
              Voir tout
              <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div style={{ display: 'inline-block', width: '40px', height: '40px', border: '4px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              <p style={{ marginTop: '16px' }}>Chargement des prestations...</p>
            </div>
          ) : (
            <div className="grid-4">
              {services.map((service) => (
                <ServiceCard key={service._id || service.id} service={service} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Home;
