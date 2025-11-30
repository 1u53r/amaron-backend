import clientPromise from "@/lib/mongodb";

export async function POST(request) {
  try {
    // CORS
    const headers = {
      "Access-Control-Allow-Origin": "https://amaron.vercel.app",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    const { latitude, longitude, accuracy, timestamp } = await request.json();


    // Validate latitude/longitude
    if (latitude == null || longitude == null) {
      return new Response(JSON.stringify({ message: "Latitude and longitude are required" }), { status: 400, headers });
    }

    const client = await clientPromise;
    const db = client.db("gpsdb");          // your database name
    const collection = db.collection("location");

    const result = await collection.insertOne({
      latitude,
      longitude,
      accuracy: accuracy || null,
      timestamp: timestamp || new Date().toISOString(),
      createdAt: new Date(),
    });

    return new Response(JSON.stringify({ message: "Coordinates saved!", data: result }), {
      status: 201,
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
      headers: {
        "Access-Control-Allow-Origin": "https://amaron.vercel.app"        
      }
    });
  }
}

export function GET() {
  return new Response(JSON.stringify({ message: "GET not allowed" }), {
    status: 405,
  });
}

// Allow OPTIONS preflight
export function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "https://amaron.vercel.app",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}