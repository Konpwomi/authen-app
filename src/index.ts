import express from "express";
import authRoutes from "./routes/authRoutes";
import cors from 'cors';
const app = express();
const port = 5000;

app.use(express.json());
app.use(
    cors({
      credentials: true,
      origin: ["http://localhost:3000"],
    }),
  );
app.use("/api", authRoutes);


app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
}) 