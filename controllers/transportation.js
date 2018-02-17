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

        _.forEach(packages, (eachPackage, packageIndex) => {
            distanceResults[packageIndex].package = eachPackage;
        });

        const filteredDistanceResults = removeFailedResults(distanceResults);

        const packageDistancesArray = keepRelevantData(filteredDistanceResults);

        const packagesDistancesArraySortedByDuration = sortByTravelDuration(packageDistancesArray);

        let userRemainingWeight = userCapacity.weight;
        let userRemainingNumberOfPieces = userCapacity.pieces;
        const packagesToCarry = getPackagesInCarryLimits(packagesDistancesArraySortedByDuration, userRemainingWeight, userRemainingNumberOfPieces);

        return res.send({
            status: ResponseHelpers.getBasicResponseObject(Constants.SuccessInfo),
            packages: packagesToCarry,
            gatheringPoint: Constants.GATHERING_POINT_COORDINATES
        });

    }catch(err){
        console.error(err);
    }
};

function removeFailedResults(distanceResults){
    return _.filter(distanceResults, (distanceResultObject)=>{
        const resultStatus = distanceResultObject.json.rows[0].elements[0].status;
        return resultStatus ===  Constants.GOOGLE_MAPS_STATUS.ok && resultStatus !== Constants.GOOGLE_MAPS_STATUS.noResult;
    });
}

function keepRelevantData(distanceResults){
    return _.map(distanceResults, (distanceResultObject)=>{
        const distanceJSON = distanceResultObject.json;
        const eachPackage = distanceResultObject.package;
        const elements = distanceJSON.rows[0].elements[0];
        const distance = elements.distance.value;
        const duration = elements.duration.value;
        eachPackage.travel = {
            distance: distance,
            duration: duration
        };
        eachPackage.address = distanceJSON.destination_addresses[0];
        return eachPackage;
    });
}

function sortByTravelDuration(packageDistancesArray){
    return _.sortBy(packageDistancesArray,(packageDistanceObject) => {
        return packageDistanceObject.travel.duration;
    });
}

function getPackagesInCarryLimits(sortedPackages, weightLimit, pieceLimit){
    let packagesToCarry = [];
    let userRemainingWeight = weightLimit;
    let userRemainingNumberOfPieces = pieceLimit;

    _.each(sortedPackages, (packageDistance) => {
        const packageWeight = packageDistance.capacity.weight;
        const packagePieces = packageDistance.capacity.pieces;
        if(userRemainingWeight - packageWeight >= 0 && userRemainingWeight - packagePieces >= 0){
            packagesToCarry.push(packageDistance);
            userRemainingWeight -= packageWeight;
            userRemainingNumberOfPieces -= packagePieces;
        }else{
            return false; //Exit iteration!
        }
    });
    return packagesToCarry;
}