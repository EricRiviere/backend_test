import { Router } from "express";
import { CartManager } from "../controllers/CartManager.js";

const manager = new CartManager();

const CartRouter = Router();

CartRouter.get("/", async (req, res) => {
  try {
    let result = await manager.getCarts();
    if (result.status === "success") {
      res.status(200).json(result);
    }
  } catch (error) {
    console.error("Error getting carts:", error);
    res.status(500).json({ status: "error", Error: error });
  }
  res.json(await manager.getCarts());
});

CartRouter.post("/", async (req, res) => {
  try {
    let result = await manager.addCart();
    if (result.status === "success") {
      res.status(200).json(result);
    }
  } catch (error) {
    console.error("Error adding cart:", error);
    res.status(500).json({ status: "error", Error: error });
  }
});

CartRouter.get("/:cid", async (req, res) => {
  try {
    let cartId = req.params.cid;
    let result = await manager.getCartById(cartId);
    if (result.status === "success") {
      res.status(200).json(result);
    } else if (result.error === "Cart not found") {
      res.status(404).json(result);
    }
  } catch (error) {
    console.error("Error getting cart:", error);
    res.status(500).json({ status: "error", Error: error });
  }
});

CartRouter.post("/:cid/product/:pid", async (req, res) => {
  try {
    let cartId = req.params.cid;
    let productId = req.params.pid;
    let result = await manager.addProductToCart(cartId, productId);
    if (result.status === "success") {
      res.status(200).json(result);
    } else if (result.error === "Cart not found") {
      res.status(404).json(result);
    } else if (result.error === "Product not found") {
      res.status(404).json(result);
    }
  } catch (error) {
    console.error("Error adding product to cart:", error);
    res.status(500).json({ status: "error", Error: error });
  }
});

export { CartRouter };
