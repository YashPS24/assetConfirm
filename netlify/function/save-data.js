// netlify/functions/save-data.js
const { MongoClient, ServerApiVersion } = require('mongodb');

// IMPORTANT: Store your MongoDB URI in Netlify environment variables!
// Go to Site settings > Build & deploy > Environment > Environment variables
// Add a variable like MONGODB_URI with your connection string.
const uri = process.env.MONGODB_URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

exports.handler = async function(event, context) {
  // We only care about POST requests for saving data
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' }),
      headers: { 'Allow': 'POST' }
    };
  }

  try {
    const dataToSave = JSON.parse(event.body);

    // TODO: Add validation for dataToSave here if necessary

    await client.connect();
    console.log("Successfully connected to MongoDB!");

  
    const database = client.db(); 
    const collection = database.collection("Confirmation"); /
    // mongodb+srv://psyasomi:Yash@24.@cluster0.vlei7mv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

    const result = await collection.insertOne(dataToSave);

    return {
      statusCode: 201, // 201 Created
      body: JSON.stringify({ message: "Data saved successfully!", insertedId: result.insertedId }),
    };

  } catch (error) {
    console.error("Error saving data:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to save data", error: error.message }),
    };
  } finally {
    // Ensures that the client will close when you finish/error
    // For production, explore connection pooling strategies for serverless.
    await client.close();
  }
};