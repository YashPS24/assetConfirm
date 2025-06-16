const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const cors = require('cors');
// When server.cjs is run from the project root, .env in the root will be found.
// If server.cjs is run with `backend` as the CWD (Current Working Directory),
// and .env is in the project root, you'd need: require('dotenv').config({ path: '../.env' });
// However, most deployment platforms set environment variables directly,
// so dotenv might primarily be for local development.
require('dotenv').config(); 
const AWS = require('aws-sdk');

// Configure AWS SDK
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});
const s3 = new AWS.S3();
const app = express();
const port = process.env.PORT || 5000;

// --- MongoDB Connection ---
mongoose.connect(process.env.MONGODB_URI, { 
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully.'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// --- Mongoose Schema and Model ---
const confirmationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  assetMaterialNo: { type: String, required: true },
  remarks: String,
  imageUrl: String, // URL of the image stored in Firebase Storage, S3, etc.
  submittedAt: { type: Date, default: Date.now }
});

const Confirmation = mongoose.model('Confirmation', confirmationSchema);

// --- Middleware ---
app.use(cors({ origin: '*' })); // Configure for your frontend URL in production
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const storage = multer.memoryStorage(); // Or configure diskStorage if preferred
const upload = multer({ storage: storage, limits: { fileSize: 5 * 1024 * 1024 } });

// --- API Endpoint ---
app.post('/api/confirmations', upload.single('image'), async (req, res) => {
  try {
    const { name, phone, assetMaterialNo, remarks } = req.body;
    const imageFile = req.file;
    let imageUrl = null; // This would be set after uploading to Firebase Storage/S3

    if (!name || !phone || !assetMaterialNo) {
      return res.status(400).json({ message: 'Missing required fields: name, phone, assetMaterialNo.' });
    }

    if (imageFile) {
      console.log('Image received:', imageFile.originalname, '(actual upload logic needed)');
      
      const s3Params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `${Date.now()}_${imageFile.originalname.replace(/\s+/g, '_')}`, // Sanitize filename
        Body: imageFile.buffer,
        ContentType: imageFile.mimetype,
        // ACL: 'public-read' // If you want the file to be publicly accessible directly
      };

      try {
        const s3UploadResponse = await s3.upload(s3Params).promise();
        imageUrl = s3UploadResponse.Location; // URL of the uploaded file in S3
        console.log('Image uploaded to S3:', imageUrl);
      } catch (s3Error) {
        console.error('S3 Upload Error:', s3Error);
        // Decide if you want to proceed without image or return an error
      }
    }

    const newConfirmation = new Confirmation({
      name, phone, assetMaterialNo, remarks: remarks || '', imageUrl,
    });

    const savedConfirmation = await newConfirmation.save();
    console.log('Data saved to MongoDB with ID:', savedConfirmation._id);
    res.status(201).json({ message: 'Confirmation submitted successfully to MongoDB!', data: savedConfirmation });
  } catch (error) {
    console.error('Error processing request:', error);
    if (error.name === 'ValidationError') {
        return res.status(400).json({ message: 'Validation Error', errors: error.errors });
    }
    res.status(500).json({ message: 'Failed to submit confirmation.', error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});