"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = void 0;
// Exportamos createApp para compatibilidad con scripts o tests que lo importen desde la raíz
var app_1 = require("./infrastructure/web/app");
Object.defineProperty(exports, "createApp", { enumerable: true, get: function () { return app_1.createApp; } });
