import mongoose from 'mongoose';

const votingSchema = mongoose.Schema({
  category: { type: String, required: true },
  title: { type: String, required: true },
  source: { type: String, required: true },
  optionNumber: { type: Number, required: true },
  userEmail: { type: String, required: false },
  expiry: { type: String, required: true },
  options: [{
    text: { type: String, required: true },
    votes: { type: Number, default: 0 }
  }],
  voterEmail: { type: [String], required: false, default: [] },
  totalVotes: { type: Number, required: false, default: 0 },
  dateCreated: { type: Date, required: false, default: Date.now }
});

export const Voting = mongoose.model('Voting', votingSchema);