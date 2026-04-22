import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config({ path: "./config/config.env" });

const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

export const uploadToR2 = async (file, folder = "resumes") => {
  const fileStream = fs.createReadStream(file.tempFilePath);
  const fileName = `${folder}/${Date.now()}-${file.name.replace(/\s+/g, "-")}`;

  const uploadParams = {
    Bucket: process.env.R2_BUCKET_NAME,
    Key: fileName,
    Body: fileStream,
    ContentType: "application/pdf",
    ContentDisposition: "inline",
  };

  try {
    await s3Client.send(new PutObjectCommand(uploadParams));
    const publicUrl = `${process.env.R2_PUBLIC_URL}/${fileName}`;
    return {
      public_id: fileName,
      url: publicUrl,
    };
  } catch (err) {
    console.error("R2 Upload Error:", err);
    throw err;
  }
};

export const deleteFromR2 = async (key) => {
  const deleteParams = {
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
  };

  try {
    await s3Client.send(new DeleteObjectCommand(deleteParams));
  } catch (err) {
    console.error("R2 Delete Error:", err);
    throw err;
  }
};
