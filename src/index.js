import express from "express";
import morgan from "morgan";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import error from "./middlewares/error.js";
import indexRoutes from "./routes/index.js";
import adminRoutes from "./routes/rAdmin.js";
import estudianteRoutes from "./routes/rEstudiante.js";
import profesorRoutes from "./routes/rProfesor.js";
import evaluacionRoutes from "./routes/rEvaluacion.js";
import userRoutes from "./routes/rUser.js";
import session from "express-session";

// Initialize express
const app = express();

const __dirname = dirname(fileURLToPath(import.meta.url));

// static files
app.use(express.static(join(__dirname, "public")));

// settings
app.set("port", process.env.PORT || 3000);
app.set("views", join(__dirname, "views"));
app.set("view engine", "ejs");

// middlewares
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
    session({
        secret: "mi_secreto",
        resave: true,
        saveUninitialized: true,
    })
);

// routes
app.use(userRoutes);
app.use(estudianteRoutes);
app.use(profesorRoutes);
app.use(adminRoutes);
app.use(evaluacionRoutes);
app.use(indexRoutes);

app.use(error.e404);

// listening the Server
app.listen(app.get("port"));
const port = app.get("port");

console.log(`SERVER RUN
Page in: http://localhost:${port}`);
