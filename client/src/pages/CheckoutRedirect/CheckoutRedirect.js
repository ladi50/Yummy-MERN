import React, { useContext, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";

import Spinner from "../../components/Spinner/Spinner";
import { useFetch } from "../../hooks/useFetch";
import { AppContext } from "../../context/context";

import "./CheckoutRedirect.css";

const CheckoutRedirect = () => {
  const restaurantId = useParams().restaurantId;
  const history = useHistory();
  const { userId, token, addOrderDetails } = useContext(AppContext);
  const { fetchHandler } = useFetch();

  useEffect(() => {
    let countdown;

    fetchHandler(`/${userId}/${restaurantId}/postOrder`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    })
      .then((res) => {
        if (res && res.order) {
          addOrderDetails(res.order);

          countdown = setTimeout(() => {
            history.push(`/${userId}/order/${res.order._id}`);
          }, 50);
        }
      })
      .catch((err) => console.log(err));

    return () => {
      clearTimeout(countdown);
    };
  }, [fetchHandler, userId, token, restaurantId, history]);

  return (
    <div className="checkoutRedirect">
      <h1>Thank you for your order!</h1>
      <p>You are redirected to invoice page, please wait...</p>

      <Spinner button />
    </div>
  );
};

export default CheckoutRedirect;
