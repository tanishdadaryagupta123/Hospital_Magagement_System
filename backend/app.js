import express from "express";
import dbConnection from "./database/dbConnection.js";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import fileUpload from "express-fileupload";
import { errorMiddleware } from "./middlewares/error.js";
import messageRouter from "./router/messageRouter.js";
import userRouter from "./router/userRouter.js";
import appointmentRouter from "./router/appointmentRouter.js";
import { v2 as cloudinary } from "cloudinary";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import cloudinaryConfig from "./config/cloudinaryConfig.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars first - make sure this is absolute path
const envPath = path.join(__dirname, "config", "config.env");
console.log("Loading environment variables from:", envPath);
config({ path: envPath });

// Verify required environment variables
const requiredEnvVars = [
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
  'MONGODB_URI',
  'PORT',
  'FRONTEND_URL',
  'DASHBOARD_URL'
];

const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingEnvVars.length > 0) {
  console.error('Missing required environment variables:', missingEnvVars);
  process.exit(1);
}

// Debug logs for environment variables
console.log("Environment Variables Check:");
console.log("MongoDB URI:", process.env.MONGODB_URI ? "Present" : "Missing");
console.log("Port:", process.env.PORT);
console.log("Frontend URL:", process.env.FRONTEND_URL);
console.log("Dashboard URL:", process.env.DASHBOARD_URL);
console.log("Cloudinary Configuration:");
console.log("- Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("- API Key:", process.env.CLOUDINARY_API_KEY ? "Present" : "Missing");
console.log("- API Secret:", process.env.CLOUDINARY_API_SECRET ? "Present" : "Missing");

const app = express();

// Configure cloudinary
try {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
  });

  // Test Cloudinary configuration immediately
  const testResult = await cloudinary.uploader.upload("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==", {
    folder: "test"
  });
  
  console.log("✓ Cloudinary connection successful");
  
  // Clean up test upload
  await cloudinary.uploader.destroy(testResult.public_id);
} catch (error) {
  console.error("✗ Cloudinary configuration error:", error.message);
  process.exit(1);
}

// CORS Configuration - Simplified for development
app.use(cors({
  origin: true, // Allow all origins in development
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key', 'Accept', 'Origin']
}));

app.use(cookieParser());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Create temp directory if it doesn't exist
const tempDir = path.join(__dirname, 'tmp');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

// File upload middleware
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: tempDir,
  createParentPath: true,
  limits: { 
    fileSize: 10 * 1024 * 1024 // 10MB max file size
  },
  abortOnLimit: true,
  safeFileNames: true,
  preserveExtension: true,
  debug: true // Enable debug mode
}));

// Routes
app.use("/api/v1/message", messageRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/appointment", appointmentRouter);

// Connect to database
dbConnection();

// Configure Cloudinary
cloudinaryConfig();

const PORT = process.env.PORT || 3000;

// Error Middleware should be after all routes
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server listening at port ${PORT}`);
});

export default app;
