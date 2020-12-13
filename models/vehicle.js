const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    name: { type: String },
    registration: { type: String, unique: true },
    owner_contact: { type: Number },
    last_updated: { type: Date },
    location: {
	"type": { type: String, default: 'Point' },
	coordinates: [Number]
    },
    status: { type: String, default: 'active' }
}, {
    collection: 'vehicles'
});

const VehicleModel = new mongoose.model('Vehicle', vehicleSchema);

module.exports = {
    VehicleModel
};
