"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRegisterInput = validateRegisterInput;
const email_validation_1 = require("./email-validation");
function validateRegisterInput(data) {
    const { nombre, correo, telefono } = data;
    if (!nombre || !correo || !telefono) {
        return 'Todos los campos son obligatorios.';
    }
    if (!(0, email_validation_1.isValidEmail)(correo)) {
        return 'El correo electrónico proporcionado no es válido.';
    }
    return null;
}
