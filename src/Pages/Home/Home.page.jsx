import React from "react";
import style from "./Home.module.scss";

import useCart from "../../Components/Database/useCart.component";

// Svg
import hero from "../../Assets/Hero-01.svg";
import sticker01 from "../../Assets/Stickers-01.jpg";
import sticker02 from "../../Assets/Stickers-02.jpg";
import sticker03 from "../../Assets/Stickers-03.jpg";
import { Link } from "react-router-dom";

function Home() {
  const { chosen } = useCart();

  return (
    <section className={style.section_home}>
      <header className={style.section_home__hero}>
        <img src={hero} alt="custom hero illustration" />
      </header>

      <article className={style.section_home__subHero}>
        <h2>Produce your own fit</h2>
        <p>Define your own creation.</p>

        <div className={style.section_home__subHero_wrapper}>
          <a href="/shop/men">Men</a>
          <a href="/shop/women">Women</a>
          <a href="/shop/kids">Kids</a>
        </div>
      </article>

      <div className={style.section_home__productsContainer}>
        <p className={style.section_home__productsContainer_title}>Choosen</p>
        <article className={style.section_home__productsContainer_products}>
          {chosen &&
            chosen?.map((product, idx) => (
              <blockquote
                key={product.sku + idx}
                className={style.section_home__productsContainer_products_block}
              >
                <Link to={"/" + product.name.toLowerCase().replace(/\s/g, "-")}>
                  <img
                    src={
                      product?.images[
                        Math.floor(Math.random(product?.images?.length))
                      ].url
                    }
                    alt="Product"
                    className={
                      style.section_home__productsContainer_products_block_image
                    }
                  />
                </Link>
                <div
                  className={
                    style.section_home__productsContainer_products_block_body
                  }
                >
                  <div
                    className={
                      style.section_home__productsContainer_products_block_body_title
                    }
                  >
                    {product.name}
                  </div>
                  <span
                    className={
                      style.section_home__productsContainer_products_block_body_price
                    }
                  >
                    ${product.price}
                  </span>
                </div>
              </blockquote>
            ))}
        </article>
      </div>

      {/* <article className={style.section_home__intercept}>
        <fieldset className={style.section_home__intercept_imageContainer}>
          <div className={style.section_home__intercept_imageContainer_block}>
            <img src={nikeImage} alt="Nike Shoe" />
            <a href="/shop/men">Men</a>
          </div>
          <div className={style.section_home__intercept_imageContainer_block}>
            <img src={nikeImage01} alt="Nike Shoe" />
            <a href="/shop/women">Women</a>
          </div>
        </fieldset>
      </article> */}

      <div>
        <p className={style.section_home__categories}>Categories</p>
        <div className={style.section_home__stickers}>
          <Link to="/shop/men">
            <img src={sticker01} alt="men clickable illustration" />
          </Link>
          <Link to="/shop/women">
            <img src={sticker02} alt="women clickable illustration" />
          </Link>
          <Link to="/shop/kids">
            <img src={sticker03} alt="kids clickable illustration" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Home;
