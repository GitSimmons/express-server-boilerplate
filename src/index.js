"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// seperate the app from the server so we can test it
const app_1 = require("./app");
const PORT = 8000;
app_1.app.listen(PORT, () => console.log(`Server is now listening on port ${PORT}`));
