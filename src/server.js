import express from "express";
import { ProductRouter } from "./routers/products.routes.js";
import { CartRouter } from "./routers/carts.routes.js";

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/products", ProductRouter);
app.use("/api/carts", CartRouter);

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
