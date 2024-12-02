import db from "../config/db.js";

const mEstudiante = {
    create: async (est) => {
        try {
            const estudiante = {
                activo: 1,
                fecha_alta: new Date(),
                fecha_baja: null,
                ...est,
            };

            const [results] = await db.query(
                "call estudiante_insert(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
                [
                    estudiante.nombres,
                    estudiante.clave,
                    estudiante.password,
                    estudiante.apellido_materno,
                    estudiante.apellido_paterno,
                    estudiante.fecha_nacimiento,
                    estudiante.genero,
                    estudiante.activo,
                    estudiante.fecha_alta,
                    estudiante.fecha_baja,
                    estudiante.carrera_id,
                ]
            );

            return results;
        } catch (err) {
            console.log(err);
            throw {
                status: 500,
                message: `Error al crear el estudiante ${est.nombres}`,
            };
        }
    },
    get: async () => {
        try {
            const [results] = await db.query("CALL estudiante_select(null);");
            return results[0];
        } catch (err) {
            throw {
                status: 500,
                message: `Error al cargar los usuarios`,
            };
        }
    },
    getOne: async (clave) => {
        try {
            const [results] = await db.query(
                "call estudiante_select_clave(?);",
                [clave]
            );
            return results[0][0];
        } catch (err) {
            throw {
                status: 404,
                message: `Error el Estudiante no existe`,
            };
        }
    },
    getOneId: async (id) => {
        try {
            const [results] = await db.query("call estudiante_select(?);", [
                id,
            ]);
            return results[0][0];
        } catch (err) {
            throw {
                status: 404,
                message: `Error el Estudiante no existe`,
            };
        }
    },
    update: async (estudiante) => {
        try {
            const [results] = await db.query(
                "call estudiante_update(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
                [
                    estudiante.id,
                    estudiante.nombres,
                    estudiante.clave,
                    estudiante.password,
                    estudiante.apellido_materno,
                    estudiante.apellido_paterno,
                    estudiante.fecha_nacimiento,
                    estudiante.genero,
                    estudiante.activo,
                    estudiante.fecha_alta,
                    estudiante.fecha_baja ? estudiante.fecha_baja : null,
                    estudiante.carrera_id,
                ]
            );
            return results;
        } catch (err) {
            throw {
                status: 500,
                message: `Error al crear el usuario ${estudiante.nombre}`,
            };
        }
    },
    delete: async (id) => {
        try {
            const [results] = await db.query("call estudiante_delete(?);", [
                id,
            ]);
            return results[0];
        } catch (err) {
            console.log(err);
            throw {
                status: 500,
                message: `Error al eliminar el estudiante`,
            };
        }
    },
    getRange: async (page) => {
        try {
            const [results] = await db.query(
                "CALL ObtenerEstudiantesPaginados(?, 10);",
                [page]
            );

            return results[0];
        } catch (err) {
            throw {
                status: 500,
                message: `Error al cargar los usuarios`,
            };
        }
    },
    getBusqueda: async (page, query) => {
        try {
            const [results] = await db.query(
                "CALL BuscarEstudiantesPaginados(?, 10, ?);",
                [page, query]
            );

            return results[0];
        } catch (err) {
            throw {
                status: 500,
                message: `Error al cargar los usuarios`,
            };
        }
    },
};

export default mEstudiante;
