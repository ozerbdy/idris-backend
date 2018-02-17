const PackageRepository = require('../db/PackageRepository'),
    ResponseHelpers = require('../helpers/responseHelpers'),
    Constants = require('../constants/constants');

module.exports.list = async (req, res) => {
    const packages = await PackageRepository.getAll();
    return res.send({
        status: ResponseHelpers.getBasicResponseObject(Constants.SuccessInfo),
        packages: packages
    });
};