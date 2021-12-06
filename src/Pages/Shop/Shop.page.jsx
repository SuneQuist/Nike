import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import style from "./Shop.module.scss";

import useCart from "../../Components/Database/useCart.component";

import { useParams } from "react-router-dom";

function Shop() {
  // Look at first useEffect for reference
  const [param, setParam] = useState({
    category: null,
    catalog: null,
    product: null,
  });

  const { database } = useCart();
  const { category, catalog, product } = useParams();

  const [databaseList, setDatabaseList] = useState(null);
  const [data, setData] = useState(null);
  const [backupData, setBackupData] = useState(null);
  const [page, setPage] = useState({
    page: 0,
    lastPage: null,
    itemsPerPage: 12,
  });

  const [filterClick, setFilterClick] = useState(null);
  const [click, setClick] = useState(false);

  let minStart = 0;
  let midStart = 250;
  let midEnd = 2500;
  let maxStart = 5000;

  if (backupData) {
    minStart = Math.floor(
      Math.min.apply(
        Math,
        backupData?.map(function (o) {
          return o.price;
        })
      )
    );

    maxStart = Math.floor(
      Math.max.apply(
        Math,
        backupData?.map(function (o) {
          return o.price;
        })
      )
    );

    midStart = Math.floor((minStart + maxStart) / 4);
    midEnd = Math.floor((minStart + maxStart) / 2);
  }

  const [min, setMin] = useState(0);
  const [max, setMax] = useState(5000);

  // Find param indexs
  useEffect(() => {
    const getUriId = () => {
      const categoryId = database?.categories?.findIndex((c) => {
        return (
          c?.name.toLowerCase().replace(/\s/g, "") ===
          category?.toLowerCase().replace(/-/g, "")
        );
      });

      if (categoryId || categoryId === 0) {
        setParam({
          category: categoryId,
          catalog: null,
          product: null,
        });
      }

      if (catalog && typeof categoryId === "number") {
        const catalogId = database?.categories[categoryId]?.catalog?.findIndex(
          (c) => {
            return (
              c?.name.toLowerCase().replace(/\s/g, "") ===
              catalog?.toLowerCase().replace(/-/g, "")
            );
          }
        );

        if (catalogId) {
          setParam({
            category: categoryId,
            catalog: catalogId,
            product: null,
          });
        }

        if (product && typeof catalogId === "number") {
          const productId = database?.categories[categoryId]?.catalog[
            catalogId
          ]?.products?.findIndex((p) => {
            return (
              p?.name.toLowerCase().replace(/\s/g, "") ===
              product?.toLowerCase().replace(/-/g, "")
            );
          });

          if (productId) {
            setParam({
              category: categoryId,
              catalog: catalogId,
              product: productId,
            });
          }
        }
      }
    };

    getUriId();
  }, [category, catalog, product, database]);

  // Get item ids
  useEffect(() => {
    let products = database?.products;
    let categories = database?.categories;
    if (products && categories) {
      let categoriesArray = [];
      let productsArray = [];

      categoriesArray.push(Number(categories[param?.category]?.id));
      for (let i = 0; i < categories[param?.category]?.catalog?.length; i++) {
        categoriesArray.push(
          Number(...categories[param?.category]?.catalog[i]?.supportingLists)
        );

        for (
          let j = 0;
          j < categories[param?.category]?.catalog[i]?.products?.length;
          j++
        ) {
          if (
            categories[param?.category]?.catalog[i]?.products[j]?.id !==
            (NaN || null || undefined)
          ) {
            productsArray.push(
              Number(categories[param?.category]?.catalog[i]?.products[j]?.id)
            );
          }
        }
      }

      if (category) {
        setDatabaseList([...categoriesArray, ...productsArray]);
      }

      if (catalog) {
        function catalogProducts() {
          productsArray = [];

          for (
            let j = 0;
            j <
            categories[param?.category]?.catalog[param?.catalog]?.products
              ?.length;
            j++
          ) {
            productsArray.push(
              Number(
                categories[param?.category]?.catalog[param?.catalog]?.products[
                  j
                ]?.id
              )
            );
          }

          setDatabaseList(productsArray);
        }

        catalogProducts();

        if (product) {
          setDatabaseList([
            Number(
              categories[param?.category]?.catalog[param?.catalog]?.products[
                param?.product
              ]?.id
            ),
          ]);
        }
      }
    }
  }, [database, param, category, catalog, product]);

  // Get items
  useEffect(() => {
    if (database?.products && databaseList) {
      const pro = [...databaseList]?.map((v) => {
        const filter = database?.products?.filter(
          (product) => Number(product.category_id) === v
        );

        if (filter.length > 0) {
          return filter;
        }
        return null;
      });

      let sendArray = [];

      if (pro) {
        for (let i = 0; i < pro.length; i++) {
          if (pro[i] && Array.isArray(pro[i])) {
            for (let j = 0; j < pro[i].length; j++) {
              if (pro[i][j + 1]?.sku !== pro[i][j]?.sku) {
                sendArray.push(pro[i][j]);
              }
            }
          }
        }
      }

      setData(sendArray);
      setBackupData(sendArray);
    }
  }, [database, param, category, databaseList]);

  // Handle price range
  useEffect(() => {
    function handlePriceChange(arr) {
      const low = arr.filter((product) => Number(product.price) >= min);

      const high = low?.filter((product) => Number(product.price) <= max);

      const inBetween = high?.filter((product) => Number(product.price) >= min);

      if (inBetween.length > 0 && data.length > 0) {
        setData(inBetween);
      }
    }

    if (data && backupData) {
      handlePriceChange(backupData);
    }
    // eslint-disable-next-line
  }, [min, max]);

  // Ascending Data Order
  const alphabeticOrderAsc = useCallback(async () => {
    const sortedData = await data.sort((a, b) => {
      if (a.name > b.name) return 1;
      if (a.name < b.name) return -1;
      return 0;
    });

    await setData(sortedData);
  }, [data]);

  // Descending Data Order
  const alphabeticOrderDesc = useCallback(async () => {
    const sortedData = await data.sort((a, b) => {
      if (a.name < b.name) return 1;
      if (a.name > b.name) return -1;
      return 0;
    });

    await setData(sortedData);
  }, [data]);

  // Ascending Data Order
  const numberOrderAsc = useCallback(async () => {
    const sortedData = await data.sort((a, b) => {
      if (Number(a.price) > Number(b.price)) return 1;
      if (Number(a.price) < Number(b.price)) return -1;
      return 0;
    });

    await setData(sortedData);
  }, [data]);

  // Descending Data Order
  const numberOrderDesc = useCallback(async () => {
    const sortedData = await data.sort((a, b) => {
      if (Number(a.price) < Number(b.price)) return 1;
      if (Number(a.price) > Number(b.price)) return -1;
      return 0;
    });

    await setData(sortedData);
  }, [data]);

  // ReRender on page click
  useEffect(() => {
    setClick(false);

    if (data) {
      setPage({
        ...page,
        page: 0,
        lastPage:
          Math.floor(data?.length / page.itemsPerPage) +
          (data?.length % page.itemsPerPage !== 0 ? 1 : 0),
      });
    }

    // eslint-disable-next-line
  }, [data, click]);

  // Round up price range changes
  function round(number, increment, offset) {
    return Math.ceil((number - offset) / increment) * increment + offset;
  }

  return (
    <main className={style.main}>
      <section className={style.main__filter}>
        {data && (
          <React.Fragment>
            <div className={style.main__filter_defaults}>
              <p>Filters:</p>
              <ul>
                <li
                  onClick={() => {
                    alphabeticOrderAsc();
                    setClick(true);
                    setFilterClick(filterClick === 1 ? null : 1);
                    if (filterClick === 1) {
                      setMin(0);
                      setMax(round(maxStart, 100, 0));
                    }
                  }}
                  style={{
                    backgroundColor: filterClick === 1 ? "#000" : "#fff",
                    color: filterClick !== 1 ? "#000" : "#fff",
                  }}
                >
                  Name from. A - Z
                </li>
                <li
                  onClick={() => {
                    alphabeticOrderDesc();
                    setClick(true);
                    setFilterClick(filterClick === 2 ? null : 2);
                    if (filterClick === 2) {
                      setMin(0);
                      setMax(round(maxStart, 100, 0));
                    }
                  }}
                  style={{
                    backgroundColor: filterClick === 2 ? "#000" : "#fff",
                    color: filterClick !== 2 ? "#000" : "#fff",
                  }}
                >
                  Name from. Z - A
                </li>
                <li
                  onClick={() => {
                    numberOrderDesc();
                    setClick(true);
                    setFilterClick(filterClick === 3 ? null : 3);
                    if (filterClick === 3) {
                      setMin(0);
                      setMax(round(maxStart, 100, 0));
                    }
                  }}
                  style={{
                    backgroundColor: filterClick === 3 ? "#000" : "#fff",
                    color: filterClick !== 3 ? "#000" : "#fff",
                  }}
                >
                  Price. high - low
                </li>
                <li
                  onClick={() => {
                    numberOrderAsc();
                    setClick(true);
                    setFilterClick(filterClick === 4 ? null : 4);
                    if (filterClick === 4) {
                      setMin(0);
                      setMax(round(maxStart, 100, 0));
                    }
                  }}
                  style={{
                    backgroundColor: filterClick === 4 ? "#000" : "#fff",
                    color: filterClick !== 4 ? "#000" : "#fff",
                  }}
                >
                  Price. low - high
                </li>
              </ul>
            </div>
            <div className={style.main__filter_list}>
              <p>Price Range:</p>
              <ul>
                {0 !== round(midStart, 100, 0) &&
                  !isNaN(round(midStart, 100, 0)) && (
                    <li
                      onClick={() => {
                        setMin(0);
                        setMax(round(midStart, 100, 0));
                        setClick(true);
                      }}
                      style={{
                        backgroundColor:
                          min === 0 && round(midStart, 100, 0) === max
                            ? "#000"
                            : "#fff",
                        color:
                          min === 0 && round(midStart, 100, 0) === max
                            ? "#fff"
                            : "#000",
                      }}
                    >
                      ${0} - ${round(midStart, 100, 0)}
                    </li>
                  )}
                {round(midStart, 100, 0) !== round(midEnd, 100, 0) &&
                  !isNaN(round(midStart, 100, 0)) &&
                  !isNaN(round(midEnd, 100, 0)) && (
                    <li
                      onClick={() => {
                        setMin(round(midStart, 100, 0));
                        setMax(round(midEnd, 100, 0));
                        setClick(true);
                      }}
                      style={{
                        backgroundColor:
                          min === round(midStart, 100, 0) &&
                          round(midEnd, 100, 0) === max
                            ? "#000"
                            : "#fff",
                        color:
                          min === round(midStart, 100, 0) &&
                          round(midEnd, 100, 0) === max
                            ? "#fff"
                            : "#000",
                      }}
                    >
                      ${round(midStart, 100, 0)} - ${round(midEnd, 100, 0)}
                    </li>
                  )}
                {round(midEnd, 100, 0) !== round(maxStart, 100, 0) &&
                  !isNaN(round(midEnd, 100, 0)) &&
                  !isNaN(round(maxStart, 100, 0)) && (
                    <li
                      onClick={() => {
                        setMin(round(midEnd, 100, 0));
                        setMax(round(maxStart, 100, 0));
                        setClick(true);
                      }}
                      style={{
                        backgroundColor:
                          min === round(midEnd, 100, 0) &&
                          round(maxStart, 100, 0) === max
                            ? "#000"
                            : "#fff",
                        color:
                          min === round(midEnd, 100, 0) &&
                          round(maxStart, 100, 0) === max
                            ? "#fff"
                            : "#000",
                      }}
                    >
                      ${round(midEnd, 100, 0)} - ${round(maxStart, 100, 0)}
                    </li>
                  )}
                {minStart &&
                  maxStart &&
                  0 !== round(maxStart, 100, 0) &&
                  !isNaN(round(maxStart, 100, 0)) && (
                    <li
                      onClick={() => {
                        setMin(0);
                        setMax(round(maxStart, 100, 0));
                        setClick(true);
                      }}
                      style={{
                        backgroundColor:
                          min === 0 && round(maxStart, 100, 0) === max
                            ? "#000"
                            : "#fff",
                        color:
                          min === 0 && round(maxStart, 100, 0) === max
                            ? "#fff"
                            : "#000",
                      }}
                    >
                      Show All
                    </li>
                  )}
              </ul>
            </div>
          </React.Fragment>
        )}
      </section>
      <article className={style.main__article}>
        {data &&
          data
            ?.slice(
              page?.page * page?.itemsPerPage,
              page?.page === 0
                ? page?.itemsPerPage
                : page?.page * page?.itemsPerPage + page?.itemsPerPage
            )
            ?.map((product, idx) => (
              <blockquote
                key={product.sku + idx}
                className={style.main__article_product}
              >
                <Link
                  to={
                    "/" +
                    String(product.name.toLowerCase().replace(/\s/g, "-")) +
                    "/" +
                    product.category_id +
                    "/" +
                    product.sku
                  }
                >
                  <img
                    src={
                      product.images[
                        Math.floor(Math.random(product.images.length))
                      ].url
                    }
                    alt="Product"
                  />
                </Link>
                <div className={style.main__article_product_desc}>
                  <p className={style.main__article_product_desc_grid}>
                    <span
                      className={style.main__article_product_desc_grid_title}
                    >
                      {product.name}
                    </span>
                    <span
                      className={
                        style.main__article_product_desc_grid_manufacturer
                      }
                    >
                      {product.manufacturer}
                    </span>
                  </p>
                  <span className={style.main__article_product_desc_price}>
                    ${product.price}
                  </span>
                </div>
              </blockquote>
            ))}
      </article>
      <section className={style.main__pagination}>
        {page &&
          data &&
          page?.lastPage &&
          new Array(page?.lastPage).fill(null).map((v, idx) => (
            <div
              key={v + idx}
              onClick={() => setPage({ ...page, page: idx })}
              style={{
                backgroundColor: page?.page === idx ? "#000" : "#fff",
                color: page?.page !== idx ? "#000" : "#fff",
                display:
                  Number(page?.page) === Number(idx) ||
                  Number(page?.page) + 1 === Number(idx) ||
                  Number(page?.page) + 2 === Number(idx) ||
                  Number(page?.lastPage) - 1 === Number(idx) ||
                  Number(page?.page) - 1 === Number(idx) ||
                  Number(page?.page) - 2 === Number(idx) ||
                  Number(idx) === 0 ||
                  Number(idx) === Number(page?.lastPage)
                    ? "block"
                    : "none",
                marginLeft:
                  Number(idx) === Number(page?.lastPage) - 1 ? "0.5rem" : null,
                marginRight: Number(idx) === 0 ? "0.5rem" : null,
              }}
            >
              {idx + 1}
            </div>
          ))}
      </section>
    </main>
  );
}

export default Shop;
