import { NextRequest, NextResponse } from "next/server";
import s3 from "../../../lib/storage"; // Make sure this path is correct

export async function POST(req: NextRequest) {
  try {
    // Use FormData API to parse the request
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Convert the file into a Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload file to DigitalOcean Spaces
    const params = {
      Bucket: process.env.STORAGE_BUCKET!,
      Key: `uploads/${file.name}`,
      Body: buffer,
      ACL: "public-read",
    };

    const uploadResult = await s3.upload(params).promise();

    return NextResponse.json({ url: uploadResult.Location }, { status: 200 });
  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
