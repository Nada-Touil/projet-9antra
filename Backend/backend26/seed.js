const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/user.model');
const Service = require('./models/service.model');

dotenv.config();

const seed = async () => {
  try {
    const uri = process.env.MONGOURI || process.env.MONGO_URI;
    if (!uri) {
      throw new Error('Aucune URI MongoDB trouvée dans les variables d’environnement.');
    }

    console.log('Connexion à la base de données...');
    await mongoose.connect(uri);
    console.log('Connexion réussie.');

    // 1. Nettoyer les collections
    console.log('Nettoyage des collections...');
    await User.deleteMany({});
    await Service.deleteMany({});
    console.log('Collections nettoyées.');

    // 2. Définir les prestataires
    console.log('Création des prestataires...');
    
    // Générer des ObjectIds à l'avance pour lier proprement les prestataires et leurs services
    const providerIds = {
      salma: new mongoose.Types.ObjectId(),
      elyes: new mongoose.Types.ObjectId(),
      amel: new mongoose.Types.ObjectId(),
      pirate: new mongoose.Types.ObjectId(),
      jeld: new mongoose.Types.ObjectId(),
      mouradi: new mongoose.Types.ObjectId(),
      nirvana: new mongoose.Types.ObjectId(),
    };

    const prestataires = [
      {
        _id: providerIds.salma,
        id: 'prest-salma',
        nom: 'Dr. Salma Touil',
        email: 'salma@wakti.tn',
        telephone: '71900100',
        mdp: 'Abc12345',
        role: 'prestataire',
        categorie: 'medecin',
        adresse: 'Avenue Habib Bourguiba, Tunis',
        latitude: 36.8065,
        longitude: 10.1815,
        note: 4.8,
        isValidatedPrestataire: true,
        statutPrestataire: 'valide',
        services: []
      },
      {
        _id: providerIds.elyes,
        id: 'prest-elyes',
        nom: 'Dr. Elyes Gharbi (Cardiologue)',
        email: 'elyes@wakti.tn',
        telephone: '71800200',
        mdp: 'Abc12345',
        role: 'prestataire',
        categorie: 'medecin',
        adresse: 'Centre Médical Les Berges du Lac 2, Tunis',
        latitude: 36.8329,
        longitude: 10.2635,
        note: 4.9,
        isValidatedPrestataire: true,
        statutPrestataire: 'valide',
        services: []
      },
      {
        _id: providerIds.amel,
        id: 'prest-amel',
        nom: 'Restaurant El Amel',
        email: 'amel@wakti.tn',
        telephone: '73222333',
        mdp: 'Abc12345',
        role: 'prestataire',
        categorie: 'restaurant',
        adresse: 'Port El Kantaoui, Sousse',
        latitude: 35.8942,
        longitude: 10.5983,
        note: 4.6,
        isValidatedPrestataire: true,
        statutPrestataire: 'valide',
        services: []
      },
      {
        _id: providerIds.pirate,
        id: 'prest-pirate',
        nom: 'Le Pirate Restaurant',
        email: 'pirate@wakti.tn',
        telephone: '73444555',
        mdp: 'Abc12345',
        role: 'prestataire',
        categorie: 'restaurant',
        adresse: 'La Falaise, Monastir',
        latitude: 35.7780,
        longitude: 10.8262,
        note: 4.7,
        isValidatedPrestataire: true,
        statutPrestataire: 'valide',
        services: []
      },
      {
        _id: providerIds.jeld,
        id: 'prest-jeld',
        nom: 'Dar El Jeld Hotel & Spa',
        email: 'jeld@wakti.tn',
        telephone: '71560916',
        mdp: 'Abc12345',
        role: 'prestataire',
        categorie: 'hotel',
        adresse: 'Rue Dar El Jeld, La Médina, Tunis',
        latitude: 36.8001,
        longitude: 10.1695,
        note: 4.9,
        isValidatedPrestataire: true,
        statutPrestataire: 'valide',
        services: []
      },
      {
        _id: providerIds.mouradi,
        id: 'prest-mouradi',
        nom: 'El Mouradi Palm Marina',
        email: 'mouradi@wakti.tn',
        telephone: '73348600',
        mdp: 'Abc12345',
        role: 'prestataire',
        categorie: 'hotel',
        adresse: 'Zone Touristique El Kantaoui, Sousse',
        latitude: 35.9015,
        longitude: 10.6033,
        note: 4.5,
        isValidatedPrestataire: true,
        statutPrestataire: 'valide',
        services: []
      },
      {
        _id: providerIds.nirvana,
        id: 'prest-nirvana',
        nom: 'Nirvana Spa & Beauté',
        email: 'nirvana@wakti.tn',
        telephone: '70800900',
        mdp: 'Abc12345',
        role: 'prestataire',
        categorie: 'centre de beaute',
        adresse: 'Avenue Hédi Nouira, Ennasr 2, Tunis',
        latitude: 36.8488,
        longitude: 10.1558,
        note: 4.8,
        isValidatedPrestataire: true,
        statutPrestataire: 'valide',
        services: []
      }
    ];

    // 3. Définir les services polymorphiques (consultations, tables, chambres, soins)
    console.log('Création des services...');
    const servicesData = [
      // Dr. Salma (Médecin des yeux - Ophtalmologue)
      {
        id: 'ser-salma-1',
        nom: 'Consultation Ophtalmologie & Examen des Yeux',
        description: 'Bilan complet de la vue, mesure de la tension oculaire, ordonnance lunettes/lentilles et examen du fond d’œil.',
        prix: 75,
        categorie: 'medecin',
        prestataire: providerIds.salma
      },
      // Dr. Elyes (Cardiologue)
      {
        id: 'ser-elyes-1',
        nom: 'Consultation Cardiologie & Électrocardiogramme (ECG)',
        description: 'Examen clinique cardiovasculaire complet, enregistrement ECG au repos et conseils de prévention.',
        prix: 100,
        categorie: 'medecin',
        prestataire: providerIds.elyes
      },
      // Restaurant El Amel (Tables)
      {
        id: 'ser-amel-t1',
        nom: 'Table 1 (2 personnes - Près de la fenêtre)',
        description: 'Table intimiste idéale pour les couples, offrant une vue dégagée sur le port.',
        prix: 0,
        categorie: 'restaurant',
        prestataire: providerIds.amel
      },
      {
        id: 'ser-amel-t2',
        nom: 'Table 2 (4 personnes - En terrasse)',
        description: 'Grande table en extérieur sous la pergola, idéale pour les repas de famille ou d’amis.',
        prix: 0,
        categorie: 'restaurant',
        prestataire: providerIds.amel
      },
      {
        id: 'ser-amel-t3',
        nom: 'Table 3 (6 personnes - Salon Privé)',
        description: 'Espace fermé et discret pour réunions d’affaires ou événements familiaux.',
        prix: 15, // Booking fee for private lounge
        categorie: 'restaurant',
        prestataire: providerIds.amel
      },
      // Restaurant Le Pirate (Tables)
      {
        id: 'ser-pirate-t1',
        nom: 'Table 1 (2 personnes - Sur la Falaise)',
        description: 'Vue panoramique sur la mer Méditerranée, coucher de soleil garanti.',
        prix: 0,
        categorie: 'restaurant',
        prestataire: providerIds.pirate
      },
      {
        id: 'ser-pirate-t2',
        nom: 'Table 2 (4 personnes - Côté Port)',
        description: 'Table conviviale avec vue sur les bateaux.',
        prix: 0,
        categorie: 'restaurant',
        prestataire: providerIds.pirate
      },
      // Dar El Jeld Hotel (Chambres)
      {
        id: 'ser-jeld-c1',
        nom: 'Suite Junior (Vue sur le Patio Tunisien)',
        description: 'Suite traditionnelle de 35m² décorée d’arabesques, grand lit king size, salle de bain en marbre et vue sur le patio intérieur fleuri.',
        prix: 280,
        categorie: 'hotel',
        prestataire: providerIds.jeld
      },
      {
        id: 'ser-jeld-c2',
        nom: 'Suite Royale (Vue panoramique sur la Médina)',
        description: 'Suite majestueuse de 65m² avec salon privé séparé, jacuzzi et terrasse privée offrant une vue unique sur les minarets de la Médina.',
        prix: 450,
        categorie: 'hotel',
        prestataire: providerIds.jeld
      },
      // El Mouradi Palm Marina (Chambres)
      {
        id: 'ser-mouradi-c1',
        nom: 'Chambre Standard (Vue Jardin)',
        description: 'Chambre confortable de 25m² avec balcon ou terrasse donnant sur les jardins suspendus et les piscines de l’hôtel.',
        prix: 130,
        categorie: 'hotel',
        prestataire: providerIds.mouradi
      },
      {
        id: 'ser-mouradi-c2',
        nom: 'Chambre Supérieure (Vue Frontale Mer)',
        description: 'Chambre avec balcon situé en front de mer direct. Accès gratuit aux installations du spa inclus.',
        prix: 190,
        categorie: 'hotel',
        prestataire: providerIds.mouradi
      },
      // Nirvana Spa (Soins)
      {
        id: 'ser-nirvana-1',
        nom: 'Massage Californien Relaxant (60 min)',
        description: 'Massage corporel complet aux huiles chaudes de jasmin, idéal pour évacuer les tensions musculaires et le stress.',
        prix: 60,
        categorie: 'centre de beaute',
        prestataire: providerIds.nirvana
      },
      {
        id: 'ser-nirvana-2',
        nom: 'Soin Facial Hydratant Éclat d’Orient',
        description: 'Nettoyage de peau aux vapeurs d’eau de rose, gommage doux et masque à l’argile blanche pour réhydrater en profondeur.',
        prix: 45,
        categorie: 'centre de beaute',
        prestataire: providerIds.nirvana
      }
    ];

    const seededServices = await Service.insertMany(servicesData);
    console.log(`${seededServices.length} services créés avec succès.`);

    // 4. Mettre à jour les prestataires avec les IDs des services créés
    for (const service of seededServices) {
      const provider = prestataires.find(p => p._id.toString() === service.prestataire.toString());
      if (provider) {
        provider.services.push(service._id);
      }
    }

    // 5. Créer les clients et admins
    console.log('Création des clients et admins...');
    const clients = [
      {
        id: 'client-nour',
        nom: 'Nour Ben Ali',
        email: 'nour@client.tn',
        telephone: '98111222',
        mdp: 'Test1234', // valid password format (caps, lower, number)
        role: 'client',
        reservations: [],
        avis: []
      },
      {
        id: 'client-yassine',
        nom: 'Yassine Kefi',
        email: 'yassine@client.tn',
        telephone: '98333444',
        mdp: 'Test1234',
        role: 'client',
        reservations: [],
        avis: []
      }
    ];

    const admin = {
      id: 'admin-wakti',
      nom: 'Administrateur Wakti',
      email: 'admin@wakti.tn',
      telephone: '71500500',
      mdp: 'Admin1234',
      role: 'admin'
    };

    await User.insertMany([...prestataires, ...clients, admin]);
    console.log('Utilisateurs créés avec succès.');

    console.log('🎉 Seed terminé avec succès ! Base de données Wakti opérationnelle.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Erreur lors du seed :', err);
    process.exit(1);
  }
};

seed();
