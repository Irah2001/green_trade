import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import authRoutes from "./routes/auth.routes.js";
import { swaggerDocument } from "./swagger.js";

const allowedOrigins = process.env.CORS_ORIGIN 
  ? process.env.CORS_ORIGIN.split(',') 
  : ["http://localhost:5001"];

const app = express();

// Middlewares
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.use("/api/auth", authRoutes);

app.get("/health", (_req, res) => {
  res.json({ 
    status: "ok",
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development'
  });
});

app.get("/", (_req, res) => {
  res.json({ message: "GreenTrade API is running" });
});

const port = process.env.PORT ?? 4000;
const serverUrl = process.env.API_URL || `http://localhost:${port || 4000}`;
app.listen(Number(port), '0.0.0.0', () => {
  // eslint-disable-next-line no-console
  console.log(`Backend listening on port ${port}`);
  console.log(`Swagger docs available at ${serverUrl}/api-docs`);
});