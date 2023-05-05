import fs from "fs";

export default class ProductManager {
  constructor(path) {
    this.path = path;
  }

  addProduct = async (title, description, price, thumbnail, code, stock) => {
    if (!title || !description || !price || !thumbnail || !code || !stock) {
      console.log(
        `\x1b[31m+------------------------------------------------------------+\n|\t\t\t\t\t\t\t     |`
      );
      console.error(
        "|\tError: Todos los campos son obligatorios\t     |\n|\t\t\t\t\t\t\t|"
      );
      console.log(
        `+------------------------------------------------------------+\x1b[97m`
      );
    }

    let productGest = [];
    try {
      const data = await fs.promises.readFile(this.path, "utf-8");
      productGest = JSON.parse(data);
    } catch (error) {
      return error;
    } finally {
      const product = {
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
      };

      // genero el id autoincremental
      if (productGest.length === 0) {
        product.id = 1;
      } else {
        product.id = productGest[productGest.length - 1].id + 1;
      }
      // Comprobar si el código ya está en uso
      const codeVerificar = productGest.find(
        (product) => product.code === code
      );
      if (codeVerificar != null) {
        console.log(
          `\x1b[31m+----------------------------------------------------------------------------------+\n|\t\t\t\t\t\t\t\t\t\t   |`
        );
        console.error(
          "|\tError addProduct: Este producto ya existe, cargue un nuevo codigo\t   |\n|\t\t\t\t\t\t\t\t\t\t   |"
        );
        console.log(
          `+----------------------------------------------------------------------------------+\x1b[97m`
        );
      } else {
        productGest.push(product);
        await fs.promises.writeFile(
          this.path,
          JSON.stringify(productGest, null, "\t")
        );
      }
    }

    return productGest;
  };

  getProducts = async () => {
    if (fs.existsSync(this.path)) {
      const data = await fs.promises.readFile(this.path, "utf-8");
      const productRta = JSON.parse(data);
      console.log(
        `------------------------------------------------------------`
      );
      console.log(`Productos guardados en JSON:`);
      console.log(
        `------------------------------------------------------------`
      );
      console.log(productRta);
      return productRta;
    } else {
      console.log(
        `------------------------------------------------------------`
      );
      console.log(`Productos guardados en JSON:`);
      console.log([]);

      console.log(
        `------------------------------------------------------------`
      );
      return [];
    }
  };

  getProductById = async (idParm) => {
    const busquedaArr = await fs.promises.readFile(this.path, "utf-8");
    const productRtaId = JSON.parse(busquedaArr);
    const resultBusq = productRtaId.find(({ id }) => id == idParm);
    if (!resultBusq) {
      console.log(
        `\x1b[31m+------------------------------------------------------------+\n|\t\t\t\t\t\t\t     |`
      );
      console.error(
        "|\t    ERROR: el producto buscado no existe\t     |\n|\t\t\t\t\t\t\t     |"
      );
      console.log(
        `+------------------------------------------------------------+\x1b[97m`
      );
    } else {
      console.log(
        `------------------------------------------------------------`
      );
      console.log(`El producto con ID buscado es:`);
      console.log(
        `------------------------------------------------------------`
      );
      console.log(resultBusq);
      return resultBusq;
    }
  };

