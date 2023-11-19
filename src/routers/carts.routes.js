import { Router } from "express";
import { CartManager } from "../controllers/CartManager.js";

const manager = new CartManager();

const CartRouter = Router();

CartRouter.get("/", async (req, res) => {
  res.json(await manager.getCarts());
});

CartRouter.post("/", async (req, res) => {
  res.json(await manager.addCart());
});

CartRouter.get("/:cid", async (req, res) => {
  let cartId = req.params.cid;
  res.json(await manager.getCartById(cartId));
});

CartRouter.post("/:cid/product/:pid", async (req, res) => {
  let cartId = req.params.cid;
  let productId = req.params.pid;
  res.json(await manager.addProductToCart(cartId, productId));
});

export { CartRouter };
