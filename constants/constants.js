module.exports.ErrorInfo = {
    RequestBodyValidationFailed: {
        message: 'Request body validation failed',
        code: 1
    },
    MongoError: {
        message: 'Mongo operation failed',
        code: 2
    },
    AuthenticationFailed:{
        message: 'Authentication failed',
        code: 3
    },
    Transportation: {
        NotFound : {
            message: 'Transportation not found',
            code: 40
        },
        WrongPickUpOrder:{
            message: 'Wrong transportation pick up order',
            code: 41
        },
        CannotFinishYet:{
            message: 'Remaining packages to pick up, transportation cannot finish',
            code: 42
        }
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

module.exports.TransportationState = {
    assigned: 'assigned',
    finished: 'finished',
    cancelled: 'cancelled'
};

module.exports.GATHERING_POINT_COORDINATES = {
    latitude: 41.0571701,
    longitude: 29.0124413
};

module.exports.TOKEN_REQUEST_HEADER_NAME = 'token';

module.exports.GOOGLE_MAPS_STATUS = {
    ok: 'OK',
    noResult: 'ZERO_RESULTS'
};