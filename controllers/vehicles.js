const to = require('await-to-js').default;
const mongoose = require('mongoose');
const { VehicleModel } = require('./../models/vehicle');

module.exports = {
    addVehicle: async function (req, res) {
	let vehicleObj = {
	    name: res.locals.data.name,
	    registration: res.locals.data.registration,
	    owner_contact: res.locals.data.owner_number,
	    location: {
		"type": 'Point',
		coordinates: res.locals.data.coordinates
	    },
	    last_updated: new Date(),
	    status: 'active'
	};
	const vehicle = new VehicleModel(vehicleObj);
	const [error, result] = await to(vehicle.save());
	if(error || !result) {
	    return res.status(400).send({"message": "Save Failed"});
	}

        return res.status(200).send({"message": "Save Successful"});
    },

    updateVehicleLocation: async function (req, res) {
	const find_query = {
	    registration: res.locals.data.regNum,
	    status: 'active'
	};

	const update_query = {
	    "$set": {
		"location.coordinates": [ res.locals.data.lng, res.locals.data.lat ],
		last_updated: new Date()
	    }
	};

	const [error, results] = await to(VehicleModel.findOneAndUpdate(find_query, update_query));

	if(error || !results) {
	    if(error) return res.status(400).send({"message": "Failed Update, " + error.toString()});
	    if(!results) return res.status(400).send({"message": "Didn't find the given vehicle"});
	}

	return res.status(200).send({"message": "Update Successful"});
    },

    getNearbyVehicles: function (req, res) {
	const find_query = {
	    $geoNear: {
		near: { type: "Point", coordinates: [ res.locals.data.lng, res.locals.data.lat ] },
		status: 'active',
		spherical: true,
		maxDistance: 200,
		distanceMultiplier: 1,
		distanceField: "calculated_distance",
		limit: 1000
	    }
	};

	let aggregate_query = [find_query, {$project: {registration: 1, owner_contact: 1, location: 1}}];
	console.log(JSON.stringify(aggregate_query));

	VehicleModel.aggregate(aggregate_query).exec(function (err, results) {
	    if(err || !results) {
		if(err) return res.status(400).send({"message": "Aggregation Failed, " + err.toString()});
		if(!results) return res.status(400).send({"message": "No results found"});
	    }

	    return res.status(200).send(results);
	});
    }
};
