const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const myDataSchema = new Schema({
    currentAccount: { type: String, required: true },
    premium: { type: Number, required: true },
    deductibles: { type: Number, required: true },
    coverageLimit: { type: Number, required: true },
    coveragePeriod: { type: Number, required: true },
    termsAndConditions: { type: String, required: true },
    name: { type: String, required: true },
    Address: { type: String, required: true },
    contactInformation: { type: String, required: true }
});

const MyData = mongoose.model('PolicyMintRequest', myDataSchema);

module.exports = MyData;
