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
    console.log('User Capacty', userCapacity);
    try{
        //TODO Get only relevant packages according to weight and space capacity of user from db (DONE)
        //TODO Then sort the relevant packages by distances (DONE)
        //TODO Create and store transportation mission (IN PROGRESS)
        //TODO Mark packages as claimed for not them to be picked by another user
        //TODO Send mission to client

        const packages = await PackageRepository.getPortablesByUnits(userCapacity.weight, userCapacity.pieces);

        const distanceResults = await Promise.map(packages, (eachPackage) => {
            const distanceQuery = {
                origins: userCoordinates,
                destinations: eachPackage.coordinates
            };
            return GoogleMapsClient.distanceMatrix(distanceQuery).asPromise();
        });

        if(distanceResults.length !== packages.length) throw new Error('Distance results do not match');

        _.forEach(packages, (eachPackage, packageIndex) => {
            distanceResults[packageIndex].package = eachPackage;
        });

        const filteredDistanceResults = _.filter(distanceResults, (distanceResultObject)=>{
            const resultStatus = distanceResultObject.json.rows[0].elements[0].status;
            return resultStatus ===  Constants.GOOGLE_MAPS_STATUS.ok && resultStatus !== Constants.GOOGLE_MAPS_STATUS.noResult;
        });

        const packageDistancesArray = _.map(filteredDistanceResults, (distanceResultObject)=>{
            const distanceJSON = distanceResultObject.json;
            const eachPackage = distanceResultObject.package;
            const elements = distanceJSON.rows[0].elements[0];
            const distance = elements.distance.value;
            const duration = elements.duration.value;
            return {
                package: eachPackage,
                travel: {
                    distance: distance,
                    duration: duration
                }
            };
        });

        const packagesDistancesArraySortedByDuration = _.sortBy(packageDistancesArray,(packageDistanceObject) => {
            return packageDistanceObject.travel.duration;
        });

        let packagesToCarry = [];
        let userRemainingWeight = userCapacity.weight;
        let userRemainingNumberOfPieces = userCapacity.pieces;

        _.each(packagesDistancesArraySortedByDuration, (packageDistance) => {
            const packageWeight = packageDistance.package.capacity.weight;
            const packagePieces = packageDistance.package.capacity.pieces;
            if(userRemainingWeight - packageWeight >= 0 && userRemainingWeight - packagePieces >= 0){
                packagesToCarry.push(packageDistance);
                userRemainingWeight -= packageWeight;
                userRemainingNumberOfPieces -= packagePieces;
            }else{
                return false; //Exit iteration!
            }

        });

        return res.send({
            status: ResponseHelpers.getBasicResponseObject(Constants.SuccessInfo),
            packages: packagesToCarry,
            gatheringPoint: Constants.GATHERING_POINT_COORDINATES
        });

    }catch(err){
        console.error(err);
    }
};