export function formatDate(date) {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(date).toLocaleDateString("es-ES", options);
}

export function formatDateForm(date) {
    const fecha = new Date(date);
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, "0"); // Mes en formato de dos dígitos
    const day = String(fecha.getDate()).padStart(2, "0"); // Día en formato de dos dígitos

    return `${year}-${month}-${day}`; // Formato 'YYYY-MM-DD'
}
