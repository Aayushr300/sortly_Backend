require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT;
const path = require("path");

const urlRoutes = require("./src/routes/shorturl.route");
const getDb = require("./src/config/db");
const db = getDb();
const urlSchema = require("./src/models/shorturl.model");
const authRoutes = require("./src/routes/auth.routes");
const { verifyToken } = require("./src/middleware/auth");
const localUserRoutes = require("./src/routes/localUser.routes");
const subScriptionRoutes = require("./src/routes/subscription.route");
const adminRoutes = require("./src/routes/admin.route");
const planRoutes = require("./src/routes/admin/plan");
const policyRoutes = require("./src/routes/policy.route");
const testEmail = require("./src/routes/testEmail");
const userRoutes = require("./src/routes/user.routes");
const cors = require("cors");

const allowedOrigins = [
  "https://sortify-two-theta.vercel.app", // production
  "http://localhost:3000", // local dev
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("❌ Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Preflight
app.options("/*", cors());

const {
  redirectFromShortUrl,
} = require("./src/controllers/shorturl.controlers");

app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.set("trust proxy", true);

app.use("/api/auth", authRoutes);
app.use("/api/create", verifyToken, urlRoutes);
app.use("/api/localuser", localUserRoutes);
app.use("/api/subscription", verifyToken, subScriptionRoutes);
app.use("/api/subscription/verify-payment", verifyToken, subScriptionRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin/plans", planRoutes);
app.use("/api/pages", policyRoutes);
app.use("/api/users", verifyToken, userRoutes);
app.use("/api/emails", testEmail);

app.get("/:id", redirectFromShortUrl);

app.get("/", (req, res) => {
  res.send("Server is starting");
});

app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});
