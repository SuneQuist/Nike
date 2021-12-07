import React, { Suspense } from "react";
import { Header } from "../Components/Sections/Header.section";
import { Footer } from "../Components/Sections/Footer.section";
import style from "./LazyLoader.module.scss";

import NikeLogo from "../Assets/Nike_Logo.svg";

const Loading = () => {
  return (
    <section className={style.loading_container}>
      <img src={NikeLogo} alt="Nike Logo" />
    </section>
  );
};

export const LazyLoader = ({ children }) => {
  return (
    <Suspense fallback={<Loading></Loading>}>
      <>
        <Header></Header>
        {children}
        <Footer></Footer>
      </>
    </Suspense>
  );
};
