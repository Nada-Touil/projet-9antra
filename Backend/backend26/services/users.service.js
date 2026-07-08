const User = require('../models/user.model');
const reservationService = require('./reservations.service');
const avisService = require('./avis.service');

module.exports.createUser = async (userData) => {
  const user = new User(userData);
  return await user.save();
};

module.exports.faireReservation = async (userId, reservationData) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('Utilisateur non trouvé');
  if (user.role !== 'client') throw new Error('Seul un client peut faire une réservation');

  const data = {
    ...reservationData,
    id: reservationData.id || `res-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  };
  // ensure reservation stores client reference
  const dataWithClient = { ...data, client: user._id };

  const reservation = await reservationService.createReservation(dataWithClient);
  user.reservations.push(reservation._id);
  await user.save();
  return reservation;
};

module.exports.annulerReservation = async (userId, reservationId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('Utilisateur non trouvé');
  if (user.role !== 'client') throw new Error('Seul un client peut annuler une réservation');

  const reservation = await reservationService.deleteReservation(reservationId);
  if (!reservation) return null;

  user.reservations.pull(reservation._id);
  await user.save();
  return reservation;
};

module.exports.laisserAvis = async (userId, avisData) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('Utilisateur non trouvé');
  if (user.role !== 'client') throw new Error('Seul un client peut laisser un avis');

  const created = await avisService.createAvis({ ...avisData, client: userId });
  return created;
};

module.exports.voirHistorique = async (userId) => {
  return await User.findById(userId)
    .populate('reservations')
    .populate('avis');
};

module.exports.utiliserChatbot = async (userId, message) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('Utilisateur non trouvé');

  const response = `Chatbot: Je suis là pour vous aider. Vous avez demandé : "${message}"`;
  user.chatbotHistory.push({ message, response });
  await user.save();
  return { message, response };
};

module.exports.getAllUsers = async () => {
  return await User.find();
};

module.exports.getUserById = async (id) => {
  return await User.findById(id);
};

module.exports.updateUser = async (id, updateData) => {
  return await User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
};

module.exports.deleteUser = async (id) => {
  return await User.findByIdAndDelete(id);
};  