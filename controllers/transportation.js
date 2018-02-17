const Promise = require('bluebird');
const _ = require('lodash');
const TypeHelpers = require('../helpers/typeHelpers');
const UserRepository = require('../db/UserRepository');
const PackageRepository = require('../db/PackageRepository');
const TransportationRepository = require('../db/TransportationRepository');
const GoogleMapsClient = require('../helpers/googleMapsHelpers').client;
const ResponseHelpers = require('../helpers/responseHelpers');
const Constants = require('../constants/constants');

module.exports.get = async (req, res) => {
    const user = res.locals.user;
    const userId = user._id;

    try{
        let transportation = await TransportationRepository.getAssigned(userId);
        if(TypeHelpers.isNotEmptyObject(transportation)){
            const packageIds = _.map(transportation.packages, (packageObject) => {
                return packageObject._id;
            });
            const packages = await PackageRepository.getByIds(packageIds);
            return res.send({
                status: ResponseHelpers.getBasicResponseObject(Constants.SuccessInfo),
                packages: packages,
                gatheringPoint: Constants.GATHERING_POINT_COORDINATES
            });
        }
        return ResponseHelpers.sendBasicResponse(res, Constants.ErrorInfo.MongoError);
    }catch(err){
        return ResponseHelpers.sendBasicResponse(res, Constants.ErrorInfo.MongoError, err);
    }
};

module.exports.apply = async (req, res) => {
    const user = res.locals.user;
    const userId = user._id;
    const userCoordinates = req.body.coordinates;
    const userCapacity = user.capacity;
    try{
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

        const packageObjectIds = _.map(packagesToCarry, (packageToCarry) => {
            return packageToCarry._id;
        });

        const packageTransportationObjects = _.map(packageObjectIds, (packageObjectId) => {
            return {
                _id: packageObjectId,
                state: Constants.PackageState.claimed
            };
        });

        await Promise.all([
            UserRepository.updateCoordinates(userId, userCoordinates.latitude, userCoordinates.longitude),
            PackageRepository.updateStates(packageObjectIds, Constants.PackageState.claimed),
            TransportationRepository.add(userId, packageTransportationObjects)
        ]);

        return res.send({
            status: ResponseHelpers.getBasicResponseObject(Constants.SuccessInfo),
            packages: packagesToCarry,
            gatheringPoint: Constants.GATHERING_POINT_COORDINATES
        });

    }catch(err){
        return ResponseHelpers.sendBasicResponse(res, Constants.ErrorInfo.MongoError, err);
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