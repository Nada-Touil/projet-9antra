const userService = require('../services/users.service');
const emailService = require('../services/email.service');
const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const maxAge = 24 * 60 * 60;

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
    expiresIn: maxAge,
  });
};

const buildUserPayload = (body) => {
  const nom = body.nom || `${body.firstname || ''} ${body.lastname || ''}`.trim();
  const mdp = body.mdp || body.password;

  let assignedRole = body.role || 'client';
  const adminEmail = process.env.ADMIN_EMAIL || 'nadaatouil00@gmail.com';
  
  if (body.email && body.email.toLowerCase().trim() === adminEmail.toLowerCase().trim()) {
    assignedRole = 'admin';
  } else if (assignedRole === 'admin') {
    assignedRole = 'client';
  }

  return {
    id: body.id,
    nom: nom || body.nom || 'Utilisateur',
    email: body.email,
    telephone: body.telephone || body.phone,
    mdp,
    role: assignedRole,
    date: body.date,
    categorie: body.categorie,
    adresse: body.adresse || body.address,
    latitude: body.latitude,
    longitude: body.longitude,
    note: body.note,
    services: body.services,
    reservations: body.reservations,
    avis: body.avis,
  };
};

const sendWelcomeEmail = async (user) => {
  if (!user?.email) return;
  try {
    await emailService.sendMail({
      to: user.email,
      subject: 'Bienvenue sur notre plateforme! 🎉',
      text: `Bonjour ${user.nom || 'utilisateur'},\n\nBienvenue sur notre plateforme ! Nous sommes ravis de vous compter parmi nous.\n\nVos informations:\n- Email: ${user.email}\n- Nom: ${user.nom}\n\nSi vous avez des questions, n\'hésitez pas à nous contacter.\n\nCordialement,\nL'équipe`,
    });
  } catch (mailError) {
    console.error('Erreur envoi email de bienvenue:', mailError);
  }
};

const sendAdminNotification = async (user) => {
  try {
    await emailService.sendMail({
      to: process.env.ADMIN_EMAIL,
      subject: 'Nouveau utilisateur inscrit ✅',
      text: `Un nouvel utilisateur vient de s'inscrire !\n\nDétails:\n- Email: ${user.email}\n- Nom: ${user.nom}\n- Téléphone: ${user.telephone || 'Non fourni'}\n- Date d'inscription: ${new Date().toLocaleString()}`,
    });
  } catch (adminMailError) {
    console.error('Erreur envoi email admin:', adminMailError);
  }
};

module.exports.createUser = async (req, res) => {
  try {
    const userData = buildUserPayload(req.body);

    if (!userData.email || !userData.mdp) {
      return res.status(400).json({ error: 'Les champs email et mdp sont requis' });
    }

    const user = await userService.createUser(userData);
    await sendWelcomeEmail(user);
    await sendAdminNotification(user);

    res.status(201).json({ message: 'Utilisateur créé avec succès', user });
  } catch (error) {
    if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
      return res.status(409).json({ error: 'Cet email est déjà utilisé.' });
    }
    res.status(500).json({ error: error.message || 'Erreur serveur' });
  }
};

module.exports.createPrestataire = async (req, res) => {
  req.body.role = 'prestataire';
  return module.exports.createUser(req, res);
};

module.exports.createClient = async (req, res) => {
  req.body.role = 'client';
  return module.exports.createUser(req, res);
};

module.exports.createAdmin = async (req, res) => {
  req.body.role = 'admin';
  return module.exports.createUser(req, res);
};

module.exports.getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json({ message: 'Tous les utilisateurs', users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports.faireReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const reservation = await userService.faireReservation(id, req.body);
    res.status(201).json({ message: 'Réservation créée', reservation });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
module.exports.logoutUser = (req, res) => {
  res.cookie('jwt_token', '', { maxAge: 1 });
  res.status(200).json({ message: 'Utilisateur déconnecté' });
};
module.exports.annulerReservation = async (req, res) => {
  try {
    const { id, reservationId } = req.params;
    const reservation = await userService.annulerReservation(id, reservationId);
    if (!reservation) return res.status(404).json({ error: 'Réservation non trouvée' });
    res.json({ message: 'Réservation annulée', reservation });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports.laisserAvis = async (req, res) => {
  try {
    const { id } = req.params;
    const avis = await userService.laisserAvis(id, req.body);
    res.status(201).json({ message: 'Avis laissé', avis });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports.voirHistorique = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userService.voirHistorique(id);
    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });
    res.json({ message: 'Historique utilisateur', reservations: user.reservations, avis: user.avis, chatbotHistory: user.chatbotHistory });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports.utiliserChatbot = async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'Le message est requis' });
    const result = await userService.utiliserChatbot(id, message);
    res.json({ message: 'Chatbot utilisé', result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userService.getUserById(id);

    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    res.status(200).json({ message: 'Utilisateur trouvé', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    delete updateData._id;

    const user = await userService.updateUser(id, updateData);

    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    res.status(200).json({ message: 'Utilisateur mis à jour', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userService.deleteUser(id);

    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    res.status(200).json({ message: 'Utilisateur supprimé avec succès', user });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Erreur serveur' });
  }
};

module.exports.loginUser = async (req, res) => {
  try {
    const { email, mdp } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Utilisateur non trouvé' });
    }

    const match = await bcrypt.compare(mdp, user.mdp);
    if (!match) {
      return res.status(401).json({ error: 'Mot de passe invalide' });
    }

    const token = createToken(user._id);
    res.cookie('jwt_token', token, { httpOnly: true, maxAge: maxAge * 60 });

    res.status(200).json({ message: 'Utilisateur connecté', data: user });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

module.exports.logoutUser = (req, res) => {
  res.cookie('jwt_token', '', { maxAge: 1 });
  res.status(200).json({ message: 'Utilisateur déconnecté' });
};