import React, { lazy } from "react";

const Home = lazy(() => import("../Pages/Home/Home.page"));
const Shop = lazy(() => import("../Pages/Shop/Shop.page"));
const Product = lazy(() => import("../Pages/Product/Product.page"));
const Payout = lazy(() => import("../Pages/Payout/Payout.page"));

export const routes = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/shop",
    element: <Shop />,
  },
  {
    path: "/checkout",
    element: <Payout />,
  },
  {
    path: "/shop/:category",
    element: <Shop />,
  },
  {
    path: "/shop/:category/:catalog",
    element: <Shop />,
  },
  {
    path: "/shop/:category/:catalog/:product",
    element: <Shop />,
  },
  {
    path: "/:productName/:categoryId/:skuId",
    element: <Product />,
  },
];
