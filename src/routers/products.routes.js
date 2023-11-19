import { Router } from "express";
import { ProductManager } from "../controllers/ProductManager.js";

const manager = new ProductManager();
const ProductRouter = Router();

ProductRouter.get("/", async (req, res) => {
  let limit = req.query.limit;
  let products = await manager.getProducts();
  if (!limit) res.json(products);
  let limitedProducts = products.filter(
    (product) => products.indexOf(product) < Number(limit)
  );
  res.json(limitedProducts);
});

ProductRouter.post("/", async (req, res) => {
  let product = req.body;
  res.json(await manager.addProduct(product));
});

ProductRouter.get("/:pid", async (req, res) => {
  let productId = req.params.pid;
  res.json(await manager.getProductById(productId));
});

ProductRouter.delete("/:pid", async (req, res) => {
  let productId = req.params.pid;
  res.json(await manager.deleteProduct(productId));
});

ProductRouter.put("/:pid", async (req, res) => {
  let productId = req.params.pid;
  let newProduct = req.body;
  res.json(await manager.updateProduct(productId, newProduct));
});

export { ProductRouter };
