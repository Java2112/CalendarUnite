"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserAdapter = void 0;
class UserAdapter {
    users = [
        {
            id: 'usr-admin',
            name: 'Carlos Mendoza',
            email: 'admin@unite.edu.co',
            password: 'admin123',
            role: 'Admin',
            department: 'Administración General',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
        },
        {
            id: 'usr-bienestar',
            name: 'Dra. María Elena Restrepo',
            email: 'bienestar@unite.edu.co',
            password: 'bienestar123',
            role: 'Bienestar',
            department: 'Coordinación de Bienestar Universitario',
            avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80'
        },
        {
            id: 'usr-lider',
            name: 'Juan Pablo Ríos',
            email: 'lider@unite.edu.co',
            password: 'lider123',
            role: 'Lider',
            department: 'Líder Estudiantil Interfacultades',
            avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80'
        }
    ];
    async findByEmail(email) {
        const user = this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
        return user || null;
    }
    async findByRole(role) {
        const user = this.users.find(u => u.role.toLowerCase() === role.toLowerCase());
        return user || null;
    }
    async findById(id) {
        const user = this.users.find(u => u.id === id);
        return user || null;
    }
}
exports.UserAdapter = UserAdapter;
