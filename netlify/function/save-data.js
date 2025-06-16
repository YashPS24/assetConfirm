// d:\Yash\Projects\GP\ym-confirmation\netlify\functions\save-data.js
const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error('Error: MONGODB_URI environment variable is not set.');
  // Return an error response or throw, depending on how you want to handle this
}

// It's often better to initialize the client outside the handler for potential reuse
// across invocations in "warm" functions, but connect/close inside for safety.
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' }),
      headers: { 'Allow': 'POST' }
    };
  }

  try {
    const dataToSave = JSON.parse(event.body);

    // Optional: Add data validation here

    await client.connect();
    console.log("Successfully connected to MongoDB Atlas!");

    // Replace with your actual database and collection names
    const database = client.db("mongodb+srv://psyasomi:Yash@24.@cluster0.vlei7mv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"); // Or client.db() if db name is in URI
const collection = database.collection("Confirmation");

    const result = await collection.insertOne(dataToSave);
    console.log("Data inserted with ID:", result.insertedId);

    return {
      statusCode: 201,
      body: JSON.stringify({ message: "Data saved successfully!", insertedId: result.insertedId }),
    };

  } catch (error) {
    console.error("Error in save-data function:", error);
    // Be careful about exposing raw error messages to the client in production
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to save data", errorDetails: error.message }),
    };
  } finally {
    // Ensures that the client will close when you finish/error.
    // Consider connection pooling for high-traffic production apps.
    await client.close();
    console.log("MongoDB Atlas connection closed.");
  }
};
