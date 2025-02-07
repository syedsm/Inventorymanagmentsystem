const { put } =require("@vercel/blob");
const  dotenv =require("dotenv");

// Load environment variables
dotenv.config();

const blobToken = process.env.BLOB_READ_WRITE_TOKEN;

async function uploadMultipleFilesToVercel(files) {
  try {
    const uploadedFiles = [];

    for (const file of files) {
      const { url } = await put(`uploads/${file.originalname}`, file.buffer, {
        access: "public",
        token: blobToken, // Ensure the token is used
      });

      uploadedFiles.push({ fileName: file.originalname, url });
    }

    return uploadedFiles; // Return array of file URLs
  } catch (error) {
    console.error("Blob Upload Error:", error);
    throw error;
  }
}

module.exports= { uploadMultipleFilesToVercel };
