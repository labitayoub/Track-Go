import Express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/database.js";
import userRoute from "./routes/userRoute.js";
import camionRoute from "./routes/camionRoute.js";
import remorqueRoute from "./routes/remorqueRoute.js";
import pneuRoute from "./routes/pneuRoute.js";
import trajetRoute from "./routes/trajetRoute.js";
import maintenanceRoute from "./routes/maintenanceRoute.js";

dotenv.config();
const app = Express();

app.use(cors());
app.use(Express.json());

connectDB();

const PORT = process.env.PORT || 3001;

// Routes
app.use('/api/user', userRoute);
app.use('/api/camion', camionRoute);
app.use('/api/remorque', remorqueRoute);
app.use('/api/pneu', pneuRoute);
app.use('/api/trajet', trajetRoute);
app.use('/api/maintenance', maintenanceRoute);

// 404 Handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route non trouvée' });
});

app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});

