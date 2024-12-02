import db from "../config/db.js";

const mUser = {
    getOne: async (clave) => {
        try {
            const [results] = await db.query(
                "SELECT * FROM usuarios WHERE usuario_clave = ?;",
                [clave]
            );
            return results[0];
        } catch (err) {
            throw {
                status: 500,
                message: `Error al buscar el usuario.`,
            };
        }
    },
};

export default mUser;
