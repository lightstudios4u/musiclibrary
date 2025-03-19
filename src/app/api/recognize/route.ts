import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const ACR_HOST = process.env.ACR_HOST!;
    const ACR_ACCESS_KEY = process.env.ACR_ACCESS_KEY!;
    const ACR_SECRET_KEY = process.env.ACR_SECRET_KEY!;

    if (!ACR_HOST || !ACR_ACCESS_KEY || !ACR_SECRET_KEY) {
      return NextResponse.json(
        { error: "Missing ACRCloud environment variables" },
        { status: 500 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File; // Expecting 'file' field

    if (!file) {
      return NextResponse.json(
        { error: "Audio file not found" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    if (buffer.byteLength === 0) {
      return NextResponse.json(
        { error: "Audio file is empty" },
        { status: 400 }
      );
    }

    const currentTimestamp = Math.floor(Date.now() / 1000);
    const signatureVersion = "1";
    const dataType = "audio";

    const stringToSign = [
      "POST",
      "/v1/identify",
      ACR_ACCESS_KEY,
      dataType,
      signatureVersion,
      currentTimestamp,
    ].join("\n");

    const signature = crypto
      .createHmac("sha1", Buffer.from(ACR_SECRET_KEY, "utf-8"))
      .update(Buffer.from(stringToSign, "utf-8"))
      .digest("base64");

    const acrFormData = new FormData();
    acrFormData.append("access_key", ACR_ACCESS_KEY);
    acrFormData.append("sample_bytes", buffer.byteLength.toString());
    acrFormData.append("timestamp", currentTimestamp.toString());
    acrFormData.append("signature", signature);
    acrFormData.append("data_type", dataType);
    acrFormData.append("signature_version", signatureVersion);
    acrFormData.append("sample", new Blob([buffer], { type: "audio/wav" }));

    const apiUrl = `${ACR_HOST}/v1/identify`;

    const res = await fetch(apiUrl, {
      method: "POST",
      body: acrFormData,
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Failed to identify audio: ${res.statusText}` },
        { status: res.status }
      );
    }

    const result = await res.json();
    console.log("Recognition result:", result);

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error("Error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to process file",
      },
      { status: 500 }
    );
  }
}
