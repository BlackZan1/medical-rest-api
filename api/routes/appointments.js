const { Router } = require('express');

// Controllers
const { 
    getAppointments, 
    postAppointment, 
    getAppointmentById ,
    deleteAppointmentById
} = require('../controllers/appointments');

// Init route
const router = Router();

// GET - get all appointments
router.get('/', getAppointments);

// POST - new appointment
router.post('/', postAppointment);

// GET - get appointment by id
router.get('/:id', getAppointmentById);

router.delete('/:id', deleteAppointmentById);

module.exports = router;