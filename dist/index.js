"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const openai_1 = __importDefault(require("openai"));
require("dotenv").config();
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
let conversationHistory = "";
const openai = new openai_1.default({
    apiKey: process.env.API_KEY_OPENAI,
});
app.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_1, _b, _c;
    var _d, _e;
    const message = req.body.message;
    conversationHistory += message + "\n";
    let aiResponse = "";
    try {
        const response = yield openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                { role: "assistant", content: conversationHistory }
            ],
            // response_format: { "type": "json_object" },
            stream: true
        });
        console.log("Response", response);
        try {
            for (var _f = true, response_1 = __asyncValues(response), response_1_1; response_1_1 = yield response_1.next(), _a = response_1_1.done, !_a; _f = true) {
                _c = response_1_1.value;
                _f = false;
                const part = _c;
                aiResponse = ((_e = (_d = part.choices[0]) === null || _d === void 0 ? void 0 : _d.delta) === null || _e === void 0 ? void 0 : _e.content) || "";
                console.log("AIRESPONSE", aiResponse);
                conversationHistory += aiResponse + "\n";
                res.write(aiResponse);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_f && !_a && (_b = response_1.return)) yield _b.call(response_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        res.end();
    }
    catch (error) {
        res.status(500).send("error al procesar la solicitud");
        console.error("Error al realizar la transmision");
    }
}));
//Streaming
// Experiencia de usuario fluida: el usuario no tiene que esperar hasta que se genere la respuesta completa.
// Más fácil de leer: cuando se lanzó ChatGPT por primera vez, me gustó que respondiera como si estuvieras
//  hablando con alguien, lo que se lee de manera diferente a otras formas de escritura.
// Reducir el uso de memoria: este es un beneficio del streaming en general: descarga los datos sin tener que almacenarlos
//  en la memoria intermedia.
// En el contexto de la transmisión de datos, un fragmento se refiere a una pieza o fragmento de
//  datos que se maneja, procesa o transmite individualmente como parte de un flujo de datos más grande.
app.listen("3000", () => {
    console.log("App en el puerto 3000");
});
