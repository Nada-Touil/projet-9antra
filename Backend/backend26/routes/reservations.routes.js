var express = require('express');
var router = express.Router();
const reservationController = require('../controllers/reservations.Controller');

// CREATE - Créer une nouvelle réservation
router.post('/', reservationController.createReservation);

// READ - Récupérer toutes les réservations
router.get('/', reservationController.getAllReservations);

// READ - Récupérer une réservation par ID
router.get('/:id', reservationController.getReservationById);

// UPDATE - Mettre à jour une réservation
router.put('/:id', reservationController.updateReservation);

// DELETE - Supprimer une réservation
router.delete('/:id', reservationController.deleteReservation);

module.exports = router;
