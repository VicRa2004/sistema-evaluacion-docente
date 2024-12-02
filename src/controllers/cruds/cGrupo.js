import mGrupo from "../../models/mGrupo.js";
import mCiclo from "../../models/mCiclo.js";

const cGrupo = {
    /**
     * Obtiene todos los grupos y los muestra en la vista principal.
     */
    getGrupo: async (req, res) => {
        try {
            const results = await mGrupo.get();

            const error = req.session.grupoError;
            req.session.grupoError = null;

            res.render("admin/cruds/grupo/index", {
                title: "Grupos",
                grupos: results,
                error,
            });
        } catch (err) {
            req.session.grupoError = {
                message: err.message,
            };
            res.redirect("/admin/grupo/");
        }
    },

    /**
     * Renderiza la vista para crear un nuevo grupo.
     */
    getGrupoCreate: async (req, res) => {
        const ciclos = await mCiclo.get();

        res.render("admin/cruds/grupo/create", {
            title: "Grupos - Create",
            error: req.session.grupoError,
            ciclos,
        });
    },

    /**
     * Crea un nuevo grupo en la base de datos.
     */
    grupoCreate: async (req, res) => {
        try {
            const grupo = {
                nombre: req.body.grupo_nombre,
                descripcion: req.body.grupo_descripcion,
                activo: 1,
                ciclo_id: req.body.grupo_ciclo_id,
            };

            if (!grupo.nombre || !grupo.descripcion || !grupo.ciclo_id) {
                req.session.grupoError = {
                    message: "Debe de rellenar todos los campos",
                };
                res.redirect("/admin/grupo/create");
                return;
            }

            await mGrupo.create(grupo);
            req.session.grupoError = null;

            res.redirect("/admin/grupo/");
        } catch (err) {
            req.session.grupoError = {
                message: err.message,
            };
            res.redirect("/admin/grupo/create");
        }
    },

    /**
     * Renderiza la vista para actualizar un grupo existente.
     */
    getGrupoUpdate: async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            const grupo = await mGrupo.getOne(id);

            res.render("admin/cruds/grupo/update", {
                title: "Grupos - Update",
                grupo,
                error: req.session.grupoError,
            });
        } catch (err) {
            req.session.grupoError = {
                message: err.message,
            };
            res.redirect("/admin/grupo/");
        }
    },

    /**
     * Actualiza un grupo existente en la base de datos.
     */
    grupoUpdate: async (req, res) => {
        try {
            const grupo = {
                id: req.body.grupo_id,
                nombre: req.body.grupo_nombre,
                descripcion: req.body.grupo_descripcion,
                activo: req.body.grupo_activo === "on" ? 1 : 0,
                ciclo_id: req.body.grupo_ciclo_id,
            };

            if (
                !grupo.id ||
                !grupo.nombre ||
                !grupo.descripcion ||
                !grupo.ciclo_id
            ) {
                req.session.grupoError = {
                    message: "Debe de rellenar todos los campos",
                };
                res.redirect(`/admin/grupo/update/${grupo.id}`);
                return;
            }

            await mGrupo.update(grupo);
            req.session.grupoError = null;

            res.redirect("/admin/grupo/");
        } catch (err) {
            req.session.grupoError = {
                message: err.message,
            };
            res.redirect(`/admin/grupo/update/${req.body.grupo_id}`);
        }
    },

    /**
     * Elimina un grupo existente de la base de datos.
     */
    grupoDelete: async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            await mGrupo.delete(id);
            req.session.grupoError = null;

            res.redirect("/admin/grupo/");
        } catch (err) {
            req.session.grupoError = {
                message: err.message,
            };
            res.redirect("/admin/grupo/");
        }
    },
};

export default cGrupo;
