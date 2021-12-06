import React from "react";
import { Routes, Route } from "react-router-dom";

import { routes } from "./routes";

export const Router = () => {
  return (
    <>
      <Routes>
        {routes.reduce((reducedRoutes, route) => {
          reducedRoutes.push(
            <Route
              exact
              key={route.path}
              path={route.path}
              element={route.element}
            />
          );

          return reducedRoutes;
        }, [])}
      </Routes>
    </>
  );
};
