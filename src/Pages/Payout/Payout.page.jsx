import React, { useState, useEffect } from "react";
import style from "./Payout.module.scss";

import useCart from "../../Components/Database/useCart.component";
import { counter } from "@fortawesome/fontawesome-svg-core";

function Payout() {
  const {
    basket,
    addToQuantity,
    removeFromQuantity,
    updateQuantity,
    deleteItem,
  } = useCart();

  // Card information
  const [cardHolder, setCardHolder] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardDate, setCardDate] = useState("");
  const [cardCVV, setCardCVV] = useState("");

  // Personal Information
  const [name, setName] = useState("");
  const [addressOne, setAddressOne] = useState("");
  const [addressSecond, setAddressSecond] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");

  const [total, setTotal] = useState("");

  useEffect(() => {
    const getTotal = () => {
      let totally = 0;

      if (basket) {
        for (let i = 0; i < basket.length; i++) {
          totally = Math.floor(totally + basket[i].price * basket[i].quantity);
        }
      }

      setTotal(totally);
    };

    getTotal();
  }, [basket]);

  const findId = (product) => {
    if (basket && product) {
      return basket.findIndex((items) => {
        return items.name === product.name && items.sku === product.sku;
      });
    }
  };

  return (
    <section className={style.section_payout}>
      <article className={style.section_payout__cart}>
        <h2>Cart</h2>
        {basket && basket.length > 0 ? (
          <ul className={style.section_payout__cart_items}>
            {basket.map((product, idx) => (
              <li
                className={style.section_payout__cart_items_block}
                key={product.name + idx}
              >
                <div className={style.section_payout__cart_items_block_product}>
                  <img
                    src={product.images[0].url}
                    alt={product.images[0].name}
                  />
                  <div
                    className={
                      style.section_payout__cart_items_block_product_body
                    }
                  >
                    <p>{product.name}</p>
                    <p>${product.price}</p>
                  </div>
                </div>
                <div
                  className={style.section_payout__cart_items_block_quantity}
                >
                  <div
                    className={
                      style.section_payout__cart_items_block_quantity_block
                    }
                  >
                    <button
                      onClick={() => {
                        if (product.quantity > 1) {
                          removeFromQuantity(findId(product));
                        }
                      }}
                    >
                      -
                    </button>
                    <p>
                      {product.quantity < 10
                        ? "0" + product.quantity
                        : product.quantity}
                    </p>
                    <button onClick={() => addToQuantity(findId(product))}>
                      +
                    </button>
                  </div>
                </div>
                <div
                  className={style.section_payout__cart_items_block_remove}
                  onClick={() => deleteItem(product)}
                >
                  Remove product
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className={style.section_payout__cart_noItems}>
            <h2>No products added to cart.</h2>
          </div>
        )}
      </article>
      {basket && basket.length > 0 && (
        <article className={style.section_payout_payment}>
          <form className={style.section_payout_payment_form}>
            <div className={style.section_payout_payment_form_card}>
              <div className={style.section_payout_payment_form_title}>
                <h2>Card Information</h2>
              </div>

              {/* Cardholder Name */}
              <fieldset
                className={style.section_payout_payment_form_card_field}
              >
                <label htmlFor="cardname">Cardholders name</label>
                <input
                  type="text"
                  name="cardname"
                  placeholder="John Smith"
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                />
              </fieldset>

              {/* Card Number */}
              <fieldset
                className={style.section_payout_payment_form_card_field}
              >
                <label htmlFor="cardnumber">Card Number</label>
                <input
                  type="text"
                  name="cardnumber"
                  placeholder="XXXX-XXXX-XXXX-XXXX"
                  value={cardNumber}
                  onChange={(e) => {
                    let v = e.target.value
                      .replace(/\s+/g, "")
                      .replace(/[^0-9]/gi, "");
                    let matches = v.match(/\d{4,16}/g);
                    let match = (matches && matches[0]) || "";
                    let parts = [];

                    for (let i = 0, len = match.length; i < len; i += 4) {
                      parts.push(match.substring(i, i + 4));
                    }

                    if (parts.length) {
                      return setCardNumber(parts.join("-"));
                    } else {
                      return setCardNumber(e.target.value);
                    }
                  }}
                />
              </fieldset>

              <div className={style.section_payout_payment_form_card_together}>
                {/* Card Experation Date */}
                <fieldset
                  className={
                    style.section_payout_payment_form_card_togther_field
                  }
                >
                  <label htmlFor="cardexperiation">Experation Date</label>
                  <input
                    type="text"
                    name="cardexperiation"
                    placeholder="MM/YY"
                    value={cardDate}
                    onChange={(e) => {
                      if (
                        e.target.value.length <= 4 &&
                        new RegExp("^[0-9]*$", "gi").test(e.target.value)
                      ) {
                        console.log(e.target.value.length);
                        setCardDate(e.target.value);
                      }

                      if (e.target.value.length > 2) {
                        setCardDate(
                          e.target.value.slice(0, 2) +
                            "/" +
                            e.target.value.slice(3, 5)
                        );
                      }
                    }}
                  />
                </fieldset>

                {/* Card CVV */}
                <fieldset
                  className={
                    style.section_payout_payment_form_card_togther_field
                  }
                >
                  <label htmlFor="cvv">CVV Code</label>
                  <input
                    type="text"
                    name="cvv"
                    placeholder="XXX"
                    value={cardCVV}
                    onChange={(e) => {
                      if (
                        e.target.value.length <= 3 &&
                        new RegExp("^[0-9]*$", "gi").test(e.target.value)
                      ) {
                        setCardCVV(e.target.value);
                      }
                    }}
                  />
                </fieldset>
              </div>
            </div>
            <div className={style.section_payout_payment_form_information}>
              <div className={style.section_payout_payment_form_title}>
                <h2>Personal Information</h2>
              </div>
              {/* Address One */}
              <fieldset
                className={style.section_payout_payment_form_information_field}
              >
                <label htmlFor="addressone">Address Line 1</label>
                <input
                  type="text"
                  name="addressone"
                  value={addressOne}
                  onChange={(e) => setAddressOne(e.target.value)}
                />
              </fieldset>

              {/* Address Second */}
              <fieldset
                className={style.section_payout_payment_form_information_field}
              >
                <label htmlFor="addresssecond">Address Line 2</label>
                <input
                  type="text"
                  name="addresssecond"
                  value={addressSecond}
                  onChange={(e) => setAddressSecond(e.target.value)}
                />
              </fieldset>

              {/* City */}
              <fieldset
                className={style.section_payout_payment_form_information_field}
              >
                <label htmlFor="city">City</label>
                <input
                  type="text"
                  name="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </fieldset>

              <div
                className={
                  style.section_payout_payment_form_information_together
                }
              >
                {/* Country */}
                <fieldset
                  className={
                    style.section_payout_payment_form_information_together_field
                  }
                >
                  <label htmlFor="country">Country</label>
                  <input
                    type="text"
                    name="country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                  />
                </fieldset>

                {/* State/Province */}
                <fieldset
                  className={
                    style.section_payout_payment_form_information_together_field
                  }
                >
                  <label htmlFor="state">State/Province</label>
                  <input
                    type="text"
                    name="state"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                  />
                </fieldset>

                {/* Zip */}
                <fieldset
                  className={
                    style.section_payout_payment_form_information_together_field
                  }
                >
                  <label htmlFor="zip">Zip/Postal Code</label>
                  <input
                    type="text"
                    name="zip"
                    value={zip}
                    onChange={(e) => {
                      if (
                        e.target.value.length <= 4 &&
                        new RegExp("^[0-9]*$", "gi").test(e.target.value)
                      ) {
                        setZip(e.target.value);
                      }
                    }}
                  />
                </fieldset>
              </div>
            </div>
          </form>
          <div className={style.section_payout_payment_information}>
            <h2>Payment</h2>
            <div>
              <p>
                Total: <span>${total}</span>
              </p>
              <button>Checkout</button>
            </div>
          </div>
        </article>
      )}
    </section>
  );
}

export default Payout;
