"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetEventsUseCase = void 0;
class GetEventsUseCase {
    eventPort;
    constructor(eventPort) {
        this.eventPort = eventPort;
    }
    async execute(modality, search) {
        return this.eventPort.findAll(modality, search);
    }
}
exports.GetEventsUseCase = GetEventsUseCase;
