export const isAuthenticatedEstudiante = (req, res, next) => {
    if (req.session.estudiante) {
        return next();
    }

    res.redirect("/login");
};

export const isAuthenticatedAdmin = (req, res, next) => {
    if (req.session.admin) {
        return next();
    }
    res.redirect("/login");
};

export const isAuthenticatedProfesor = (req, res, next) => {
    if (req.session.profesor) {
        return next();
    }

    res.redirect("/login");
};
