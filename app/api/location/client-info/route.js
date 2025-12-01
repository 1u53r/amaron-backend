import clientPromise from "@/lib/mongodb";

export async function POST(request) {
  try {
    const headers = {
      "Access-Control-Allow-Origin": "https://amaron-pi.vercel.app",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    // Parse JSON body
    const data = await request.json();

    // Validate minimally (optional)
    if (!data.userAgent) {
      return new Response(JSON.stringify({ message: "userAgent is required" }), { status: 400, headers });
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db("gpsdb");
    const collection = db.collection("client-info");

    // Insert document
    const result = await collection.insertOne({
      ...data,
      createdAt: new Date(),
    });

    return new Response(JSON.stringify({ message: "Client info saved!", data: result }), { status: 201, headers });

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), { status: 500, headers: { "Access-Control-Allow-Origin": "https://amaron-pi.vercel.app" } });
  }
}

// Block GET requests
export function GET() {
  return new Response(JSON.stringify({ message: "GET not allowed" }), { status: 405 });
}

// OPTIONS for CORS preflight
export function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "https://amaron-pi.vercel.app",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}