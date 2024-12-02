import mAcademia from "../../models/mAcademia.js";
import { formatDate, formatDateForm } from "../../libs/formatDate.js";

const cAcademia = {
    getAcademia: async (req, res) => {
        const results = await mAcademia.get();

        const academias = results.map((academia) => {
            const academia_fecha_de_creacion = formatDate(
                academia.academia_fecha_de_creacion
            );
            return {
                ...academia,
                academia_fecha_de_creacion,
            };
        });

        const error = req.session.academiaError;

        req.session.academiaError = null;

        res.render("admin/cruds/academia/index", {
            title: "Academias",
            academias,
            error,
        });
    },
    getAcademiaCreate: async (req, res) => {
        res.render("admin/cruds/academia/create", {
            title: "Academias - Create",
            error: req.session.academiaError,
        });
    },
    academiaCreate: async (req, res) => {
        try {
            const academia = {
                nombre: req.body.aca_nombre,
                descripcion: req.body.aca_descripcion,
                fecha_de_creacion: req.body.aca_fecha,
            };

            if (
                !academia.nombre ||
                !academia.descripcion ||
                !academia.fecha_de_creacion
            ) {
                req.session.academiaError = {
                    message: "Debe de rellenar todos los campos",
                };
                res.redirect("/admin/academia/create");
                return;
            }

            const results = await mAcademia.create(academia);

            req.session.academiaError = null;

            res.redirect("/admin/academia");
        } catch (err) {
            req.session.academiaError = {
                message: err.message,
            };
            res.redirect("/admin/academia/create");
        }
    },
    getAcademiaUpdate: async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            const academia = await mAcademia.getOne(id);

            console.log(academia);

            const newAcademia = {
                ...academia,
                academia_fecha_de_creacion: formatDateForm(
                    academia.academia_fecha_de_creacion
                ),
            };

            res.render("admin/cruds/academia/update", {
                title: "Academias - Update",
                academia: newAcademia,
                error: req.session.academiaError,
            });
        } catch (err) {
            req.session.academiaError = {
                message: err.message,
            };
            res.redirect("/admin/academia/update/" + id);
        }
    },
    academiaUpdate: async (req, res) => {
        try {
            const academia = {
                id: req.body.aca_id,
                nombre: req.body.aca_nombre,
                descripcion: req.body.aca_descripcion,
                activo: req.body.aca_activo,
                fecha_de_creacion: req.body.aca_fecha,
            };

            if (academia.activo == "on") {
                academia.activo = 1;
            } else {
                academia.activo = 0;
            }

            if (
                !academia.id ||
                !academia.nombre ||
                !academia.descripcion ||
                !academia.fecha_de_creacion
            ) {
                req.session.academiaError = {
                    message: "Debe de rellenar todos los campos",
                };
                res.redirect("/admin/academia/update/" + req.body.aca_id);
                return;
            }

            const results = await mAcademia.update(academia);

            req.session.academiaError = null;

            res.redirect("/admin/academia/");
        } catch (err) {
            req.session.academiaError = {
                message: err.message,
            };
            res.redirect("/admin/academia/update/" + id);
        }
    },

    academiaDelelte: async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            console.log(id);
            const academia = await mAcademia.delete(id);
            req.session.academiaError = null;

            res.redirect("/admin/academia/");
        } catch (err) {
            req.session.academiaError = {
                message: err.message,
            };
            res.redirect("/admin/academia/");
        }
    },
};

export default cAcademia;
