import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import pool from "../../../lib/db";
import s3 from "../../../lib/storage";
import { User } from "../../../lib/types";

const SECRET_KEY = process.env.JWT_SECRET!;

export async function PATCH(req: NextRequest) {
  try {
    console.log("🔎 Verifying token...");

    // ✅ Get token from cookies
    const token = req.cookies.get("token")?.value;
    if (!token) {
      console.warn("❌ No token found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, SECRET_KEY) as { user_id: number };
    } catch (err) {
      console.error("❌ Token verification failed:", err);
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    console.log("✅ Token verified:", decoded);

    // ✅ Get user ID from token
    const userId = decoded.user_id;

    const updates: string[] = [];
    const values: any[] = [];

    // ✅ Handle file upload if content type is multipart/form-data
    if (req.headers.get("content-type")?.includes("multipart/form-data")) {
      console.log("📸 Handling file upload...");

      const formData = await req.formData();
      const profileImage = formData.get("profile_image") as File;

      if (profileImage) {
        const profileImageBuffer = Buffer.from(
          await profileImage.arrayBuffer()
        );

        const profileImageParams = {
          Bucket: process.env.STORAGE_BUCKET!,
          Key: `profile_imgs/${Date.now()}-${profileImage.name}`, // Use timestamp to prevent overwrites
          Body: profileImageBuffer,
          ACL: "public-read",
          ContentType: profileImage.type, // ✅ Preserve the original content type
        };

        // ✅ Upload to S3
        const profileImageUploadResult = await s3
          .upload(profileImageParams)
          .promise();

        const profileImageUrl = profileImageUploadResult.Location; // ✅ Get uploaded file URL

        console.log("✅ File uploaded to S3:", profileImageUrl);

        updates.push("profile_image = ?");
        values.push(profileImageUrl);
      }
    }

    // ✅ Handle bio update if content type is application/json
    if (req.headers.get("content-type") === "application/json") {
      console.log("✍️ Handling bio update...");

      const { bio } = await req.json();

      if (bio !== undefined) {
        updates.push("bio = ?");
        values.push(bio);
      }
    }

    // ✅ Perform the update only if there's something to update
    if (updates.length > 0) {
      const query = `
        UPDATE users
        SET ${updates.join(", ")}
        WHERE id = ?;
      `;
      values.push(userId);

      await pool.query(query, values);
      console.log(`✅ User ${userId} updated successfully`);
    } else {
      console.warn("⚠️ Nothing to update");
      return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
    }

    // ✅ Return updated user info
    const [updatedUserResult] = await pool.query(
      `SELECT id, username, email, bio, profile_image, created_at 
       FROM users 
       WHERE id = ?`,
      [userId]
    );

    if (!updatedUserResult || (updatedUserResult as any[]).length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updatedUser = (updatedUserResult as User[])[0];

    console.log("✅ Updated user:", updatedUser);

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error("❌ Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}
