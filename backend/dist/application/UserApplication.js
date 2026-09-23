"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserApplication = void 0;
class UserApplication {
    userPort;
    constructor(userPort) {
        this.userPort = userPort;
    }
    async login(email, password, role) {
        let foundUser = null;
        if (role) {
            foundUser = await this.userPort.findByRole(role);
        }
        else if (email && password) {
            const user = await this.userPort.findByEmail(email.trim());
            if (user && user.password === password) {
                foundUser = user;
            }
        }
        if (!foundUser) {
            return null;
        }
        const token = `token-${foundUser.role.toLowerCase()}-${Date.now()}`;
        const userProfile = {
            id: foundUser.id,
            name: foundUser.name,
            email: foundUser.email,
            role: foundUser.role,
            department: foundUser.department,
            avatar: foundUser.avatar
        };
        return { token, user: userProfile };
    }
    async getProfileByToken(token) {
        let role = '';
        if (token.includes('admin'))
            role = 'Admin';
        else if (token.includes('bienestar'))
            role = 'Bienestar';
        else if (token.includes('lider'))
            role = 'Lider';
        if (!role)
            return null;
        const user = await this.userPort.findByRole(role);
        if (!user)
            return null;
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            department: user.department,
            avatar: user.avatar
        };
    }
}
exports.UserApplication = UserApplication;
