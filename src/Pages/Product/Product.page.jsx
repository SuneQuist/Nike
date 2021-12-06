import React, { useState, useEffect } from "react";
import style from "./Product.module.scss";

import { useParams } from "react-router-dom";
import useCart from "../../Components/Database/useCart.component";

function Product() {
  const { database, basket, addItem, addToQuantity, deleteItem } = useCart();
  const { productName, categoryId, skuId } = useParams();
  const [product, setProduct] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    function getProduct() {
      const data = database?.products?.filter(
        (products) =>
          products.name.toLowerCase() === productName.replace(/-/g, " ") &&
          products.category_id === categoryId &&
          products.sku === skuId
      );

      setProduct(data);
    }

    getProduct();
  }, [productName, categoryId, skuId, database?.products]);

  const findItem = () => {
    if (basket && product) {
      return basket.filter((items) => {
        return items.name === product[0].name && items.sku === product[0].sku;
      });
    }
  };

  const findId = () => {
    if (basket && product) {
      return basket.findIndex((items) => {
        return items.name === product[0].name && items.sku === product[0].sku;
      });
    }
  };

  return (
    <section className={style.section__product}>
      <header className={style.section__product_images}>
        {product && product[0] && (
          <img
            src={product[0]?.images[currentImage]?.url}
            alt="first product"
          />
        )}

        <div>
          {product &&
            product[0] &&
            product[0]?.images
              ?.slice(0, 5)
              ?.map((image, idx) => (
                <img
                  key={idx}
                  src={image.url}
                  alt={image.name}
                  onClick={() => setCurrentImage(idx)}
                />
              ))}
        </div>
      </header>
      <article className={style.section__product_body}>
        {product &&
          product?.map((product) => (
            <blockquote key={product.sku}>
              <h2>{product.name}</h2>
              <p dangerouslySetInnerHTML={{ __html: product.description }}></p>
              <em>Left in stock: {product.quantity}</em>
            </blockquote>
          ))}
        <div>
          {product && findItem().length <= 0 ? (
            <button onClick={() => addItem(product[0], 1)}>Add to cart</button>
          ) : (
            <div>
              <button onClick={() => deleteItem(findItem())}>
                Remove from cart
              </button>
              <button onClick={() => addToQuantity(findId(), 1)}>
                Add more to cart
              </button>
            </div>
          )}
        </div>
      </article>
    </section>
  );
}

export default Product;
