import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, Stethoscope, Scissors, Utensils, Shield, Clock, Award, ArrowRight, Dumbbell, Car, Wrench, Camera } from 'lucide-react';
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
      nom: 'Menu Dégustation Gastronomique',
      description: 'Une expérience culinaire inoubliable avec un menu complet 4 services composé de produits locaux frais.',
      prix: 110,
      categorie: 'restaurant',
      prestataire: { nom: 'Le Petit Restaurant', adresse: 'Rue de la Mer, La Marsa, Tunis', note: 4.7 }
    },
    {
      _id: 'mock-5',
      nom: 'Session de Coaching Personnel',
      description: 'Entraînement sur-mesure de 1 heure avec évaluation physique, conseils nutritionnels et musculation par un coach certifié.',
      prix: 40,
      categorie: 'sport',
      prestataire: { nom: 'Ramzi Fit Coach', adresse: 'California Gym, Centre Urbain Nord, Tunis', note: 4.9 }
    },
    {
      _id: 'mock-6',
      nom: 'Lavage Auto Intelligent & Polish',
      description: 'Nettoyage intérieur et extérieur en profondeur avec cire protectrice, shampoing des sièges et lustrage des phares.',
      prix: 35,
      categorie: 'auto',
      prestataire: { nom: 'Wash & Go Detailing', adresse: 'Station Shell, Route de la Marsa, Tunis', note: 4.6 }
    },
    {
      _id: 'mock-7',
      nom: 'Dépannage & Installation Plomberie',
      description: 'Recherche et réparation de fuites d\'eau, débouchage de canalisations ou installation de robinetterie à domicile.',
      prix: 50,
      categorie: 'artisan',
      prestataire: { nom: 'Saber Plomberie Express', adresse: 'Interventions Grand Tunis, Tunis', note: 4.8 }
    },
    {
      _id: 'mock-8',
      nom: 'Shooting Photo Professionnel',
      description: 'Séance photo de 1h en studio ou en extérieur pour portraits professionnels, packshots produits ou événements de famille.',
      prix: 150,
      categorie: 'loisir',
      prestataire: { nom: 'Studio Elyes Photo', adresse: 'Rue de Sousse, Menzah 5, Tunis', note: 4.7 }
    }
  ];

  useEffect(() => {
    const fetchPopularServices = async () => {
      try {
        const response = await fetch('/services');
        if (response.ok) {
          const data = await response.json();
          if (data.services && data.services.length > 0) {
            setServices(data.services.slice(0, 4));
          } else {
            // Shuffle and slice to show 4 random popular ones
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
      <section className="hero-section-pro">
        <div className="hero-grid">
          {/* Left Column */}
          <div className="hero-left">
            <h1 className="hero-title">
              Ne perdez plus de temps.<br />
              Réservez avec <span style={{ color: 'var(--primary)', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Wakti</span>.
            </h1>
            <p className="hero-subtitle">
              Wakti ("Mon Temps") est la plateforme Tunisienne premium pour planifier vos rendez-vous instantanément chez vos médecins, centres de beauté, restaurants et cliniques.
            </p>

            {/* Search Bar Form */}
            <form onSubmit={handleSearchSubmit} className="search-wrapper glass" style={{ width: '100%', margin: '0' }}>
              <div className="search-input-group">
                <Search size={20} style={{ color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Quel service ou professionnel ?"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="search-input-group">
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="">Toutes les catégories</option>
                  <option value="medecin">Médecins</option>
                  <option value="centre de beaute">Beauté</option>
                  <option value="restaurant">Restaurants</option>
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

          {/* Right Column: Hero Banner Image */}
          <div className="hero-right">
            <div className="hero-image-container glass">
              <img src={heroImg} alt="Wakti Banner" className="hero-image" />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-container" style={{ marginBottom: '80px', marginTop: '40px' }}>
        <h2 className="section-title" style={{ textAlign: 'center', width: '100%' }}>Parcourez par catégorie</h2>
        <p style={{ textAlign: 'center', marginBottom: '40px', marginTop: '-20px' }}>Découvrez des professionnels rigoureusement sélectionnés près de chez vous</p>
        
        <div className="grid-4">
          {/* Medecin */}
          <div className="card card-hover" onClick={() => handleCategoryClick('medecin')} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div className="category-icon-wrapper" style={{ backgroundColor: 'rgba(20, 184, 166, 0.12)', color: 'rgb(13, 148, 136)' }}>
              <Stethoscope size={28} />
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Médecins</h3>
            <p style={{ fontSize: '0.85rem' }}>Généralistes, pédiatres, dentistes et spécialistes.</p>
          </div>

          {/* Beaute */}
          <div className="card card-hover" onClick={() => handleCategoryClick('centre de beaute')} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div className="category-icon-wrapper" style={{ backgroundColor: 'rgba(236, 72, 153, 0.12)', color: 'rgb(219, 39, 119)' }}>
              <Scissors size={28} />
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Beauté</h3>
            <p style={{ fontSize: '0.85rem' }}>Salons de coiffure, spas, massages et soins esthétiques.</p>
          </div>

          {/* Resto */}
          <div className="card card-hover" onClick={() => handleCategoryClick('restaurant')} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div className="category-icon-wrapper" style={{ backgroundColor: 'rgba(249, 115, 22, 0.12)', color: 'rgb(234, 88, 12)' }}>
              <Utensils size={28} />
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Restaurants</h3>
            <p style={{ fontSize: '0.85rem' }}>Réservation de tables et haute gastronomie tunisienne.</p>
          </div>

          {/* Clinique */}
          <div className="card card-hover" onClick={() => handleCategoryClick('clinique')} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div className="category-icon-wrapper" style={{ backgroundColor: 'rgba(99, 102, 241, 0.12)', color: 'rgb(79, 70, 229)' }}>
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
  );
};

export default Home;