  getUpdateProduct = async (
    idUpdate,
    title,
    description,
    price,
    thumbnail,
    code,
    stock
  ) => {
    if (
      !idUpdate ||
      !title ||
      !description ||
      !price ||
      !thumbnail ||
      !code ||
      !stock
    ) {
      console.log(
        `\x1b[31m+-----------------------------------------------------------------------------------------------+\n|\t\t\t\t\t\t\t\t\t\t\t\t|`
      );
      console.error(
        "|\t    ERROR UpdateProduct: faltan parametros, Todos los campos son obligatorios\t\t|\n|\t\t\t\t\t\t\t\t\t\t\t\t|"
      );
      console.log(
        `+-----------------------------------------------------------------------------------------------+\x1b[97m`
      );
    } else {
      const busquedaArrUpdate = await fs.promises.readFile(this.path, "utf-8");
      const productRtaUp = JSON.parse(busquedaArrUpdate);
      const resultBusqUpdate = productRtaUp.find(({ id }) => id === idUpdate);
      if (!resultBusqUpdate) {
        console.log(
          `\x1b[31m+------------------------------------------------------------+\n|\t\t\t\t\t\t\t     |`
        );
        console.error(
          "|\t    ERROR: el producto buscado no existe\t     |\n|\t\t\t\t\t\t\t     |"
        );
        console.log(
          `+------------------------------------------------------------+\x1b[97m`
        );
      } else {
        const indiceUpdate = productRtaUp.indexOf(resultBusqUpdate);
        const productUpdate = {
          title,
          description,
          price,
          thumbnail,
          code,
          stock,
          id: resultBusqUpdate.id,
        };
        const codeVerificarUp = productRtaUp.find(
          (productUpdate) => productUpdate.code === code
        );
        if (codeVerificarUp != null) {
          console.log(
            `\x1b[31m+----------------------------------------------------------------------------------+\n|\t\t\t\t\t\t\t\t\t\t   |`
          );
          console.error(
            "|\tError UpdateProduct: Este producto ya existe, cargue un nuevo codigo\t   |\n|\t\t\t\t\t\t\t\t\t\t   |"
          );
          console.log(
            `+----------------------------------------------------------------------------------+\x1b[97m`
          );
        } else {
          console.log(
            `------------------------------------------------------------`
          );
          console.log(`El producto a modificar guardado en JSON es:`);
          console.log(
            `------------------------------------------------------------`
          );
          console.log(resultBusqUpdate);
          const updateProductoArray = productRtaUp.splice(
            indiceUpdate,
            1,
            productUpdate
          );
          console.log(
            `------------------------------------------------------------`
          );
          console.log(`los nuevos valores a modificar son:`);
          console.log(
            `------------------------------------------------------------`
          );
          console.log(productUpdate);
          const nuevoArrUp = productRtaUp;
          console.log(
            `------------------------------------------------------------`
          );
          console.log(
            `Detalle de JSON actualizado con el producto modificado:`
          );
          console.log(
            `------------------------------------------------------------`
          );
          console.log(nuevoArrUp);
          await fs.promises.writeFile(
            this.path,
            JSON.stringify(nuevoArrUp, null, "\t")
          );
          return resultBusqUpdate;
        }
      }
    }
  };

  getDeleteProduct = async (idDelete) => {
    const busquedaRtaDelete = await fs.promises.readFile(this.path, "utf-8");
    const productRtaDelete = JSON.parse(busquedaRtaDelete);
    const resultBusqDelete = productRtaDelete.find(({ id }) => id === idDelete);
    if (!resultBusqDelete) {
      console.log(
        `\x1b[31m+------------------------------------------------------------+\n|\t\t\t\t\t\t\t     |`
      );
      console.error(
        "|\t    ERROR: el producto buscado no existe\t     |\n|\t\t\t\t\t\t\t     |"
      );
      console.log(
        `+------------------------------------------------------------+\x1b[97m`
      );
    } else {
      const indiceDelete = productRtaDelete.indexOf(resultBusqDelete);
      console.log(
        `------------------------------------------------------------`
      );
      console.log(`El producto a eliminar es:`);
      console.log(
        `------------------------------------------------------------`
      );
      console.log(resultBusqDelete);
      const eliminarObjetoIndice = productRtaDelete.splice(indiceDelete, 1);
      const nuevoArreglo = productRtaDelete;
      console.log(
        `------------------------------------------------------------`
      );
      console.log(`Detalle de JSON actualizado con el producto eliminado:`);
      console.log(
        `------------------------------------------------------------`
      );
      console.log(nuevoArreglo);
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(nuevoArreglo, null, "\t")
      );

      return resultBusqDelete;
    }
  };
}
