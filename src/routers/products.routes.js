import { Router } from "express";
import { ProductManager } from "../controllers/ProductManager.js";

const manager = new ProductManager();
const ProductRouter = Router();

ProductRouter.get("/", async (req, res) => {
  try {
    let limit = req.query.limit;
    let products = await manager.getProducts();
    if (!limit) {
      res.status(200).json({ status: "success", data: products });
    } else if (isNaN(parseInt(limit))) {
      res
        .status(404)
        .json({ status: "error", message: "Limit must be a number" });
    } else {
      let limitedProducts = products.filter(
        (product) => products.indexOf(product) < Number(limit)
      );
      res.status(200).json({ status: "success", data: limitedProducts });
    }
  } catch (error) {
    console.error("Error getting products:", error);
    res.status(500).json({ status: "error", Error: error });
  }
});

ProductRouter.post("/", async (req, res) => {
  try {
    let product = req.body;
    let result = await manager.addProduct(product);

    if (result.status === "success") {
      res.status(200).json(result);
    } else if (result.error === "Missing property") {
      res.status(422).json(result);
    } else if (result.error === "Existing product with provided code") {
      res.status(409).json(result);
    }
  } catch (error) {
    console.error("Error posting product:", error);
    res.status(500).json({ status: "error", Error: error });
  }
});

ProductRouter.get("/:pid", async (req, res) => {
  try {
    let productId = req.params.pid;
    let result = await manager.getProductById(productId);

    if (result.status === "success") {
      res.status(200).json(result);
    } else if (result.error === "Product not found") {
      res.status(404).json(result);
    }
  } catch (error) {
    console.error("Error getting product by Id: ", error);
    res.status(500).json({ status: "error", Error: error });
  }
});

ProductRouter.delete("/:pid", async (req, res) => {
  try {
    let productId = req.params.pid;
    let result = await manager.deleteProduct(productId);
    if (result.status === "success") {
      res.status(200).json(result);
    } else if (result.status === "error") {
      res.status(404).json(result);
    }
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ status: "error", Error: error });
  }
});

ProductRouter.put("/:pid", async (req, res) => {
  try {
    let productId = req.params.pid;
    let newProduct = req.body;
    let result = await manager.updateProduct(productId, newProduct);
    if (result.status === "success") {
      res.status(200).json(result);
    } else if (result.error === "Product not found") {
      res.status(404).json(result);
    }
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ status: "error", Error: error });
  }
});

export { ProductRouter };
