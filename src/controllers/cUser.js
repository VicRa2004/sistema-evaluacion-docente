import mUser from "../models/mUser.js";

const cUser = {
    getLoginForm: (req, res) => {
        res.render("login", {
            title: "Iniciar sesion",
            error: req.session.userError,
        });
    },
    login: async (req, res) => {
        try {
            if (!req.body.user_clave || !req.body.user_password) {
                req.session.userError = {
                    message: "Debe de rellenar todos los datos",
                };
                res.redirect("/login");
                return;
            }

            console.log(req.body);

            const user = await mUser.getOne(req.body.user_clave);

            console.log(user.usuario_rol_id);

            if (user.usuario_password == req.body.user_password) {
                if (user.usuario_rol_id == 1) {
                    req.session.admin = user;
                    res.redirect("/admin");
                    return;
                }

                if (user.usuario_rol_id == 2) {
                    req.session.profesor = user;
                    res.redirect("/profesor");
                    return;
                }

                if (user.usuario_rol_id == 3) {
                    req.session.estudiante = user;
                    res.redirect("/estudiante");
                    return;
                }
            }
            req.session.userError = {
                message: "La contraseña es incorrecta",
            };
            res.redirect("/login");
        } catch (err) {
            req.session.userError = {
                message: err.message,
            };
            res.redirect("/login");
        }
    },
};

export default cUser;
