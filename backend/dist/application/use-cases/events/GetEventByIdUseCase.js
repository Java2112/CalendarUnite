"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetEventByIdUseCase = void 0;
class GetEventByIdUseCase {
    eventPort;
    constructor(eventPort) {
        this.eventPort = eventPort;
    }
    async execute(id) {
        return this.eventPort.findById(id);
    }
}
exports.GetEventByIdUseCase = GetEventByIdUseCase;
