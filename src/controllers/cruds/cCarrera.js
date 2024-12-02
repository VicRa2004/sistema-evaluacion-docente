import mCarrera from "../../models/mCarrera.js";
import { formatDate, formatDateForm } from "../../libs/formatDate.js";

const cCarrera = {
    getCarrera: async (req, res) => {
        const carreras = await mCarrera.get();

        const error = req.session.carreraError;

        req.session.carreraError = null;

        res.render("admin/cruds/carrera/index", {
            title: "Carreras",
            carreras,
            error,
        });
    },
    getCarreraCreate: async (req, res) => {
        res.render("admin/cruds/carrera/create", {
            title: "Carreras - Create",
            error: req.session.carreraError,
        });
    },
    carreraCreate: async (req, res) => {
        try {
            console.log(req.body);
            const carrera = {
                clave: req.body.carr_clave,
                nombre: req.body.carr_nombre,
            };

            if (!carrera.nombre || !carrera.clave) {
                req.session.carreraError = {
                    message: "Debe de rellenar todos los campos",
                };
                res.redirect("/admin/carrera/create");
                return;
            }

            const results = await mCarrera.create(carrera);

            req.session.carreraError = null;

            res.redirect("/admin/carrera");
        } catch (err) {
            req.session.carreraError = {
                message: err.message,
            };
            res.redirect("/admin/carrera/create");
        }
    },
    getCarreraUpdate: async (req, res) => {
        const id = parseInt(req.params.id);

        try {
            const carrera = await mCarrera.getOne(id);

            res.render("admin/cruds/carrera/update", {
                title: "Carreras - Update",
                carrera,
                error: req.session.carreraError,
            });
        } catch (err) {
            req.session.carreraError = {
                message: err.message,
            };
            res.redirect("/admin/carrera/update/" + id);
        }
    },
    carreraUpdate: async (req, res) => {
        const carrera = {
            id: req.body.carr_id,
            clave: req.body.carr_clave,
            nombre: req.body.carr_nombre,
        };

        try {
            if (!carrera.id || !carrera.nombre || !carrera.clave) {
                req.session.carreraError = {
                    message: "Debe de rellenar todos los campos",
                };
                res.redirect("/admin/carrera/update/" + req.body.carr_id);
                return;
            }

            const results = await mCarrera.update(carrera);

            req.session.carreraError = null;

            res.redirect("/admin/carrera/");
        } catch (err) {
            req.session.carreraError = {
                message: err.message,
            };
            res.redirect("/admin/carrera/update/" + carrera.id);
        }
    },

    carreraDelelte: async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            //console.log(id);
            const carrera = await mCarrera.delete(id);
            req.session.carreraError = null;

            res.redirect("/admin/carrera/");
        } catch (err) {
            req.session.carreraError = {
                message: err.message,
            };
            res.redirect("/admin/carrera/");
        }
    },
};

export default cCarrera;
