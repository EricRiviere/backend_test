const formSocket = io();

const button = document.querySelector("#form-button");

formSocket.on("products_list", (data) => {
  console.log(data);

  const div = document.querySelector("#productsList");

  let productsGrid = "";

  data.forEach((product) => {
    productsGrid += `
        <div class="product-card">
        <img src="" alt="" class="product-image" />
        <h2 class="product-title">${product.title}</h2>
        <p>ID: ${product.id}</p>
        <p class="product-description">${product.description}</p>
        <p class="product-code">Code: ${product.code}</p>
        <p class="product-price">${product.price} $</p>
        <p class="product-status">Status: ${product.status}</p>
        <p>Stock: ${product.stock}</p>
        <p class="product-category">Category: ${product.category}</p>
        <p>Images: ${product.thumbnails}</p>
        <button class="delete-product" data-product-id=${product.id}>Delete product</button>
        </div>
          `;
  });

  div.innerHTML = productsGrid;

  document
    .querySelector("#productsList")
    .addEventListener("click", async (e) => {
      if (e.target.classList.contains("delete-product")) {
        e.preventDefault();

        const pid = e.target.dataset.productId;

        try {
          const response = await fetch(`/api/products/${pid}`, {
            method: "DELETE",
          });

          if (!response.ok) {
            throw new Error("Error al eliminar el producto");
          }
        } catch (error) {
          console.log(error);
        }
      }
    });
});

button.addEventListener("click", async (e) => {
  e.preventDefault();

  const title = document.querySelector("#product_title");
  const description = document.querySelector("#product_description");
  const code = document.querySelector("#product_code");
  const price = document.querySelector("#product_price");
  const status = document.querySelector("#product_status");
  const stock = document.querySelector("#product_stock");
  const category = document.querySelector("#product_category");
  const thumbnails = document.querySelector("#product_thumbnails");

  const product = {
    title: title.value,
    description: description.value,
    code: code.value,
    price: price.value,
    status: status.value,
    stock: stock.value,
    category: category.value,
    thumbnails: thumbnails.value,
  };

  try {
    const response = await fetch("/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product, null, "\t"),
    });

    if (!response.ok) {
      throw new Error("Error al agregar el producto");
    }

    title.value = "";
    description.value = "";
    code.value = "";
    price.value = "";
    status.value = "";
    stock.value = "";
    category.value = "";
    thumbnails.value = "";
  } catch (error) {
    console.log("Error al eliminar el producto:", error);
  }
});
