import mongoose from "mongoose";

const requestAccessSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  catalogueId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,    
    required: false, 
  },
  phone: {
    type: String,    
    required: false, 
  }
}, {
  timestamps: true,  
});

export const RequestAccess = mongoose.model('RequestAccess', requestAccessSchema);