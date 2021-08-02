module.exports = class Error {
    constructor(code, field, message) {
        this.code = code;
        this.field = field;
        this.message = message;
    }
}