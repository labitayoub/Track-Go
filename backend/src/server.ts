import Express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/database.js";
import userRoute from "./routes/userRoute.js";

dotenv.config();
const app = Express();

app.use(cors());
app.use(Express.json());

connectDB();

const PORT = process.env.PORT || 3001;

// Routes
app.use('/api/user', userRoute);

// 404 Handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route non trouvée' });
});

app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});

