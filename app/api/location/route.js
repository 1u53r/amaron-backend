// app/api/location/route.js
import clientPromise from "@/lib/mongodb";

export async function POST(request) {
  try {
    const { latitude, longitude } = await request.json();

    if (typeof latitude !== "number" || typeof longitude !== "number") {
      return new Response(JSON.stringify({ message: "Invalid latitude/longitude" }), { status: 400 });
    }

    // Only connect inside the function, NOT at top-level
    const client = await clientPromise;
    const db = client.db("gpsdb"); // database name
    const collection = db.collection("location");

    const result = await collection.insertOne({
      latitude,
      longitude,
      createdAt: new Date(),
    });

    return new Response(JSON.stringify({ message: "Coordinates saved!", data: result }), { status: 201 });
  } catch (err) {
    console.error("MongoDB error:", err);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), { status: 500 });
  }
}

export async function GET() {
  return new Response(JSON.stringify({ message: "GET not allowed" }), { status: 405 });
}