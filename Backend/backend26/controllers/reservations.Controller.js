const reservationService = require('../services/reservations.service');

// CREATE - Créer une nouvelle réservation
module.exports.createReservation = async (req, res) => {
  try {
    const { id, date, statut, prixTotal } = req.body;

    // Vérifier que les champs requis sont présents
    if (!id || !date || !statut || prixTotal === undefined) {
      return res.status(400).json({ error: 'Les champs id, date, statut et prixTotal sont requis' });
    }

    const reservation = await reservationService.createReservation({
      id,
      date,
      statut,
      prixTotal,
    });

    res.status(201).json({ message: 'Réservation créée avec succès', reservation });
  } catch (error) {
    if (error.code === 11000 && error.keyPattern && error.keyPattern.id) {
      return res.status(409).json({ error: 'Cet ID de réservation est déjà utilisé.' });
    }
    res.status(500).json({ error: error.message || 'Erreur serveur' });
  }
};

// READ - Récupérer toutes les réservations
module.exports.getAllReservations = async (req, res) => {
  try {
    const reservations = await reservationService.getAllReservations();
    res.status(200).json({ message: 'Toutes les réservations', reservations });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// READ - Récupérer une réservation par ID
module.exports.getReservationById = async (req, res) => {
  try {
    const { id } = req.params;
    const reservation = await reservationService.getReservationById(id);

    if (!reservation) {
      return res.status(404).json({ error: 'Réservation non trouvée' });
    }

    res.status(200).json({ message: 'Réservation trouvée', reservation });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE - Mettre à jour une réservation
module.exports.updateReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Empêcher la modification de l'ID MongoDB
    delete updateData._id;

    const reservation = await reservationService.updateReservation(id, updateData);

    if (!reservation) {
      return res.status(404).json({ error: 'Réservation non trouvée' });
    }

    res.status(200).json({ message: 'Réservation mise à jour', reservation });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE - Supprimer une réservation
module.exports.deleteReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const reservation = await reservationService.deleteReservation(id);

    if (!reservation) {
      return res.status(404).json({ error: 'Réservation non trouvée' });
    }

    res.status(200).json({ message: 'Réservation supprimée avec succès', reservation });
  } catch (error) {
    console.log('ERREUR COMPLETE:', error);
    res.status(500).json({ error: error.message || 'Erreur serveur' });
  }
};
