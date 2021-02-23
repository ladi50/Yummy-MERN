import React, { lazy, Suspense, useEffect } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

import NavBar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Spinner from "./components/Spinner/Spinner";
import { useAuth } from "./hooks/useAuth";
import { useCart } from "./hooks/useCart";
import { useOrder } from "./hooks/useOrder";
import { useFilter } from "./hooks/useFilter";
import { AppContext } from "./context/context";

import "./App.css";

const Homepage = lazy(() => import("./pages/Homepage/Homepage"));
const Register = lazy(() => import("./pages/Register/Register"));
const Login = lazy(() => import("./pages/Login/Login"));
const Restaurants = lazy(() => import("./pages/Restaurants/Restaurants"));
const Menu = lazy(() => import("./pages/Menu/Menu"));
const Invoice = lazy(() => import("./pages/Invoice/Invoice"));
const Orders = lazy(() => import("./pages/Orders/Orders"));
const MyRestaurant = lazy(() => import("./pages/MyRestaurant/MyRestaurant"));
const AddRestaurant = lazy(() => import("./pages/AddRestaurant/AddRestaurant"));
const AddMenu = lazy(() => import("./pages/AddMenu/AddMenu"));
const CheckoutRedirect = lazy(() =>
  import("./pages/CheckoutRedirect/CheckoutRedirect")
);

const App = () => {
  const storageToken =
    localStorage.getItem("userData") &&
    JSON.parse(localStorage.getItem("userData")).token;

  const { login, logout, username, token, userId } = useAuth();
  const { orderItems, addToCart, removeFromCart, editItemCart } = useCart();
  const { orderDetails, addOrderDetails } = useOrder();
  const { restaurants } = useFilter();

  useEffect(() => {
    AOS.init({
      duration: 600,
      easing: "ease-out",
      once: true
    });
  }, []);

  let routes = (
    <Switch>
      <Route path="/" exact>
        <Homepage />
      </Route>
      <Route path="/signup" exact>
        <Register />
      </Route>
      <Route path="/login" exact>
        <Login />
      </Route>
      <Route path="/restaurants" exact>
        <Restaurants />
      </Route>
      <Route path="/:city/restaurant/:restaurantId" exact>
        <Menu />
      </Route>
      <Redirect to="/" />
    </Switch>
  );

  if (token || storageToken) {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Homepage />
        </Route>
        <Route path="/:userId/my_restaurant" exact>
          <MyRestaurant />
        </Route>
        <Route path="/:userId/add_restaurant" exact>
          <AddRestaurant />
        </Route>
        <Route path="/:userId/:restaurantId/add_menu" exact>
          <AddMenu />
        </Route>
        <Route path="/restaurants" exact>
          <Restaurants />
        </Route>
        <Route path="/:city/restaurant/:restaurantId" exact>
          <Menu />
        </Route>
        <Route path="/:userId/:restaurantId/checkoutRedirect" exact>
          <CheckoutRedirect />
        </Route>
        <Route path="/:userId/order/:orderId" exact>
          <Invoice />
        </Route>
        <Route path="/:userId/orders" exact>
          <Orders />
        </Route>
        <Redirect to="/" />
      </Switch>
    );
  }

  return (
    <AppContext.Provider
      value={{
        login,
        logout,
        username,
        token,
        userId,
        orderItems,
        addToCart,
        removeFromCart,
        editItemCart,
        orderDetails,
        addOrderDetails,
        restaurants
      }}
    >
      <Suspense fallback={<Spinner />}>
        <NavBar />

        {routes}

        <Footer />
      </Suspense>
    </AppContext.Provider>
  );
};

export default App;
