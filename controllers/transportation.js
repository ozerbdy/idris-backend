const Promise = require('bluebird'),
    _ = require('lodash'),
    PackageRepository = require('../db/PackageRepository'),
    ResponseHelpers = require('../helpers/responseHelpers'),
    GoogleMapsClient = require('../helpers/googleMapsHelpers').client,
    Constants = require('../constants/constants');

module.exports.apply = async (req, res) => {

    const user = req.user;
    const userCoordinates = user.coordinates;
    const userCapacity = user.capacity;
    try{
        //TODO Get only relevant packages according to weight and space capacity of user from db
        //TODO Then sort the relevant packages by distances
        //TODO Create and store transportation mission
        //TODO Mark packages as claimed for not them to be picked by another user
        //TODO Send mission to client

        const packages = await PackageRepository.getPortablesByUnits(userCapacity.weight, userCapacity.pieces);

        res.send({
            status: ResponseHelpers.getBasicResponseObject(Constants.SuccessInfo),
            packages: packages,
            gatheringPoint: Constants.GATHERING_POINT_COORDINATES
        });

        const distanceResults = await Promise.map(packages, (eachPackage) => {
            const distanceQuery = {
                origins: userCoordinates,
                destinations: eachPackage.coordinates
            };
            return GoogleMapsClient.distanceMatrix(distanceQuery).asPromise();
        });

        console.log('distance result', JSON.stringify(distanceResults));

    }catch(err){
        console.error(err);
    }
};