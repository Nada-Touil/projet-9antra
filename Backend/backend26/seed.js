const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/user.model');

dotenv.config();

const seed = async () => {
  await mongoose.connect(process.env.MONGOURI);

  await User.deleteMany({});

  const prestataires = [
    {
      id: 'prest-001',
      nom: 'Dr. Salma',
      email: 'salma.prestataire@example.com',
      telephone: '221000000',
      mdp: 'Abc12345',
      role: 'prestataire',
      categorie: 'médecin',
      adresse: 'Tunis',
      latitude: 36.8,
      longitude: 10.18,
      note: 4.8,
      services: [],
    },
    {
      id: 'prest-002',
      nom: 'Restaurant El Amel',
      email: 'amel.prestataire@example.com',
      telephone: '221111111',
      mdp: 'Abc12345',
      role: 'prestataire',
      categorie: 'restaurant',
      adresse: 'Sousse',
      latitude: 35.8,
      longitude: 10.63,
      note: 4.6,
      services: [],
    },
  ];

  const clients = [
    {
      id: 'client-001',
      nom: 'Nour Ben Ali',
      email: 'nour.client@example.com',
      telephone: '221222222',
      mdp: 'Abc12345',
      role: 'client',
      reservations: [],
      avis: [],
    },
    {
      id: 'client-002',
      nom: 'Yassine Kefi',
      email: 'yassine.client@example.com',
      telephone: '221333333',
      mdp: 'Abc12345',
      role: 'client',
      reservations: [],
      avis: [],
    },
  ];

  const admin = {
    id: 'admin-001',
    nom: 'Admin Principal',
    email: 'admin@example.com',
    telephone: '221444444',
    mdp: 'Abc12345',
    role: 'admin',
  };

  await User.insertMany([...prestataires, ...clients, admin]);

  console.log('Seed terminé avec succès.');
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
