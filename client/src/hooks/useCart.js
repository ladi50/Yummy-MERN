import { useState } from "react";

export const useCart = () => {
  const [orderItems, setOrderItems] = useState([]);

  const addToCart = (content) => {
    if (content.image) {
      return setOrderItems((prevState) => [...prevState, content]);
    } else {
      let fileteredOrders = [...orderItems];

      const foundItemIndex = fileteredOrders.findIndex(
        (item) => item.id === content.id
      );

      fileteredOrders[foundItemIndex].quantity += content.quantity;

      return setOrderItems(fileteredOrders);
    }
  };

  const removeFromCart = (id) => {
    const fileteredOrders = [...orderItems];

    const newOrderItems = fileteredOrders.filter((item) => item.id !== id);

    return setOrderItems(newOrderItems);
  };

  const editItemCart = (id, itemData) => {
    const fileteredOrders = [...orderItems];

    const item = fileteredOrders.findIndex((i) => i.id === id);

    fileteredOrders[item] = { ...itemData };

    setOrderItems(fileteredOrders);
  };

  return { addToCart, orderItems, removeFromCart, setOrderItems, editItemCart };
};
