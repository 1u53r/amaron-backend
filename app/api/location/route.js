import clientPromise from "@/lib/mongodb";

export async function POST(request) {
  try {
    const { latitude, longitude } = await request.json();

    if (!latitude || !longitude) {
      return new Response(
        JSON.stringify({ message: "Latitude and longitude are required" }),
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("gpsDB");          // your database name
    const collection = db.collection("locations");

    const result = await collection.insertOne({
      latitude,
      longitude,
      createdAt: new Date(),
    });

    return new Response(JSON.stringify({ message: "Coordinates saved!", data: result }), {
      status: 201,
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
}

export function GET() {
  return new Response(JSON.stringify({ message: "GET not allowed" }), {
    status: 405,
  });
}
