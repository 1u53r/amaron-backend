// app/api/location/route.js
import clientPromise from "@/lib/mongodb";

export async function POST(request) {
  try {
    const { latitude, longitude } = await request.json();

    // Validate input
    if (typeof latitude !== "number" || typeof longitude !== "number") {
      return new Response(
        JSON.stringify({ message: "Latitude and longitude must be numbers" }),
        { status: 400 }
      );
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db("gpsdb"); // replace with your database name
    const collection = db.collection("location");

    // Insert coordinates
    const result = await collection.insertOne({
      latitude,
      longitude,
      createdAt: new Date(),
    });

    return new Response(
      JSON.stringify({ message: "Coordinates saved!", data: result }),
      { status: 201 }
    );
  } catch (error) {
    console.error("MongoDB error:", error);
    return new Response(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 }
    );
  }
}

export async function GET() {
  return new Response(
    JSON.stringify({ message: "GET not allowed" }),
    { status: 405 }
  );
}
