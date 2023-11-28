import { Router } from "express";
import { ProductManager } from "../controllers/ProductManager.js";

const viewsRouter = Router();
const manager = new ProductManager();

viewsRouter.get("/", async (req, res) => {
  let allProducts = await manager.getProducts();
  res.render("home", {
    title: "Products",
    products: allProducts,
    cssFile: "style.css",
  });
});

viewsRouter.get("/realtimeproducts", (req, res) => {
  res.render("realTimeProducts", {
    title: "Real Time Products",
    cssFile: "style.css",
  });
});

viewsRouter.get("/:pid", async (req, res) => {
  let pId = req.params.pid;
  let prod = await manager.getProductById(pId);
  res.render("product", {
    title: "Product",
    product: prod.product,
    cssFile: "style.css",
  });
});

export { viewsRouter };
