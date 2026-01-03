import express from "express";

import { mountMiddleware } from "./mountRoutes.js";

const app = express();

mountMiddleware(app);

const PORT = process.env.PORT || 3000;
app.listen(PORT, (error) => {
    if (error) {
        throw error;
    }
    console.log(`Express app listening on port ${PORT}`);
});
