import cors from "cors";
import express from "express";
import authRoutes from "./routes/auth.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.listen(5000, () => {
    console.log("Serveur running on port 5000");
});