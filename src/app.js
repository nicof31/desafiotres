import ProductManager from "./ProductManager.js";
import express from "express";
const app = express();

let productList = new ProductManager("../Files/Productos.json");

//configuracion puerto
const PUERTO = process.env.port || 8080;
app.listen(PUERTO, () => {
  console.log(`El servidor esta escuchando en el puerto ${PUERTO}...`);
});

//para interpretar mejor los datos de las query?
app.use(express.urlencoded({ extended: true }));

//http://localhost:8080
app.get("/", async (req, res) => {
  res.send(`Gestor de productos`);
});

//ENDPOINTS
//filtro de productos por cantidad
//http://localhost:8080/products
//http://localhost:8080/products?limit=25
app.get("/products", async (req, res) => {
  const fitrarLimit = await productList.getProducts();
  if ((req.query.limit > 0)) {
    const limitSeteado = req.query.limit;
    const resultBusq = fitrarLimit.filter(({ id }) => id <= limitSeteado);
    console.log(resultBusq);
    res.send(resultBusq);
  } else {
    res.send(fitrarLimit);
  }
});

//filtro de productos por id
//http://localhost:8080/products/1
app.get("/products/:pid", async (req, res) => {
  const idProducts = req.params.pid;
  const busquedaIdProd = await productList.getProductById(idProducts);
  if (!busquedaIdProd) {
    return res.send({
      error: `El producto id '${idProducts}' buscado no existe`,
    });
  }
  res.send({ busquedaIdProd });
});

