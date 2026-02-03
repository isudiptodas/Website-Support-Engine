import mongoose from 'mongoose';

const votingSchema = mongoose.Schema({
  category: {type: String, required: true},
  title: {type: String, required: true},
  source: {type: String, required: true},
  optionNumber: {type: Number, required: true},
  userEmail: {type: String, required: true},
  option: {type: [String], required: true},
  dateCreated: {type: Date, required: false, default: Date.now}
});

export const Voting = mongoose.model('Voting', votingSchema);