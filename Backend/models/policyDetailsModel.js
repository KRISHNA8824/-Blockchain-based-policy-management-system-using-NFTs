const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const myDataSchema = new Schema({
  sno: { type: String, required: true },
  name: { type: String, required: true },
  termsAndConditions: { type: String, required: true },
  premium: { type: String, required: true },
  deductibles: { type: String, required: true },
  coverageLimit: { type: String, required: true },
  coveragePeriod: { type: String, required: true },
});

const MyData = mongoose.model('policiesDetails', myDataSchema);

module.exports = MyData;
