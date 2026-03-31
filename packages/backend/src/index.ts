import { createServer } from "node:http";
import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import authRoutes from "./routes/auth.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import orderRoutes from "./routes/order.routes.js";
import userRoutes from "./routes/user.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import checkoutRoutes from "./routes/checkout.routes.js";
import productRoutes from "./routes/product.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import conversationRoutes from "./routes/conversation.routes.js";
import { swaggerDocument } from "./swagger.js";
import { initSocket } from "./socket/index.js";

const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',')
  : ["http://localhost:5001"];

const LOOPBACK_HOSTS = new Set(['localhost', '127.0.0.1', '::1']);

function isAllowedOrigin(origin: string): boolean {
  if (allowedOrigins.includes(origin)) {
    return true;
  }

  if (process.env.NODE_ENV === 'production') {
    return false;
  }

  try {
    const url = new URL(origin);
    return (url.protocol === 'http:' || url.protocol === 'https:') && LOOPBACK_HOSTS.has(url.hostname);
  } catch {
    return false;
  }
}

const app = express();

// Middlewares
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (isAllowedOrigin(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true
}));
app.use(express.json());

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/products", productRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/conversations", conversationRoutes);

// Health check
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

const httpServer = createServer(app);

// WebSocket
initSocket(httpServer, allowedOrigins);

httpServer.listen(Number(port), '0.0.0.0', () => {
  // eslint-disable-next-line no-console
  console.log(`Backend listening on port ${port}`);
  console.log(`Swagger docs available at ${serverUrl}/api-docs`);
  console.log(`WebSocket ready on port ${port}`);
});
