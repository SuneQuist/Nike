import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import style from "./Style/Header.module.scss";
import { Search } from "./Search.component";

import useCart from "../Database/useCart.component";
import ShoppingBag from "../../Assets/ShoppingBag.svg";
import NikeLogo from "../../Assets/Nike_Logo.svg";

export const Header = () => {
  const { database, basket } = useCart();
  const [current, setCurrent] = useState(null);

  return (
    <section
      className={style.section__header}
      onMouseLeave={() => setCurrent(null)}
      style={{ position: "static" }}
      onClick={() => setCurrent(null)}
    >
      <header className={style.section__header_container}>
        <ul className={style.section__header_container_list}>
          <div className={style.section__header_container_list_space}>
            <Link to="/">
              <img src={NikeLogo} alt="Nike Logo" />
            </Link>
          </div>
          <div className={style.section__header_container_list_header}>
            {database &&
              database?.categories?.map((category, idx) => (
                <li key={category.name + category.id}>
                  <a
                    href={"/shop/" + category.name.toLowerCase()}
                    onMouseOver={() => setCurrent(idx)}
                  >
                    {category.name.toLowerCase().replace(/\s/g, "-")}
                  </a>
                </li>
              ))}
          </div>
          <div className={style.section__header_container_list_footer}>
            <Search />
            <Link to="/checkout" className={style.icon}>
              <img src={ShoppingBag} alt="shopping bag icon" />
              {basket && <div>{basket.length}</div>}
            </Link>
          </div>
        </ul>

        {database && database?.categories && (
          <article
            onMouseOver={() => setCurrent(current)}
            className={style.section__header_container_block}
            onMouseLeave={() => setCurrent(null)}
            style={{ display: current || current === 0 ? "flex" : "none" }}
          >
            {database?.categories[current]?.catalog?.map((catalog) => (
              <ul
                key={catalog.name + catalog.id}
                className={
                  current || current === 0
                    ? `${style.animate} ${style.section__header_container_block_catalog}`
                    : "null"
                }
              >
                <li>
                  <a
                    href={
                      "/shop/" +
                      database?.categories[current]?.name
                        .toLowerCase()
                        .replace(/\s/g, "-") +
                      "/" +
                      catalog.name.toLowerCase().replace(/\s/g, "-")
                    }
                  >
                    {catalog.name}
                  </a>
                </li>
                <ul className={style.section__header_container_block_product}>
                  {catalog?.products?.map((product) => (
                    <li key={product.name + product.id}>
                      <a
                        href={
                          "/shop/" +
                          database?.categories[current]?.name
                            .toLowerCase()
                            .replace(/\s/g, "-") +
                          "/" +
                          catalog.name.toLowerCase().replace(/\s/g, "-") +
                          "/" +
                          product.name.toLowerCase().replace(/\s/g, "-")
                        }
                      >
                        {product.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </ul>
            ))}
          </article>
        )}
      </header>
    </section>
  );
};
