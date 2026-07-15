import { createServer } from "node:http";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
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
import webhookRoutes from "./routes/webhook.routes.js";
import { swaggerDocument } from "./swagger.js";
import { initSocket } from "./socket/index.js";

// --- CONFIGURATION LOGGING STRUCTURÉ JSON ---
const serviceRole = (process.env.SERVICE_ROLE ?? 'all').toLowerCase();
if (process.env.LOG_FORMAT === 'json') {
  const originalLog = console.log;
  const originalError = console.error;
  const originalWarn = console.warn;

  const formatMessage = (level: string, args: any[]) => {
    return JSON.stringify({
      level,
      timestamp: new Date().toISOString(),
      serviceRole,
      message: args.map(arg => {
        if (arg instanceof Error) {
          return `${arg.message}\n${arg.stack}`;
        }
        if (typeof arg === 'object' && arg !== null) {
          try {
            return JSON.stringify(arg);
          } catch {
            return `[Circular or Non-Serializable Object: ${Object.prototype.toString.call(arg)}]`;
          }
        }
        return String(arg);
      }).join(' ')
    });
  };

  console.log = (...args: any[]) => originalLog(formatMessage('info', args));
  console.info = console.log;
  console.warn = (...args: any[]) => originalWarn(formatMessage('warn', args));
  console.error = (...args: any[]) => originalError(formatMessage('error', args));
}

const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',')
  : ["http://localhost:5001"];

if (!["all", "catalog", "orders"].includes(serviceRole)) {
  throw new Error(`Unsupported SERVICE_ROLE "${serviceRole}". Expected all, catalog, or orders.`);
}

const isCatalogService = serviceRole === "all" || serviceRole === "catalog";
const isOrdersService = serviceRole === "all" || serviceRole === "orders";

const app = express();

// Middlewares
app.set('trust proxy', 1);

// --- METRICS & RESILIENCE STATE ---
const processStartTime = Date.now();
let totalHttpRequests = 0;
const httpRequestsByRoute: Record<string, number> = {};

// Middleware d'interception pour le logging de requêtes et comptage des métriques
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    let route = "unknown";
    if (req.route) {
      route = req.route.path;
    } else if (res.statusCode === 404) {
      route = "404";
    }
    const method = req.method;
    const status = res.statusCode;
    
    // Log in standard format (JSONified if LOG_FORMAT=json)
    console.log(`HTTP ${method} ${req.originalUrl} - Status: ${status} - Duration: ${duration}ms`);
    
    // Comptage des métriques
    totalHttpRequests++;
    const metricKey = `method="${method}",route="${route}",status_code="${status}"`;
    httpRequestsByRoute[metricKey] = (httpRequestsByRoute[metricKey] || 0) + 1;
  });
  next();
});

app.use(helmet());
app.use(cors({
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true
}));

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: { error: "Trop de requêtes émises depuis cette IP, veuillez réessayer plus tard." }
});
app.use(globalLimiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: "Trop de tentatives d'authentification, veuillez réessayer dans 15 minutes." }
});

if (isOrdersService) {
  app.use('/api/webhook', express.raw({ type: 'application/json' }), webhookRoutes);
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger
if (isCatalogService) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

// Routes
if (isCatalogService) {
  app.use("/api/auth", authLimiter, authRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/admin", adminRoutes);
  app.use("/api/products", productRoutes);
  app.use("/api/upload", uploadRoutes);
  app.use("/api/conversations", conversationRoutes);
}

if (isOrdersService) {
  app.use("/api/cart", cartRoutes);
  app.use("/api/orders", orderRoutes);
  app.use("/api/checkout", checkoutRoutes);
}

// Health check
app.get("/health", (_req: express.Request, res: express.Response) => {
  res.json({
    status: "ok",
    serviceRole,
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development'
  });
});

// Endpoint /metrics exposé au format Prometheus
app.get("/metrics", (_req: express.Request, res: express.Response) => {
  const memory = process.memoryUsage();
  const uptime = (Date.now() - processStartTime) / 1000;
  const cpu = process.cpuUsage();
  const cpuUser = cpu.user / 1000000; // secondes
  const cpuSystem = cpu.system / 1000000; // secondes

  let metrics = `# HELP node_uptime_seconds The uptime of the system in seconds.\n`;
  metrics += `# TYPE node_uptime_seconds gauge\n`;
  metrics += `node_uptime_seconds ${uptime}\n\n`;

  metrics += `# HELP node_memory_usage_bytes Node.js memory usage in bytes.\n`;
  metrics += `# TYPE node_memory_usage_bytes gauge\n`;
  metrics += `node_memory_usage_bytes{type="rss"} ${memory.rss}\n`;
  metrics += `node_memory_usage_bytes{type="heapTotal"} ${memory.heapTotal}\n`;
  metrics += `node_memory_usage_bytes{type="heapUsed"} ${memory.heapUsed}\n`;
  metrics += `node_memory_usage_bytes{type="external"} ${memory.external}\n\n`;

  metrics += `# HELP node_cpu_usage_seconds_total Total CPU usage in seconds.\n`;
  metrics += `# TYPE node_cpu_usage_seconds_total counter\n`;
  metrics += `node_cpu_usage_seconds_total{type="user"} ${cpuUser}\n`;
  metrics += `node_cpu_usage_seconds_total{type="system"} ${cpuSystem}\n\n`;

  metrics += `# HELP http_requests_total Total number of HTTP requests.\n`;
  metrics += `# TYPE http_requests_total counter\n`;
  metrics += `http_requests_total ${totalHttpRequests}\n\n`;

  metrics += `# HELP http_requests_by_route_total Total number of HTTP requests by route.\n`;
  metrics += `# TYPE http_requests_by_route_total counter\n`;
  for (const [key, count] of Object.entries(httpRequestsByRoute)) {
    metrics += `http_requests_by_route_total{${key}} ${count}\n`;
  }

  res.set("Content-Type", "text/plain; version=0.0.4");
  res.send(metrics);
});

// Endpoint /stress pour générer artificiellement de la charge CPU
app.get("/stress", (req: express.Request, res: express.Response) => {
  if (process.env.NODE_ENV === "production") {
    res.status(404).json({ error: "Not found in production" });
    return;
  }
  const token = req.query.token || req.headers["x-stress-token"];
  if (!token || token !== process.env.JWT_SECRET) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const end = Date.now() + 200; // bloque la boucle d'événements pendant 200ms
  let sum = 0;
  while (Date.now() < end) {
    sum += Math.sqrt(Math.random());
  }
  res.json({ status: "stressed", serviceRole, timestamp: new Date().toISOString(), value: sum });
});

app.get("/", (_req, res) => {
  res.json({ message: `GreenTrade API (${serviceRole}) is running` });
});

const port = process.env.PORT ?? 4000;
const serverUrl = process.env.API_URL || `http://localhost:${port || 4000}`;

const httpServer = createServer(app);

// WebSocket
if (isCatalogService) {
  initSocket(httpServer, allowedOrigins);
}

httpServer.listen(Number(port), '0.0.0.0', () => {
  // eslint-disable-next-line no-console
  console.log(`Backend (${serviceRole}) listening on port ${port}`);
  if (isCatalogService) {
    console.log(`Swagger docs available at ${serverUrl}/api-docs`);
    console.log(`WebSocket ready on port ${port}`);
  }
});
