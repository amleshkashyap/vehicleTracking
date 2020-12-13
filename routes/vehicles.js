var express = require('express');
var router = express.Router();
var Vehicles = require('../controllers/vehicles');
var Middlewares = require('../middlewares/vehicles');

router
    .get('/nearby', Middlewares.validateCoordinates, Vehicles.getNearbyVehicles)
    .put('/update', Middlewares.validateCoordinates, Vehicles.updateVehicleLocation)
    .post('/add', Middlewares.validateVehicle, Vehicles.addVehicle);

module.exports = router;
