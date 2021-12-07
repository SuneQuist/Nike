import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
} from "react";

import { callDatabase } from "./db";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [rerender, setRerender] = useState(false);
  const [basket, setBasket] = useState([]);
  const [database, setDatabase] = useState({
    categories: null,
    products: null,
    loading: true,
  });
  const [chosen, setChosen] = useState([]);

  //------------------------------------//
  // Products Actions
  //------------------------------------//

  const getRandomCatogories = useCallback((database, products) => {
    // Database Index
    const databaseIndex = Math.floor(Math.random() * database.length);

    // Databse -> Catalog Index
    const catalogIndex = Math.floor(
      Math.random() * database[databaseIndex].catalog.length
    );

    // Database -> Catalog -> Products Index
    const catalogProductsIndex = Math.floor(
      Math.random() *
        database[databaseIndex].catalog[catalogIndex].products.length
    );

    // Get Products
    const catalogProduct =
      database[databaseIndex].catalog[catalogIndex].products[
        catalogProductsIndex
      ];

    let findProducts = products.filter(
      (products) => products.category_id === catalogProduct.id
    );

    return findProducts;
  }, []);

  //------------------------------------//
  // Basket Actions
  //------------------------------------//

  const addItem = useCallback(
    (item, amount) => {
      const newBasket = [
        ...basket,
        {
          ...item,
          quantity: amount,
          id: Math.floor(Math.random() * 7432747244724),
        },
      ];

      localStorage.setItem("basket", JSON.stringify(newBasket));
      setBasket(newBasket);
    },
    [basket]
  );

  const deleteItem = useCallback(
    (product) => {
      if (product) {
        const findOne = basket.filter(
          (item) => item.id !== (product.id || product[0].id)
        );
        console.log(findOne);

        localStorage.setItem("basket", JSON.stringify(findOne));
        setBasket(findOne);
      }
    },
    [basket]
  );

  //------------------------------------//
  // Quantity Options
  //------------------------------------//

  const quantityOptions = useCallback(
    (id, action = "add", amount = null) => {
      const updatedBasket = basket;

      if (amount) {
        updatedBasket[id].quantity = amount;
      } else if (action === "add") {
        updatedBasket[id].quantity++;
      } else if (action === "remove") {
        updatedBasket[id].quantity--;
      }

      localStorage.setItem("basket", JSON.stringify(updatedBasket));
      setBasket(updatedBasket);
      setRerender(true);
    },
    [basket]
  );

  //------------------------------------//
  // Quantity Actions
  //------------------------------------//

  const updateQuantity = useCallback(
    (id, amount) => {
      quantityOptions(id, "add", amount);
    },
    [quantityOptions]
  );

  const addToQuantity = useCallback(
    (id) => {
      quantityOptions(id, "add");
    },
    [quantityOptions]
  );

  const removeFromQuantity = useCallback(
    (id) => {
      quantityOptions(id, "remove");
    },
    [quantityOptions]
  );

  //------------------------------------//
  // Search Options
  //------------------------------------//

  const searching = useCallback(
    (input) => {
      if (database.products) {
        const products = database?.products?.filter((v) =>
          v.name.toLowerCase().match(`${input}`, "gi")
        );

        let categories = database?.categories?.map((v) =>
          v.catalog.map((k) => {
            const category = v.name.toLowerCase().match(`${input}`, "gi");
            const catalog = k.name.toLowerCase().match(`${input}`, "gi");

            if (catalog?.input) {
              return {
                category:
                  (category ? category?.input : null) ||
                  (catalog?.input ? v.name.toLowerCase() : null),
                catalog: catalog?.input,
              };
            } else {
              return null;
            }
          })
        );
        let checkForNull = false;

        for (let i = 0; i < categories.length; i++) {
          for (let j = 0; j < categories[i].length; j++) {
            if (categories[i][j]) {
              checkForNull = true;
            }
          }
        }

        return [
          checkForNull ? categories : null,
          products.length > 0 ? products.splice(0, 5) : null,
        ];
      }
    },
    [database]
  );

  //------------------------------------//
  // Call Database
  //------------------------------------//

  useEffect(() => {
    const handleBasket = () => {
      if (basket) {
        if (localStorage.getItem("basket")) {
          setBasket(JSON.parse(localStorage.getItem("basket")));
        }
      }
    };

    handleBasket();

    return () => setRerender(false);
  }, [rerender]);

  useEffect(() => {
    async function handleDataExtraction() {
      const url = "/nike.json";
      fetch(url, {
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          return res.json();
        })
        .then(async (data) => {
          const database = await callDatabase(data);

          if (database !== undefined) {
            setDatabase({
              categories: database,
              products: data.catalog[1].products,
              loading: false,
            });

            let index = 1;
            setChosen(getRandomCatogories(database, data.catalog[1].products));

            for (let i = 0; i < index; i++) {
              let product = getRandomCatogories(
                database,
                data.catalog[1].products
              );
              if (product.length <= 5) {
                index++;
              } else {
                setChosen(product.length > 10 ? product.slice(0, 10) : product);
              }
            }
          }
        });
    }

    handleDataExtraction();
  }, [getRandomCatogories]);

  //------------------------------------//
  // Set Call / Values
  //------------------------------------//

  const value = useMemo(() => {
    return {
      database,
      chosen,
      basket,
      addItem,
      deleteItem,
      updateQuantity,
      addToQuantity,
      removeFromQuantity,
      searching,
    };
  }, [
    database,
    chosen,
    basket,
    addItem,
    deleteItem,
    updateQuantity,
    addToQuantity,
    removeFromQuantity,
    searching,
  ]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export default function useCart() {
  return useContext(CartContext);
}
