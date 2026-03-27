import cors from "cors";
import { config } from "dotenv";
import express from "express";
import authRoutes from "./routes/auth.routes.js";
config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.listen(3000, () => {
    console.log("Serveur running on port 3000");
});