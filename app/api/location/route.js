// pages/api/gps.js
import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { latitude, longitude } = req.body;

      if (!latitude || !longitude) {
        return res.status(400).json({ message: "Latitude and longitude are required" });
      }

      const client = await clientPromise;
      const db = client.db("gpsDB"); // replace with your DB name
      const collection = db.collection("locations"); // replace with your collection name

      const result = await collection.insertOne({
        latitude,
        longitude,
        createdAt: new Date(),
      });

      res.status(201).json({ message: "Coordinates saved!", data: result });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
