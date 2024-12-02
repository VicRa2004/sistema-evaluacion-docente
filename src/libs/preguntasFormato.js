export function transformarRespuestas(respuestas) {
    const resultado = [];

    for (const key in respuestas) {
        // Extraer IDs y respuesta usando destructuración
        const [_, idCriterio, idPregunta] = key.match(
            /^respuesta_(\d+)_(\d+)$/
        );
        resultado.push({
            id_pregunta: parseInt(idPregunta, 10),
            id_criterio: parseInt(idCriterio, 10),
            respuesta: respuestas[key],
        });
    }

    return resultado;
}
