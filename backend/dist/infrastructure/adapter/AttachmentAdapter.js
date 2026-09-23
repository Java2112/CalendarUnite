"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttachmentAdapter = void 0;
class AttachmentAdapter {
    attachments = [
        {
            id_archivo: 1,
            id_usuario: 2,
            nombre: 'banner-ansiedad.jpg',
            tipo: 'image/jpeg',
            url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80',
            tamano: 102400,
            fecha_subida: new Date('2026-09-01')
        },
        {
            id_archivo: 2,
            id_usuario: 2,
            nombre: 'banner-coro.jpg',
            tipo: 'image/jpeg',
            url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
            tamano: 145000,
            fecha_subida: new Date('2026-09-01')
        },
        {
            id_archivo: 3,
            id_usuario: 3,
            nombre: 'banner-futsal.jpg',
            tipo: 'image/jpeg',
            url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=600&q=80',
            tamano: 204800,
            fecha_subida: new Date('2026-09-02')
        }
    ];
    async save(attachmentData) {
        const nextId = this.attachments.length > 0 ? Math.max(...this.attachments.map(a => a.id_archivo)) + 1 : 1;
        const newAttachment = {
            id_archivo: nextId,
            fecha_subida: new Date(),
            ...attachmentData
        };
        this.attachments.push(newAttachment);
        return newAttachment;
    }
    async findByUserId(userId) {
        return this.attachments.filter(a => a.id_usuario === Number(userId));
    }
    async findByUrl(url) {
        const found = this.attachments.find(a => a.url === url);
        return found || null;
    }
}
exports.AttachmentAdapter = AttachmentAdapter;
