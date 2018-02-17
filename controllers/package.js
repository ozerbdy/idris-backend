const _ = require('lodash');
const is = require('is_js');
const Joi = require('joi');
const Promise = require('bluebird');
const TypeHelpers = require('../helpers/typeHelpers');
const PackageRepository = require('../db/PackageRepository');
const ResponseHelpers = require('../helpers/responseHelpers');
const TransportationRepository = require('../db/TransportationRepository');
const Constants = require('../constants/constants');

module.exports.list = async (req, res) => {
    const packages = await PackageRepository.getAll();
    return res.send({
        status: ResponseHelpers.getBasicResponseObject(Constants.SuccessInfo),
        packages: packages
    });
};

module.exports.validatePickUp = function(req, res, next){
    res.locals.schema = {
        packageId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
    };
    next();
};
module.exports.pickUp = async (req, res) => {
    const user = res.locals.user;
    const userId = user._id;
    const packageId = req.body.packageId;

    try{
        const transportation = await TransportationRepository.getAssigned(userId);
        if(TypeHelpers.isNotEmptyObject(transportation) && TypeHelpers.isNotEmptyArray(transportation.packages)){
            const packages = transportation.packages;
            let claimIndex = 0;
            const isSync = _.every(packages, (eachPackage, packageIndex) => {
                if(eachPackage._id.toString() === packageId && eachPackage.state === Constants.PackageState.claimed){
                    claimIndex = packageIndex;
                    return true;
                }
                else if(eachPackage.state === Constants.PackageState.beingCarried){
                    return true;
                }
                return false
            });
            if(isSync){//Happy path
                packages[claimIndex].state = Constants.PackageState.beingCarried;

                const [packageUpdateResult, transactionUpdateResult] = await Promise.all([
                    PackageRepository.updateState(packageId, Constants.PackageState.beingCarried),
                    TransportationRepository.updatePackageStatuses(userId, packages)
                ]);

                return res.send({
                    status: ResponseHelpers.getBasicResponseObject(Constants.SuccessInfo),
                    package: packageUpdateResult.value
                });

            }else{
                return ResponseHelpers.sendBasicResponse(res, Constants.ErrorInfo.Transportation.WrongPickUpOrder);
            }
        }else{
            return ResponseHelpers.sendBasicResponse(res, Constants.ErrorInfo.Transportation.NotFound);
        }
    }catch(err){
        return ResponseHelpers.sendBasicResponse(res, Constants.ErrorInfo.MongoError, err);
    }


};