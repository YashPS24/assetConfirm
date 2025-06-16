import mongoose from "mongoose";
const confirmationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  assetMaterialNo: { type: String, required: true },
  remarks: String,
  imageUrl: String, // URL of the image stored in Firebase Storage, S3, etc.
  submittedAt: { type: Date, default: Date.now }
});

export default (connection) => connection.model('Confirmation', confirmationSchema);



