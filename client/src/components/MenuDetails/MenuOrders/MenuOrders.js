import React, { useContext } from "react";
import { useParams, useHistory } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";

import OrderItem from "../OrderItem/OrderItem";
import { AppContext } from "../../../context/context";
import { useFetch } from "../../../hooks/useFetch";

import "./MenuOrders.css";

const MenuOrders = ({ hidden }) => {
  const restaurantId = useParams().restaurantId;
  const history = useHistory();
  const { orderItems, token, userId } = useContext(AppContext);
  const { fetchHandler } = useFetch();

  const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY);
  
  // integrate Stripe with dishes information
  const checkoutHandler = async () => {
    if (!token || !userId) {
      return history.push("/login");
    }

    const stripe = await stripePromise;
    fetchHandler(`/${userId}/${restaurantId}/checkout-session`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(orderItems)
    })
      .then(async (res) => {
        if (res) {
          const result = await stripe.redirectToCheckout({
            sessionId: res.sessionId
          });

          if (result.error) {
            console.log(result.error.message);
          }
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="menuOrders">
      <h3>order summary</h3>

      {orderItems.length > 0 ? (
        <>
          <div className="menuOrders__products">
            {orderItems &&
              orderItems.map(
                ({
                  id,
                  name,
                  quantity,
                  price,
                  image,
                  decsription,
                  kitchenNotes,
                  deliveryNotes
                }) => {
                  return (
                    <OrderItem
                      key={id}
                      id={id}
                      name={name}
                      qty={quantity}
                      price={price}
                      image={image}
                      decsription={decsription}
                      kitchenNotes={kitchenNotes}
                      deliveryNotes={deliveryNotes}
                    />
                  );
                }
              )}
          </div>

          <button
            type="button"
            className="checkoutButton"
            onClick={checkoutHandler}
            style={{ display: hidden && "none" }}
          >
            proceed to checkout
          </button>
        </>
      ) : (
        <h4
          style={{
            textAlign: "center",
            fontSize: "1.2rem",
            color: "rgb(52, 52, 52)",
            marginTop: "40px"
          }}
        >
          your cart is empty... 😕
        </h4>
      )}
    </div>
  );
};

export default MenuOrders;
