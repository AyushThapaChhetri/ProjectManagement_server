import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
// import controllers from "./controller/routing/controllers";
import { ENVIRONMENT, ALLOWED_ORIGINS, PORT } from "./config/config";
// const { swaggerUi, swaggerSpec } = require("../swagger");
import { RegisterRoutes } from "./tsoa/routes.ts/routes"; // tsoa-generated routes
import swaggerUi from "swagger-ui-express";
import * as swaggerSpec from "./tsoa/swagger.json/swagger.json"; // tsoa-generated spec
import { errorHandler } from "./service/contract/errors/errorHandler";

// Node.js comes with a built-in module called http, but it requires a lot of code to create a server.
// Express simplifies this process by providing an easier way to handle requests, routes, and middleware.
const app = express();

// const cors = require("cors");
// enabling CORS for any unknown origin(https://xyz.example.com)
// app.use(
//   cors(
//     environment == "DEV" ? "http://192.168.1.89:5173" : "https://*.ayush.com"
//   )
// );
// const allowedOrigins = ["http://localhost:5173", "http://192.168.1.102:5173"];

// Configure CORS
// It allows your frontend (React, Vue, etc.) to communicate with your backend (Express API) even if they are running on different domains.
// console.log(ALLOWED_ORIGINS);
// before

//   cors({
//     origin: ENVIRONMENT === "DEV" ? FRONTEND_URL : "https://*.ayush.com",
//     methods: ["GET", "POST", "PUT", "PATCH", "DELETE"], // Allowed methods
//     allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
//   })
// );

// app.use(
//   cors({
//     origin: function (origin, callback) {
//       if (!origin || ALLOWED_ORIGINS.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );

app.use(
  cors({
    origin: "*", // or use '*' for dev only
    credentials: true, // if using cookies/sessions
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"], // Allowed methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
  })
);
// Then use it like this:
// app.use(customCors);
// Middleware to parse JSON bodies
app.use(express.json());

// It allows Express to understand application/x-www-form-urlencoded data.
// extended: false?
// false → Can only handle simple objects (key-value pairs).
// true → Can handle nested objects
app.use(express.urlencoded({ extended: false }));

// Mount all routes (including "/") under "/api"
// app.use("/", authRoutes);

// Use the auth routes
// app.use("/api", ...controllers);

// Register tsoa routes
RegisterRoutes(app);

// Add Swagger UI at /api-docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Global error handler (catches all thrown errors, including your 409 Conflict)
// Add global error handling middleware
app.use(errorHandler);

// Global error-handling middleware with proper types
// app.use((err: any, req: Request, res: Response, next: NextFunction) => {
//   console.error("Global Error Handler:", err);
//   const status = err.statusCode || 500;
//   res.status(status).json({
//     message: err.message || "Something went wrong",
//   });
// });

app.listen(PORT as number, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
  console.log("Server running on http://localhost:5000");
  console.log("Swagger docs at http://localhost:5000/api-docs");
});

// app.listen(5000, "0.0.0.0", () => {
//   console.log(`API listening on http://0.0.0.0:${PORT}`);
// });

// Start the server
// const PORT = 5000;
// const PORT = 5173;
// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });

export default app;
