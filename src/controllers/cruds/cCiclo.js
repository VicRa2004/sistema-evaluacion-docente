import mCiclo from "../../models/mCiclo.js";
import { formatDate, formatDateForm } from "../../libs/formatDate.js";

const cCiclo = {
    // Obtener todos los ciclos escolares
    getCiclos: async (req, res) => {
        const results = await mCiclo.get();

        const ciclos = results.map((ciclo) => {
            const ciclo_inicio = formatDate(ciclo.ciclo_inicio);
            const ciclo_final = formatDate(ciclo.ciclo_final);
            return {
                ...ciclo,
                ciclo_inicio,
                ciclo_final,
            };
        });

        const error = req.session.cicloError;

        req.session.cicloError = null;

        res.render("admin/cruds/ciclo/index", {
            title: "Ciclos Escolares",
            ciclos,
            error,
        });
    },

    // Renderizar formulario para crear un nuevo ciclo escolar
    getCicloCreate: async (req, res) => {
        res.render("admin/cruds/ciclo/create", {
            title: "Ciclos Escolares - Crear",
            error: req.session.cicloError,
        });
    },

    // Crear un nuevo ciclo escolar
    cicloCreate: async (req, res) => {
        try {
            const ciclo = {
                nombre: req.body.ciclo_nombre,
                inicio: req.body.ciclo_inicio,
                final: req.body.ciclo_final,
                activo: req.body.ciclo_activo === "on" ? 1 : 0,
            };

            if (!ciclo.nombre || !ciclo.inicio || !ciclo.final) {
                req.session.cicloError = {
                    message: "Debe rellenar todos los campos",
                };
                res.redirect("/admin/ciclo/create");
                return;
            }

            await mCiclo.create(ciclo);

            req.session.cicloError = null;

            res.redirect("/admin/ciclo");
        } catch (err) {
            req.session.cicloError = {
                message: err.message,
            };
            res.redirect("/admin/ciclo/create");
        }
    },

    // Renderizar formulario para actualizar un ciclo escolar
    getCicloUpdate: async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            const ciclo = await mCiclo.getOne(id);

            const newCiclo = {
                ...ciclo,
                ciclo_inicio: formatDateForm(ciclo.ciclo_inicio),
                ciclo_final: formatDateForm(ciclo.ciclo_final),
            };

            res.render("admin/cruds/ciclo/update", {
                title: "Ciclos Escolares - Actualizar",
                ciclo: newCiclo,
                error: req.session.cicloError,
            });
        } catch (err) {
            req.session.cicloError = {
                message: err.message,
            };
            res.redirect("/admin/ciclo/update/" + id);
        }
    },

    // Actualizar un ciclo escolar
    cicloUpdate: async (req, res) => {
        try {
            const ciclo = {
                id: req.body.ciclo_id,
                nombre: req.body.ciclo_nombre,
                inicio: req.body.ciclo_inicio,
                final: req.body.ciclo_final,
                activo: req.body.ciclo_activo === "on" ? 1 : 0,
            };

            if (!ciclo.id || !ciclo.nombre || !ciclo.inicio || !ciclo.final) {
                req.session.cicloError = {
                    message: "Debe rellenar todos los campos",
                };
                res.redirect("/admin/ciclo/update/" + req.body.ciclo_id);
                return;
            }

            await mCiclo.update(ciclo);

            req.session.cicloError = null;

            res.redirect("/admin/ciclo");
        } catch (err) {
            req.session.cicloError = {
                message: err.message,
            };
            res.redirect("/admin/ciclo/update/" + req.body.ciclo_id);
        }
    },

    // Eliminar un ciclo escolar
    cicloDelete: async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            await mCiclo.delete(id);

            req.session.cicloError = null;

            res.redirect("/admin/ciclo");
        } catch (err) {
            req.session.cicloError = {
                message: err.message,
            };
            res.redirect("/admin/ciclo");
        }
    },
};

export default cCiclo;
