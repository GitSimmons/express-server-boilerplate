// seperate the app from the server so we can test it
import { app } from "./app";
const PORT = 8000;

app.listen(PORT, () => console.log(`Server is now listening on port ${PORT}`));
