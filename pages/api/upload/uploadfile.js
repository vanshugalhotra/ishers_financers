import fs from "fs-extra";
import formidable from "formidable";
import path from "path";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function upload(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method Not Allowed" });
    return;
  }

  const form = formidable({
    uploadDir: path.join(process.cwd(), "public/assets/images/temp"),
    keepExtensions: true,
    multiples: false, // Disable multiple file uploads
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
      return;
    }

    const file = Array.isArray(files.file) ? files.file[0] : files.file; // Ensure single file handling

    const phoneNumber = Array.isArray(fields.phoneNumber)
      ? fields.phoneNumber[0]
      : fields.phoneNumber;
    const fileType = Array.isArray(fields.type) ? fields.type[0] : fields.type;
    const uploadDir = path.join(
      process.cwd(),
      `public/assets/images/${fileType}`,
      phoneNumber
    );

    try {
      await fs.ensureDir(uploadDir); // Ensure the client's directory exists

      const uploadPath = path.join(uploadDir, file.originalFilename);
      const tempFilePath = file.filepath;

      // Check if the temporary file exists and is accessible
      try {
        await fs.access(tempFilePath, fs.constants.R_OK); // Check readability
      } catch (accessError) {
        throw new Error(
          `Temporary file ${tempFilePath} does not exist or is inaccessible.`
        );
      }

      await fs.move(tempFilePath, uploadPath, { overwrite: true }); // Move the uploaded file to the desired location

      res
        .status(200)
        .json({ message: "File uploaded successfully", file: uploadPath });
    } catch (error) {
      console.error("Error handling file upload:", error);
      res.status(500).json({ message: "Error handling file upload" });
    }
  });
}
