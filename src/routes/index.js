import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
    res.render("index", { title: "App Evaluacion" });
});

router.get("/about", (req, res) => {
    res.render("about", { title: "Sobre Nosotros" });
});

export default router;
