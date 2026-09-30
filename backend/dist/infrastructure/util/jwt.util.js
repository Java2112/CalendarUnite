"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = generateToken;
exports.verifyToken = verifyToken;
// Importa la librería jsonwebtoken para firmar y validar tokens
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Importa las variables de entorno
const environment_vars_1 = __importDefault(require("../config/environment-vars"));
// Función que genera y firma un nuevo token JWT
function generateToken(payload) {
    // Firma el payload con la clave secreta y tiempo de expiración
    return jsonwebtoken_1.default.sign(payload, environment_vars_1.default.JWT_SECRET, { expiresIn: environment_vars_1.default.JWT_EXPIRES_IN });
}
// Función que verifica la autenticidad de un token JWT recibido
function verifyToken(token) {
    // Intenta decodificar y validar el token
    try {
        // Verifica la firma con la clave secreta y retorna el payload
        return jsonwebtoken_1.default.verify(token, environment_vars_1.default.JWT_SECRET);
    }
    catch (error) {
        // Si el token es inválido o expiró, retorna null
        return null;
    }
}
