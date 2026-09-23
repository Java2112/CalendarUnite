"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
class UserController {
    userApp;
    constructor(userApp) {
        this.userApp = userApp;
    }
    login = async (req, res) => {
        try {
            const { email, password, role } = req.body;
            const result = await this.userApp.login(email, password, role);
            if (!result) {
                return res.status(401).json({
                    error: 'Credenciales inválidas. Por favor verifica el correo y contraseña.'
                });
            }
            return res.json({
                message: `Inicio de sesión exitoso como ${result.user.role}`,
                token: result.token,
                user: result.user
            });
        }
        catch (error) {
            return res.status(500).json({ error: error.message || 'Error interno del servidor' });
        }
    };
    getMe = async (req, res) => {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader) {
                return res.status(401).json({ error: 'No se proporcionó token de autorización' });
            }
            const token = authHeader.replace('Bearer ', '');
            const userProfile = await this.userApp.getProfileByToken(token);
            if (!userProfile) {
                return res.status(401).json({ error: 'Sesión o token inválido' });
            }
            return res.json({ user: userProfile });
        }
        catch (error) {
            return res.status(500).json({ error: error.message || 'Error interno del servidor' });
        }
    };
}
exports.UserController = UserController;
