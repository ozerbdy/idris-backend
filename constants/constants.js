module.exports.ErrorInfo = {
    RequestBodyValidationFailed: {
        message: 'Request body validation failed',
        code: 1
    },
    MongoError: {
        message: 'Mongo operation failed',
        code: 2
    }
};

module.exports.SuccessInfo = {
    message: 'Success',
    code: 0
};

module.exports.CollectionName = {
    users: 'users',
    packages: 'packages',
    transportations: 'transportations'
};

module.exports.PackageState = {
    available: 'available',
    claimed: 'claimed',
    beingCarried: 'beingCarried',
    delivered: 'delivered'
};

module.exports.GATHERING_POINT_COORDINATES = {
    latitude: 41.0571701,
    longitude: 29.0124413
};

module.exports.TOKEN_REQUEST_HEADER_NAME = 'token';