import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Search as SearchIcon, Filter, MapPin, SlidersHorizontal, Stethoscope, Scissors, Utensils, Shield, Sparkles, Dumbbell, Car, Wrench, Camera, Hotel } from 'lucide-react';
import ServiceCard from '../components/ServiceCard';

const Search = () => {
  const location = useLocation();
  
  // Parse URL query params
  const getQueryParams = () => {
    const params = new URLSearchParams(location.search);
    return {
      query: params.get('query') || '',
      category: params.get('category') || ''
    };
  };

  const urlParams = getQueryParams();
  const [searchTerm, setSearchTerm] = useState(urlParams.query);
  const [selectedCategory, setSelectedCategory] = useState(urlParams.category);
  const [priceLimit, setPriceLimit] = useState(250);
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data fallback
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
      _id: 'mock-4',
      nom: 'Bilan de Santé Pédiatrique',
      description: 'Examen complet de croissance pour enfant avec conseils de vaccination et alimentation par un pédiatre agréé.',
      prix: 90,
      categorie: 'clinique',
      prestataire: { nom: 'Clinique Pédiatrique du Lac', adresse: 'Rue du Lac Victoria, Les Berges du Lac, Tunis', note: 4.9 }
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
    },
    {
      _id: 'mock-9',
      nom: 'Chambre Double Vue Mer',
      description: 'Séjour d’une nuit avec petit-déjeuner inclus dans une chambre luxueuse avec vue panoramique sur la mer Méditerranée.',
      prix: 180,
      categorie: 'hotel',
      prestataire: { nom: 'Hôtel El Mouradi Palm Marina', adresse: 'Zone Touristique Port El Kantaoui, Sousse', note: 4.8 }
    }
  ];

  // Sync state with URL params changes
  useEffect(() => {
    const params = getQueryParams();
    setSearchTerm(params.query);
    setSelectedCategory(params.category);
  }, [location.search]);

  // Fetch from backend
  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const response = await fetch('/services');
        if (response.ok) {
          const data = await response.json();
          if (data.services && data.services.length > 0) {
            setServices(data.services);
          } else {
            setServices(mockServices);
          }
        } else {
          setServices(mockServices);
        }
      } catch (err) {
        console.warn('Failed to load services from backend, using fallbacks');
        setServices(mockServices);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Handle local filtering
  useEffect(() => {
    let result = [...services];

    // Filter by category
    if (selectedCategory) {
      result = result.filter(s => s.categorie?.toLowerCase() === selectedCategory.toLowerCase());
    }

    // Filter by keyword (service name, description, category, or provider name)
    if (searchTerm) {
      const keyword = searchTerm.toLowerCase();
      result = result.filter(
        s => s.nom?.toLowerCase().includes(keyword) || 
             s.description?.toLowerCase().includes(keyword) ||
             s.categorie?.toLowerCase().includes(keyword) ||
             s.prestataire?.nom?.toLowerCase().includes(keyword)
      );
    }

    // Filter by price
    result = result.filter(s => s.prix <= priceLimit);

    setFilteredServices(result);
  }, [searchTerm, selectedCategory, priceLimit, services]);

  const categories = [
    { id: '', label: 'Toutes les catégories', icon: Sparkles },
    { id: 'medecin', label: 'Médecins', icon: Stethoscope },
    { id: 'centre de beaute', label: 'Beauté', icon: Scissors },
    { id: 'restaurant', label: 'Restaurants', icon: Utensils },
    { id: 'clinique', label: 'Cliniques', icon: Shield },
    { id: 'sport', label: 'Sport & Fitness', icon: Dumbbell },
    { id: 'auto', label: 'Services Auto', icon: Car },
    { id: 'artisan', label: 'Artisans & Maison', icon: Wrench },
    { id: 'loisir', label: 'Loisirs & Photos', icon: Camera },
    { id: 'hotel', label: 'Hôtels', icon: Hotel }
  ];

  return (
    <div className="container animate-fade-in">
      <div style={{ marginBottom: '32px', textAlign: 'left' }}>
        <h1 style={{ fontSize: '2.25rem', marginBottom: '8px' }}>Explorer nos services</h1>
        <p>Découvrez les prestataires disponibles et planifiez votre rendez-vous en ligne sur Wakti.</p>
      </div>

      {/* Main Grid: Sidebar + Results */}
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '32px' }} className="search-layout">
        <style>{`
          @media (max-width: 900px) {
            .search-layout {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>

        {/* Sidebar Filters */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Category Filter */}
          <div className="card" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
              <Filter size={18} style={{ color: 'var(--primary)' }} />
              Catégories
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '380px', overflowY: 'auto', paddingRight: '4px' }}>
              {categories.map(cat => {
                const Icon = cat.icon;
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className="btn"
                    style={{
                      justifyContent: 'flex-start',
                      backgroundColor: isSelected ? 'var(--primary-light)' : 'transparent',
                      color: isSelected ? 'var(--primary)' : 'var(--text-main)',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      fontSize: '0.9rem',
                      fontWeight: isSelected ? '700' : '500',
                      border: 'none',
                      textAlign: 'left'
                    }}
                  >
                    <Icon size={16} style={{ flexShrink: 0, color: isSelected ? 'var(--primary)' : 'var(--text-muted)' }} />
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Filter */}
          <div className="card" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
              <SlidersHorizontal size={18} style={{ color: 'var(--primary)' }} />
              Budget Maximum
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left' }}>
              <input
                type="range"
                min="10"
                max="300"
                step="5"
                value={priceLimit}
                onChange={(e) => setPriceLimit(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--primary)', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, fontSize: '0.9rem' }}>
                <span>10 DT</span>
                <span style={{ color: 'var(--primary)', fontSize: '1.05rem', fontWeight: 800 }}>{priceLimit} DT</span>
                <span>300 DT</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Results Area */}
        <main style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Top Search Input Box */}
          <div className="glass" style={{ borderRadius: 'var(--radius-md)', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <SearchIcon size={20} style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Rechercher par service, mot-clé ou prestataire..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                border: 'none',
                background: 'transparent',
                width: '100%',
                fontSize: '1rem',
                color: 'var(--text-main)',
                padding: '12px 0'
              }}
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')} 
                style={{ border: 'none', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', fontWeight: 700 }}
              >
                Vider
              </button>
            )}
          </div>

          {/* Service Listing */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px' }}>
              <div style={{ display: 'inline-block', width: '50px', height: '50px', border: '5px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
              <p style={{ marginTop: '20px', color: 'var(--text-muted)' }}>Recherche de prestations disponibles...</p>
            </div>
          ) : filteredServices.length > 0 ? (
            <div>
              <p style={{ textAlign: 'left', marginBottom: '16px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Nous avons trouvé <strong>{filteredServices.length}</strong> service{filteredServices.length > 1 ? 's' : ''} correspondant à vos critères.
              </p>
              <div className="grid-3">
                {filteredServices.map(service => (
                  <ServiceCard key={service._id || service.id} service={service} />
                ))}
              </div>
            </div>
          ) : (
            <div className="card" style={{ padding: '60px 20px', textAlign: 'center', backgroundColor: 'var(--surface)' }}>
              <h3 style={{ marginBottom: '12px', fontSize: '1.35rem' }}>Aucun service trouvé</h3>
              <p style={{ maxWidth: '400px', margin: '0 auto 24px auto', fontSize: '0.95rem' }}>
                Essayez de modifier vos filtres, de vider la recherche textuelle ou de sélectionner une autre catégorie.
              </p>
              <button onClick={() => { setSearchTerm(''); setSelectedCategory(''); setPriceLimit(250); }} className="btn btn-primary">
                Réinitialiser les filtres
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Search;
