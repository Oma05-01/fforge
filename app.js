const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Oma's Blog API",
      version: "1.0.0",
      description: "A blog post and user management API",
    },
    servers: [
      {
        url: "http://localhost:5000",
      },
    ],
    // ==========================================
    // THE GLOBAL SWAGGER LIBRARY
    // ==========================================
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      parameters: {
        IdParam: {
          in: "path",
          name: "id",
          required: true,
          schema: { type: "string" },
          description: "The unique ID of the resource",
        },
        PostIdParam: {
          in: "path",
          name: "postId",
          required: true,
          schema: { type: "string" },
          description: "The unique ID of the post",
        },
      },
      schemas: {
        CommentRequest: {
          type: "object",
          required: ["text"],
          properties: {
            text: {
              type: "string",
              example: "This is a fantastic article! Thanks for sharing.",
            },
          },
        },
        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", example: "dev@example.com" },
            password: { type: "string", format: "password", example: "secret123" },
          },
        },
        RegisterRequest: {
          type: "object",
          required: ["username", "email", "password"],
          properties: {
            username: { type: "string", example: "cool_dev" },
            email: { type: "string", example: "dev@example.com" },
            password: { type: "string", format: "password", example: "secret123" },
          },
        },
      },
      responses: {
        Unauthorized: {
          description: "Not authorized, token failed or missing",
        },
        Forbidden: {
          description: "Access denied. Admin privileges required.",
        },
        NotFound: {
          description: "The requested resource was not found",
        },
        // ADDED SUCCESS MESSAGE HERE
        SuccessMessage: {
          description: "Action completed successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Action successful",
                  },
                },
              },
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  // Tell Swagger where to look for your route documentation
  apis: ["./routes/*.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Serve the Swagger UI at the /api-docs route
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));

app.use(express.json());

// Mount routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/posts", require("./routes/posts"));
app.use("/api/comments", require("./routes/comments"));
app.use("/api/admin", require("./routes/admin"));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

const cors = require("cors");
// Allow your future frontend to talk to this API
app.use(cors({ origin: "http://localhost:3000" }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));