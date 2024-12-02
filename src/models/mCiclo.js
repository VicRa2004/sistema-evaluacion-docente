import db from "../config/db.js";

const mCicloEscolar = {
    // Crear un nuevo ciclo escolar
    create: async (ciclo) => {
        try {
            const [results] = await db.query("CALL ciclo_insert(?, ?, ?, ?);", [
                ciclo.nombre,
                ciclo.inicio,
                ciclo.final,
                ciclo.activo,
            ]);
            return results;
        } catch (err) {
            console.error(err);
            throw {
                status: 500,
                message: `Error al crear el ciclo escolar ${ciclo.nombre}`,
            };
        }
    },

    // Obtener todos los ciclos escolares
    get: async () => {
        try {
            const [results] = await db.query("CALL ciclo_select(NULL);");
            return results[0]; // Retorna la lista de ciclos escolares
        } catch (err) {
            console.error(err);
            throw {
                status: 500,
                message: "Error al cargar los datos de los ciclos escolares",
            };
        }
    },

    // Obtener un ciclo escolar específico por ID
    getOne: async (id) => {
        try {
            const [results] = await db.query("CALL ciclo_select(?);", [id]);
            return results[0][0]; // Retorna un único ciclo escolar
        } catch (err) {
            console.error(err);
            throw {
                status: 404,
                message: `Error: el ciclo escolar con ID ${id} no existe`,
            };
        }
    },

    // Actualizar un ciclo escolar existente
    update: async (ciclo) => {
        try {
            const [results] = await db.query(
                "CALL ciclo_update(?, ?, ?, ?, ?);",
                [
                    ciclo.id,
                    ciclo.nombre,
                    ciclo.inicio,
                    ciclo.final,
                    ciclo.activo,
                ]
            );
            return results;
        } catch (err) {
            console.error(err);
            throw {
                status: 500,
                message: `Error al actualizar el ciclo escolar ${ciclo.nombre}`,
            };
        }
    },

    // Eliminar un ciclo escolar
    delete: async (id) => {
        try {
            const [results] = await db.query("CALL ciclo_delete(?);", [id]);
            return results;
        } catch (err) {
            console.error(err);
            throw {
                status: 500,
                message: `Error al eliminar el ciclo escolar con ID ${id}`,
            };
        }
    },
};

export default mCicloEscolar;
