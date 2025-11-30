// lib/mongodb.js
import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URI;

if (!uri) {
  throw new Error("Please add your Mongo URI to .env.local");
}

// Recommended options for MongoDB Atlas + Node.js 18+
const options = {
  tls: true,
  tlsAllowInvalidCertificates: false, // keep false in production
};

let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
  // Use global variable to prevent multiple connections in dev
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production, create a new client
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
