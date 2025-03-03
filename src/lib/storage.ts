import AWS from "aws-sdk";

const s3 = new AWS.S3({
  endpoint: process.env.STORAGE_ENDPOINT,
  accessKeyId: process.env.STORAGE_ACCESS_KEY,
  secretAccessKey: process.env.STORAGE_SECRET_KEY,
  region: "auto", // DigitalOcean uses 'auto' instead of a fixed region
});

export default s3;
