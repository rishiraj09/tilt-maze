import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import path from "path";
import compression from "compression";
import connectToDatabase from "./config/coreDb";


// routes import
import auth from "./routes/auth";
import game from "./routes/game";

dotenv.config();

const app = express();


app.use(cors());

// regular middlewares
app.use(compression({ filter: shouldCompress }));

function shouldCompress(req: Request, res: Response) {
    if (req.headers["x-no-compression"]) {
      // don't compress responses with this request header
      return false;
    }
  
    // fallback to standard filter function
    return compression.filter(req, res);
  }

  app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// cookies and file middleware
app.use(cookieParser());

// morgan middleware
app.use(morgan("tiny"));
app.use('/public', express.static(path.join(__dirname, 'public')));



// router middleware
app.use("/api/v1/auth", auth);
app.use("/api/v1/game", game);

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001; // Explicitly parse the port to a number

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
  connectToDatabase()
});
  