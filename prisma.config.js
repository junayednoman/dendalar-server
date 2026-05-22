"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("prisma/config");
const index_1 = __importDefault(require("./src/app/config/index"));
exports.default = (0, config_1.defineConfig)({
    datasource: {
        url: index_1.default.database_url,
    },
});
//# sourceMappingURL=prisma.config.js.map