const
    moment = require('moment'),
    emailValidator = require('email-validator'),
    {passwordValidation} = require('../Utils/utils'),
    Error = require('../Models/Error');

// ERROR CONSTANTS

const
    CODE_OPTIONAL_ERROR = 'REQUIRED_ERROR',
    CODE_TYPE_ERROR = 'INVALID_ERROR';

function fieldsValidator (params) {
    let errors = [], obj = {};
    for (let param of params) {
        let isError = false;
        if ((param.value == null || param.value === '') && param.optional === false) {
            errors.push(new Error(CODE_OPTIONAL_ERROR, param.name, `FIELD ${param.name} IS REQUIRED`));
            continue;
        }

        if ((param.value === undefined || param.value === null) && param.optional === true && param.dbName == null) {continue;}

        if ((param.value === undefined || param.value === null) && param.optional === true && param.dbName != null) {obj[param.dbName] = null;continue;}

        switch (param.type) {
            case 'arrayNumber': {
                for (let el of param.value) {
                    if (typeof +el !== 'number') {
                        isError = true;
                    }
                }
                break;
            }
            case 'arrayString': {
                for (let el of param.value) {
                    if (typeof el !== 'string') {
                        isError = true;
                    }
                }
                break;
            }
            case 'error': {
                isError = true;
                break;
            }
            case 'arrayToStr': {
                param.value = param.value.join(',');
                break;
            }
            case 'email': {
                if (!emailValidator.validate(param.value)) {
                    isError = true;
                }
                break;
            }
            case 'password': {
                if (!passwordValidation(param.value)) {
                    isError = true;
                }
                break;
            }
            case 'string': {
                if (typeof param.value !== 'string') {
                    isError = true;
                }
                break;
            }
            case 'number': {
                if (typeof param.value !== 'number') {
                    isError = true;
                }
                break;
            }
            case 'date': {
                if (!moment(param.value).isValid()) {isError = true;}
                break;
            }
            case 'boolean': {
                if (typeof param.value !== 'boolean') {isError = true;}
                break;
            }
            case 'searchString': {
                break;
            }
            case 'searchNumber': {
                break;
            }
            case 'searchDate': {
                break;
            }
            case 'searchBool': {
                break;
            }
        }

        if (isError) {
            errors.push(new Error(CODE_TYPE_ERROR, param.name, `FIELD ${param.name} IS INVALID`))
        } else if (param.value != null && param.value !== '') {
            obj[param.dbName] = param.value;
        }
    }

    return {
        errors: errors,
        obj: obj
    }
}

module.exports = fieldsValidator;