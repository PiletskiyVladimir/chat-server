class ValidationField {
    constructor(name, value, type, optional, dbName, allowedValues) {
        this.name = name;
        this.value = value;
        this.type = type;
        this.optional = optional;
        this.dbName = dbName;
        this.allowedValues = allowedValues;
    }
}

module.exports = ValidationField;