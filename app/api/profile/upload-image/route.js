import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getDatabase } from "@/lib/db";

// Cloudflare R2 configuration
const r2Client = new S3Client({
    region: "auto",
    endpoint: process.env.CLOUDFLARE_R2_ENDPOINT, // e.g., https://account-id.r2.cloudflarestorage.com
    credentials: {
        accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
    },
});

const BUCKET_NAME = process.env.CLOUDFLARE_R2_BUCKET_NAME;
const PUBLIC_URL_BASE = process.env.CLOUDFLARE_R2_PUBLIC_URL; // Your custom domain or R2.dev URL

export async function POST(request) {
    try {
        const token = request.cookies.get("token")?.value;

        if (!token) {
            return Response.json({ error: "Not authenticated" }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const formData = await request.formData();
        const file = formData.get("image");

        if (!file) {
            return Response.json({ error: "No file provided" }, { status: 400 });
        }

        // Enhanced validation for profile images
        if (!file.type.startsWith("image/")) {
            return Response.json({ error: "File must be an image" }, { status: 400 });
        }

        if (file.size > 2 * 1024 * 1024) { // 2MB input limit (will be compressed to ~150KB)
            return Response.json({ error: "File size must be less than 2MB" }, { status: 400 });
        }

        // Import image processing functions
        const { standardizeProfileImage, getProfileImageSpecs } = await import("@/lib/imageUtils.js");

        // Process and standardize the image
        let processedImage;
        try {
            processedImage = await standardizeProfileImage(file);
        } catch (processingError) {
            return Response.json({
                error: `Image processing failed: ${processingError.message}`
            }, { status: 400 });
        }

        // Convert processed file to buffer
        const bytes = await processedImage.file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Generate unique filename with standardized format
        const timestamp = Date.now();
        const userId = decoded.email.split('@')[0]; // Use email prefix as user identifier
        const fileName = `profile-images/${userId}_${timestamp}.jpg`; // Always JPEG for consistency

        // Get current user to check for existing profile image
        const db = await getDatabase();
        const usersCollection = db.collection("users");

        const currentUser = await usersCollection.findOne({ email: decoded.email });

        // Upload new image to Cloudflare R2
        const imageUrl = await uploadToCloudflareR2(buffer, fileName, file.type);

        if (!imageUrl) {
            return Response.json({ error: "Failed to upload image to storage" }, { status: 500 });
        }

        // Update user profile with new image URL
        await usersCollection.updateOne(
            { email: decoded.email },
            {
                $set: {
                    profilePicture: imageUrl,
                    updatedAt: new Date()
                }
            }
        );

        // Delete old profile image if it exists and is an R2 image
        if (currentUser?.profilePicture) {
            await deleteOldProfileImage(currentUser.profilePicture);
        }

        return Response.json({
            success: true,
            imageUrl: imageUrl,
            message: "Profile picture updated successfully",
            imageInfo: {
                originalSize: file.size,
                processedSize: processedImage.size,
                dimensions: processedImage.dimensions,
                format: processedImage.format,
                quality: processedImage.quality,
                optimized: processedImage.optimized
            }
        });

    } catch (error) {
        console.error("Error uploading image:", error);
        return Response.json({ error: "Failed to upload image" }, { status: 500 });
    }
}

// Cloudflare R2 upload function
async function uploadToCloudflareR2(buffer, fileName, mimeType) {
    try {
        // Validate environment variables
        if (!BUCKET_NAME || !PUBLIC_URL_BASE) {
            console.error("Missing Cloudflare R2 configuration");
            return null;
        }

        const command = new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: fileName,
            Body: buffer,
            ContentType: mimeType,
            ContentLength: buffer.length,
            // Set cache control for better performance
            CacheControl: "public, max-age=31536000", // 1 year
            // Optional: Set metadata
            Metadata: {
                uploadedAt: new Date().toISOString(),
                uploadedBy: "groupxam-profile-system"
            }
        });

        const response = await r2Client.send(command);

        if (response.$metadata.httpStatusCode === 200) {
            // Construct public URL
            const publicUrl = `${PUBLIC_URL_BASE}/${fileName}`;
            console.log(`Successfully uploaded to R2: ${publicUrl}`);
            return publicUrl;
        } else {
            console.error("R2 upload failed:", response);
            return null;
        }

    } catch (error) {
        console.error("Cloudflare R2 upload error:", error);
        return null;
    }
}

// Optional: Function to delete old profile images
async function deleteOldProfileImage(imageUrl) {
    try {
        if (!imageUrl || !imageUrl.includes(PUBLIC_URL_BASE)) {
            return; // Not an R2 image or invalid URL
        }

        // Extract file key from URL
        const fileName = imageUrl.replace(`${PUBLIC_URL_BASE}/`, '');

        const { DeleteObjectCommand } = await import("@aws-sdk/client-s3");
        const deleteCommand = new DeleteObjectCommand({
            Bucket: BUCKET_NAME,
            Key: fileName,
        });

        await r2Client.send(deleteCommand);
        console.log(`Deleted old profile image: ${fileName}`);
    } catch (error) {
        console.error("Failed to delete old profile image:", error);
        // Don't throw error as this is not critical
    }
}

