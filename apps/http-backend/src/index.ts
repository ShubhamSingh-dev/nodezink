import express from "express";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.route";
import roomRoutes from "./routes/room.route";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3001;

app.use(express.json());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/", roomRoutes);

app.listen(PORT, () => {
  console.log(`Server listening on port http://localhost:${PORT}`);
});
