import clientPromise from "@/lib/mongodb";

export async function POST(request) {
  try {
    const { latitude, longitude } = await request.json();

    if (typeof latitude !== "number" || typeof longitude !== "number") {
      return new Response(JSON.stringify({ message: "Invalid latitude/longitude" }), { status: 400 });
    }

    const client = await clientPromise;  // <--- await here, NOT at top level
    const db = client.db("gpsdb");
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
