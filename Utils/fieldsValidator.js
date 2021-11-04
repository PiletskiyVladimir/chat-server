const
    moment = require('moment'),
    emailValidator = require('email-validator'),
    {passwordValidation} = require('../Utils/utils'),
    Error = require('./Error');

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

        if ((param.value === undefined || param.value === null) && param.optional === true) {continue;}

        if (param.allowedValues) {
            if (param.allowedValues.indexOf(param.value) === -1) {
                errors.push(new Error(CODE_TYPE_ERROR, param.name, `FIELD ${param.name} IS INVALID`));
                continue;
            }
        }

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
                console.log(isNaN(param.value))
                if (isNaN(param.value)) {
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
            case 'file': {
                if (!param.value) isError = true;
                break;
            }
            case 'searchString': {
                if (param.value !== null) {
                    if (typeof param.value !== "string") isError = true;

                    // let splattedArray = param.value.split(',');
                    //
                    // if (splattedArray.length === 0) break;
                    //
                    // obj[param.dbName] = {$in: splattedArray.map(el => new RegExp(el))};

                    obj[param.dbName] = {$regex: new RegExp(param.value), $options: "i"}
                }

                break;
            }
            case 'searchNumber': {
                if (param.value !== null) {
                    let splattedArray = param.value.split(',');

                    if (splattedArray.length === 0) break;

                    for (let el of splattedArray) {
                        if (isNaN(el)) isError = true;
                    }

                    obj[param.dbName] = {$in: splattedArray};
                }

                break;
            }
            case 'searchDate': {
                if (param.value !== null) {
                    let splattedArray = param.value.split(',');

                    if (splattedArray.length === 0) break;

                    obj[param.dbName] = {
                        $gte: splattedArray[0],
                        $lte: splattedArray[1]
                    }
                }

                break;
            }
            case 'searchBool': {
                if (param.value !== null) {
                    let splattedArray = param.value.split(',');

                    if (splattedArray.length === 0) break;

                    obj[param.dbName] = splattedArray.map(el => {
                        return {$eq: el}
                    });
                }

                break;
            }
            case 'messageObj': {
                for (let prop in param.value) {
                    if (typeof prop !== 'string') {
                        isError = true;
                        break;
                    }

                    let {message, files} = param.value[prop];

                    if (!message && !files) isError = true;

                    if (message) {
                        if (!(message instanceof Array)) {
                            isError = true;
                            break;
                        }

                        for (let el of message) {
                            if (typeof el !== 'string') {
                                isError = true;
                                break;
                            }
                        }
                    }

                    if (files) {
                        if (!(files instanceof Array)) {
                            isError = true;
                            break;
                        }

                        if (!isError) {
                            for (let el of files) {
                                let {fileName, value} = el;
                                if (typeof fileName !== 'string') isError = true;

                                if (!(value instanceof Array)) {
                                    isError = true;
                                    break;
                                }

                                if (!isError) {
                                    for (let part of value) {
                                        if (typeof part !== 'string') isError = true;
                                    }
                                }
                            }
                        }
                    }
                }

                break;
            }
        }

        if (isError) {
            errors.push(new Error(CODE_TYPE_ERROR, param.name, `FIELD ${param.name} IS INVALID`))
        } else if (param.value != null && param.value !== '' && param.type !== 'searchString' && param.type !== 'searchNumber' && param.type !== 'searchDate' && param.type !== 'searchBool' && param.dbName != null) {
            obj[param.dbName] = param.value;
        }
    }

    return {
        errors: errors,
        obj: obj
    }
}

module.exports = fieldsValidator;