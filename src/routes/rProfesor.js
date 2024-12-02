import { Router } from "express";
import cProfesor from "../controllers/cProfesor.js";
import { isAuthenticatedProfesor } from "../middlewares/auth.js";

const router = Router();

// RUTAS PROTEGIDAS ESTUDIANTE
router.get("/profesor/", isAuthenticatedProfesor, cProfesor.getIndex);

router.get("/profesor/perfil", isAuthenticatedProfesor, cProfesor.getPerfil);

router.get("/profesor/logout", isAuthenticatedProfesor, cProfesor.logout);

router.get("/profesor/grupos", isAuthenticatedProfesor, cProfesor.getGrupos);

router.get(
    "/profesor/grupos/:id",
    isAuthenticatedProfesor,
    cProfesor.getGrupoInfo
);

router.get("/profesor/resultados", cProfesor.getResultados)

export default router;
