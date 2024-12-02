import db from "../config/db.js";

const mProfesor = {
    create: async (profesor) => {
        try {
            const nuevoProfesor = {
                activo: 1,
                fecha_alta: new Date(),
                fecha_baja: null,
                ...profesor,
            };

            const [results] = await db.query(
                "CALL profesor_insert(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
                [
                    nuevoProfesor.nombres,
                    nuevoProfesor.clave,
                    nuevoProfesor.password,
                    nuevoProfesor.apellido_materno,
                    nuevoProfesor.apellido_paterno,
                    nuevoProfesor.fecha_nacimiento,
                    nuevoProfesor.genero,
                    nuevoProfesor.activo,
                    nuevoProfesor.fecha_alta,
                    nuevoProfesor.fecha_baja,
                    nuevoProfesor.academia_id,
                    nuevoProfesor.departamento_id,
                ]
            );
            return results;
        } catch (err) {
            console.log(err);
            throw {
                status: 500,
                message: `Error al crear el profesor ${profesor.nombres}`,
            };
        }
    },
    get: async () => {
        try {
            const [results] = await db.query("CALL profesor_select(null);");
            return results[0];
        } catch (err) {
            throw {
                status: 500,
                message: `Error al cargar los profesores`,
            };
        }
    },
    getOne: async (clave) => {
        try {
            const [results] = await db.query("CALL profesor_select_clave(?);", [
                clave,
            ]);
            return results[0][0];
        } catch (err) {
            throw {
                status: 404,
                message: `Error el profesor no existe`,
            };
        }
    },
    getOneId: async (id) => {
        try {
            const [results] = await db.query("CALL profesor_select(?);", [id]);
            return results[0][0];
        } catch (err) {
            throw {
                status: 404,
                message: `Error el profesor no existe`,
            };
        }
    },
    update: async (profesor) => {
        try {
            const [results] = await db.query(
                "CALL profesor_update(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
                [
                    profesor.id,
                    profesor.nombres,
                    profesor.clave,
                    profesor.password,
                    profesor.apellido_materno,
                    profesor.apellido_paterno,
                    profesor.fecha_nacimiento,
                    profesor.genero,
                    profesor.activo,
                    profesor.fecha_alta,
                    profesor.fecha_baja ? profesor.fecha_baja : null,
                    profesor.academia_id,
                    profesor.departamento_id,
                ]
            );
            return results;
        } catch (err) {
            throw {
                status: 500,
                message: `Error al actualizar el profesor ${profesor.nombres}`,
            };
        }
    },
    delete: async (id) => {
        try {
            const [results] = await db.query("CALL profesor_delete(?);", [id]);
            return results[0];
        } catch (err) {
            console.log(err);
            throw {
                status: 500,
                message: `Error al eliminar el profesor`,
            };
        }
    },
    getRange: async (page) => {
        try {
            const [results] = await db.query(
                "CALL ObtenerProfesoresPaginados(?, 10);",
                [page]
            );

            return results[0];
        } catch (err) {
            throw {
                status: 500,
                message: `Error al cargar los profesores`,
            };
        }
    },
    getBusqueda: async (page, query) => {
        try {
            const [results] = await db.query(
                "CALL BuscarProfesoresPaginados(?, 10, ?);",
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

export default mProfesor;
