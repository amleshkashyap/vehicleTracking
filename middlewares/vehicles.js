module.exports = {
    validateVehicle: function (req, res, next) {
	let requestBody = null;
	if(req.body.requestBody) {
	    requestBody = req.body.requestBody[0] || null;
	};
	if(requestBody === null) {
	    return res.status(400).send({"message": "Request body is null"});
	}
	const name = requestBody.name || null;
	const owner_number = requestBody.owner_contact || null;
	const startAt = requestBody.coordinates || [];
	const registration = requestBody.registration || null;

	if(name === null || owner_number === null || startAt.length === 0 || registration === null) {
	    return res.status(400).send({"message": "One of the parameters is not present"});
	}

	res.locals.data = {
	    name: name,
	    owner_number: owner_number,
	    coordinates: startAt,
	    registration: registration
	};

	return next();
    },

    validateCoordinates: function (req, res, next) {
	const lat = req.query.lat || null;
	const lng = req.query.lng || null;
	const requestMethod = req.method;

	if(lat === null || lng === null) {
	    return res.status(400).send({"message": "Lat/Lng is null"});
	}

	res.locals.data = {
	    lat: parseFloat(lat),
	    lng: parseFloat(lng)
	};

	if(req.method === 'PUT') {
	    const regNum = req.query.regNum;
	    if(regNum === null) {
		return res.status(400).send({"message": "Registration number is null"});
	    }

	    res.locals.data['regNum'] = regNum;
	}

	return next();
    }
};
