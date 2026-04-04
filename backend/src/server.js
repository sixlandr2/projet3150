import cors from "cors";
import { config } from "dotenv";
import express from "express";
import annoncesRoutes from './routes/annonces.routes.js';
import authRoutes from "./routes/auth.routes.js";
import batimentsRoutes from './routes/batiments.routes.js';
import invitationsRoutes from './routes/invitations.routes.js';
config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/annonces', annoncesRoutes);

app.use("/api/auth", authRoutes);

app.use('/api/invitations', invitationsRoutes);

app.use('/api/batiments', batimentsRoutes);

app.listen(3000, () => {
    console.log("Serveur running on port 3000");
});