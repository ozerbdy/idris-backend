const is = require('is_js');
const ObjectID = require('mongodb').ObjectID;



module.exports = {
    isTrueBoolean(value){
        return is.existy(value) && is.boolean(value) && value;
    },
    isNotEmptyString(value) {
        return is.string(value) && is.not.empty(value);
    },
    isNotEmptyArray(value) {
        return is.array(value) && is.not.empty(value);
    },
    isNotEmptyObject(value) {
        return is.object(value) && is.not.empty(value);
    },
    objectIdfy(value){
        if(is.string(value) && /^[0-9a-fA-F]{24}$/.test(value)){
            return ObjectID(value);
        }
        if(ObjectID.isValid(value)){
            return value;
        }
        throw new Error('Given value is not an object id compliant');
    }
};