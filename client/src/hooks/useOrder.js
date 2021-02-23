import { useState } from "react";

export const useOrder = () => {
  const [orderDetails, setOrderDetails] = useState([]);

  const addOrderDetails = (orderData) => {
    return setOrderDetails(orderData);
  };

  return { orderDetails, addOrderDetails };
};
