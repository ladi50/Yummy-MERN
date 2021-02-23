import { createContext, useState } from "react";

export const AppContext = createContext({
  userId: null,
  token: null,
  username: null,
  login: () => {},
  logout: () => {},
  orderItems: [],
  addToCart: () => {},
  removeFromCart: () => {},
  editItemCart: () => {},
  orderDetails: {},
  addOrderDetails: () => {},
  restaurants: []
});
