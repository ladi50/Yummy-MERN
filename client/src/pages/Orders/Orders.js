import React, { useContext, useEffect, useState } from "react";

import Order from "../../components/Order/Order";
import Spinner from "../../components/Spinner/Spinner";
import Button from "../../components/Button/Button";
import { useFetch } from "../../hooks/useFetch";
import { AppContext } from "../../context/context";

import "./Orders.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  const { loading, fetchHandler } = useFetch();
  const { token, userId } = useContext(AppContext);

  useEffect(() => {
    fetchHandler(`/${userId}/orders`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((res) => res && setOrders(res.orders))
      .catch((err) => console.log(err));
  }, [fetchHandler, token, userId]);

  if (!orders || orders.length === 0) {
    return (
      <div className="orders__empty">
        <h1>No orders found!</h1>
        <p>search for your favorite food and make an order!</p>
        <Button url="/restaurants">Find a restaurant</Button>
      </div>
    );
  }

  return (
    <ul className="orders">
      {loading && <Spinner />}

      {orders &&
        !loading &&
        orders.map(({ _id, createdAt, products, payment, restaurantId }) => (
          <Order
            key={_id}
            _id={_id}
            createdAt={createdAt}
            products={products}
            payment={payment}
            restaurant={restaurantId}
          />
        ))}
    </ul>
  );
};

export default Orders;
