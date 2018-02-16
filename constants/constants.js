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

module.exports.CollectionNames = {
    users: 'users',
    packages: 'packages',
    transportations: 'transportations'
};