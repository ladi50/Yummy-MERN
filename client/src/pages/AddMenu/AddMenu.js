import React, { useContext, useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import uuid from "react-uuid";

import AddMenuItem from "../../components/AddMenuItem/AddMenuItem";
import Button from "../../components/Button/Button";
import Spinner from "../../components/Spinner/Spinner";
import { useFetch } from "../../hooks/useFetch";
import { AppContext } from "../../context/context";

import "./AddMenu.css";

const AddMenu = () => {
  const [input, setInput] = useState({
    catagory: "",
    name: "",
    description: "",
    price: 0.5,
    _id: "",
    image: null
  });
  const [restaurant, setRestaurant] = useState("");
  const [catagories, setCatagories] = useState([]);
  const [showCatagory, setShowCatagory] = useState(false);

  const restaurantId = useParams().restaurantId;
  const history = useHistory();
  const { fetchHandler, loading } = useFetch();
  const { token, userId } = useContext(AppContext);

  useEffect(() => {
    fetchHandler(`/${userId}/restaurant`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((res) => {
      if (res) {
        setCatagories(res.restaurant.menuId && res.restaurant.menuId.items);
        setRestaurant(res.restaurant);
      }
    });
  }, [fetchHandler, userId, token]);

  const inputHandler = (e) => {
    const { name, value } = e.target;

    setInput((prevState) => ({ ...prevState, [name]: value }));
  };

  // handle catagory addition
  const addCatagory = () => {
    if (input.catagory.length < 3) return;

    setCatagories((prevState) =>
      prevState
        ? [...prevState, { _id: uuid(), name: input.catagory, dishes: [] }]
        : [{ _id: uuid(), name: input.catagory, dishes: [] }]
    );

    setInput((prevState) => ({ ...prevState, catagory: "" }));
    setShowCatagory(false);
  };

  // add or edit menu on form submit
  const handleMenuSubmit = (e) => {
    e.preventDefault();

    let filteredCatagories = [];

    catagories.map(({ name, dishes }) =>
      filteredCatagories.push({
        name,
        dishes: dishes.map(({ name, description, price, imageUrl }) => ({
          name,
          description,
          price,
          imageUrl
        }))
      })
    );

    let dishesImages = [];

    catagories.map(({ dishes }) =>
      dishes.map(({ image }) => dishesImages.push(image))
    );

    const formData = new FormData();
    formData.append("items", JSON.stringify(filteredCatagories));
    for (const imageDish of dishesImages) {
      formData.append("image", imageDish);
    }

    fetchHandler(
      `/${userId}/${restaurantId}/${
        restaurant.menuId ? "edit_menu" : "add_menu"
      }`,
      {
        method: restaurant.menuId ? "PATCH" : "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      }
    )
      .then(
        (res) =>
          res &&
          history.push(
            restaurant.menuId ? "/?edited_menu=true" : "/?added_menu=true"
          )
      )
      .catch((err) => console.log(err));
  };

  return (
    <form className="addMenu" onSubmit={handleMenuSubmit}>
      {loading && <Spinner />}

      <h1>{restaurant.name} menu</h1>

      {/* render catagories */}
      <ul>
        {catagories &&
          catagories.map(({ name, dishes, _id }) => (
            <AddMenuItem
              key={_id || uuid()}
              catagoryId={_id}
              name={name}
              input={input}
              setInput={setInput}
              inputHandler={inputHandler}
              dishes={dishes}
              catagories={catagories}
              setCatagories={setCatagories}
            />
          ))}
      </ul>

      <button
        type="button"
        onClick={() => setShowCatagory((prevState) => !prevState)}
      >
        new catagory
      </button>

      {showCatagory && (
        <div className="addMenu__addCatagory">
          <div>
            <label htmlFor="catagoryName">catagory name:</label>
            <input
              type="text"
              name="catagory"
              id="catagoryName"
              value={input.catagory}
              onChange={inputHandler}
              autoComplete="off"
              autoFocus
            />
          </div>

          <button type="button" onClick={addCatagory}>
            add catagory
          </button>
        </div>
      )}

      <div className="addMenu__button">
        <Button
          type="submit"
          title={restaurant.menuId ? "Edit Menu" : "Add Menu"}
        >
          {loading && <Spinner button />}
        </Button>
      </div>
    </form>
  );
};

export default AddMenu;
