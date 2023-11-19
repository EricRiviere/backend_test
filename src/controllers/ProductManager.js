import fs from "fs";
import { nanoid } from "nanoid";

class ProductManager {
  constructor() {
    this.path = "./src/models/products.json";
    if (fs.existsSync(this.path)) {
      let products = fs.readFileSync(this.path, "utf-8");
      this.products = JSON.parse(products);
    } else {
      this.products = [];
      fs.writeFileSync(this.path, JSON.stringify(this.products, null, "\t"));
    }
  }

  getProducts = async () => {
    let products = await fs.promises.readFile(this.path, "utf-8");
    return JSON.parse(products);
  };

  writeProducts = async (products) => {
    await fs.promises.writeFile(
      this.path,
      JSON.stringify(products, null, "\t")
    );
  };

  addProduct = async ({
    title,
    description,
    code,
    price,
    status = true,
    stock,
    category,
    thumbnails,
  }) => {
    let products = await this.getProducts();
    let existingProduct = products.find((product) => product.code === code);
    if (existingProduct) return "Error: existing product with provided code.";
    let productId = nanoid(10);
    let newProduct = {
      id: productId,
      title,
      description,
      price,
      status,
      stock,
      category,
      thumbnails,
    };
    products.push(newProduct);
    await this.writeProducts(products);
    return "Product added to products list.";
  };

  findProductById = async (id) => {
    let products = await this.getProducts();
    let productById = products.find((product) => product.id === id);
    return productById;
  };

  getProductById = async (id) => {
    let product = await this.findProductById(id);
    if (!product) return "Error: product not found.";
    return product;
  };

  deleteProduct = async (id) => {
    let products = await this.getProducts();
    let product = await this.getProductById(id);
    if (!product) return "Error: product not found";
    let newProducts = products.filter((prod) => prod.id !== id);
    await this.writeProducts(newProducts);
    return "Product deleted from products list.";
  };

  updateProduct = async (id, newProduct) => {
    let products = await this.getProducts();
    let product = await this.getProductById(id);
    if (!product) return "Error: product not found";
    let newProducts = products.filter((prod) => prod.id !== id);
    newProducts.push({ id, ...newProduct });
    await this.writeProducts(newProducts);
    return "Product updated in product list.";
  };
}

export { ProductManager };
