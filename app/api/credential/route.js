import clientPromise from "@/lib/mongodb";

export async function POST(request) {
  const headers = {
    "Access-Control-Allow-Origin": "https://amaron.vercel.app",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  try {
    const data = await request.json();

    if (!data.username) {
      return new Response(JSON.stringify({ message: "username is required" }), { status: 400, headers });
    }

    const client = await clientPromise;
    const db = client.db("gpsdb");
    const collection = db.collection("Credentials");

    const result = await collection.insertOne({
      ...data,
      createdAt: new Date(),
    });

    return new Response(JSON.stringify({ message: "Client info saved!", data: result }), {
      status: 201,
      headers,
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), { status: 500, headers });
  }
}

export function GET() {
  return new Response(JSON.stringify({ message: "GET not allowed" }), { status: 405 });
}

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