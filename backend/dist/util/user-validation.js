"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRegisterInput = validateRegisterInput;
// Importa la función de validación de formato de correo
const email_validation_1 = require("./email-validation");
// Función utilitaria que valida los datos requeridos para registrar a un asistente
function validateRegisterInput(data) {
    // Desestructura los campos recibidos
    const { nombre, correo, telefono } = data;
    // Comprueba que todos los campos obligatorios estén presentes
    if (!nombre || !correo || !telefono) {
        // Retorna mensaje de error si falta algún campo
        return 'Todos los campos son obligatorios.';
    }
    // Valida que el correo tenga una estructura correcta
    if (!(0, email_validation_1.isValidEmail)(correo)) {
        // Retorna mensaje de error si el formato del correo es inválido
        return 'El correo electrónico proporcionado no es válido.';
    }
    // Retorna null indicando que los datos son válidos
    return null;
}
