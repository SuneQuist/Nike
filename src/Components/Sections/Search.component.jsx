import React, { useState, useEffect } from "react";
import style from "./Style/Search.module.scss";

import useCart from "../Database/useCart.component";
import { Link } from "react-router-dom";

export const Search = () => {
  const [clicked, setClicked] = useState(false);
  const [search, setSearch] = useState(null);
  const [newSearchArray, setNewSearchArray] = useState(null);
  const { searching } = useCart();

  useEffect(() => {
    const searched = searching(search ? search.toLowerCase() : search);
    setNewSearchArray(searched);
  }, [search, searching]);

  return (
    <>
      {clicked ? (
        <>
          <form className={style.component_search_form}>
            <fieldset className={style.component_search_form__container}>
              <input
                type="text"
                placeholder="Search"
                onChange={(e) =>
                  setSearch(e.target.value === "" ? null : e.target.value)
                }
                className={style.component_search_form__container_input}
              />
              {newSearchArray && (newSearchArray[0] || newSearchArray[1]) ? (
                <div
                  className={
                    style.component_search_form__container_input_container
                  }
                >
                  {newSearchArray[0] && (
                    <div
                      className={
                        style.component_search_form__container_input_container__block
                      }
                    >
                      <h2>Categories</h2>
                      {newSearchArray[0]?.map((category) =>
                        category?.map((product, idx) =>
                          product ? (
                            <Link
                              to={
                                "/shop/" +
                                product.category
                                  .toLowerCase()
                                  .replace(/\s/g, "-") +
                                "/" +
                                product.catalog
                                  .toLowerCase()
                                  .replace(/\s/g, "-")
                              }
                              key={product.category + idx}
                              onClick={() => {
                                setClicked(!clicked);
                                setSearch(null);
                              }}
                            >
                              <fieldset>
                                <p>
                                  {product.category} &nbsp; {"-"} &nbsp;{" "}
                                  {product.catalog}
                                </p>
                              </fieldset>
                            </Link>
                          ) : null
                        )
                      )}
                    </div>
                  )}
                  {newSearchArray[1] && (
                    <div
                      className={
                        style.component_search_form__container_input_container__block
                      }
                    >
                      <h2>Products</h2>
                      {newSearchArray[1]?.map((product, idx) =>
                        product ? (
                          <Link
                            to={
                              "/" +
                              product.name.toLowerCase().replace(/\s/g, "-")
                            }
                            key={product.name + idx}
                            onClick={() => {
                              setClicked(!clicked);
                              setSearch(null);
                            }}
                          >
                            <fieldset>
                              <p>{product.name}</p>
                            </fieldset>
                          </Link>
                        ) : null
                      )}
                    </div>
                  )}
                </div>
              ) : null}
            </fieldset>
            <p
              onClick={() => {
                setClicked(!clicked);
                setSearch(null);
              }}
              className={style.component_search_form__button}
            >
              Close
            </p>
          </form>
          <div className={style.overlay}></div>
        </>
      ) : (
        <p
          onClick={() => setClicked(!clicked)}
          className={style.component_search_button}
        >
          Search
        </p>
      )}
    </>
  );
};
