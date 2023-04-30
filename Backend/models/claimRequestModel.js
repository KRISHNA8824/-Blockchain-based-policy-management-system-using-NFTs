const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const myDataSchema = new Schema({
  tokenId: { type: Number, required: true },
});

const MyData = mongoose.model('claimRequests', myDataSchema);

module.exports = MyData;
