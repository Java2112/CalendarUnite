"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = generateToken;
exports.verifyToken = verifyToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const environment_vars_1 = __importDefault(require("../config/environment-vars"));
function generateToken(payload) {
    return jsonwebtoken_1.default.sign(payload, environment_vars_1.default.JWT_SECRET, { expiresIn: environment_vars_1.default.JWT_EXPIRES_IN });
}
function verifyToken(token) {
    try {
        return jsonwebtoken_1.default.verify(token, environment_vars_1.default.JWT_SECRET);
    }
    catch (error) {
        return null;
    }
}
