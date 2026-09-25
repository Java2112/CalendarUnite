"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerBootstrap = void 0;
const http_1 = __importDefault(require("http"));
const environment_vars_1 = __importDefault(require("../config/environment-vars"));
class ServerBootstrap {
    app;
    constructor(app) {
        this.app = app;
    }
    initialize() {
        return new Promise((resolve, reject) => {
            const server = http_1.default.createServer(this.app);
            const PORT = Number(environment_vars_1.default.PORT ?? 3000);
            server.listen(PORT).on("listening", () => {
                console.log(`Server started on http://localhost:${PORT}`);
                resolve(true);
            })
                .on("error", (err) => {
                console.log(`Se ha generado un error: ${err}`);
                reject(false);
            });
        });
    }
}
exports.ServerBootstrap = ServerBootstrap;
