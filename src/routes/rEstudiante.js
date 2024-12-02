import { Router } from "express";
import cEstudiante from "../controllers/cEstudiante.js";
import { isAuthenticatedEstudiante } from "../middlewares/auth.js";

const router = Router();

// RUTAS PROTEGIDAS ESTUDIANTE
router.get("/estudiante/", isAuthenticatedEstudiante, cEstudiante.getIndex);

router.get(
    "/estudiante/perfil",
    isAuthenticatedEstudiante,
    cEstudiante.getPerfil
);

router.get("/estudiante/logout", isAuthenticatedEstudiante, cEstudiante.logout);

router.get(
    "/estudiante/grupos",
    isAuthenticatedEstudiante,
    cEstudiante.getGrupos
);

router.get(
    "/estudiante/evaluaciones",
    isAuthenticatedEstudiante,
    cEstudiante.getEvaluacionesPendientes
);

router.post(
    "/estudiante/evaluaciones",
    isAuthenticatedEstudiante,
    cEstudiante.manejarEvaluacion
);

router.get(
    "/estudiante/evaluaciones/:id/:id_pendiente",
    isAuthenticatedEstudiante,
    cEstudiante.getFormEvaluacion
);

export default router;
