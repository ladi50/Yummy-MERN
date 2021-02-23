import React, { useEffect, useRef, useState } from "react";
import { IconButton } from "@material-ui/core";
import { Delete, Edit } from "@material-ui/icons";
import uuid from "react-uuid";

import useStyles from "./styles";
import "./AddMenuitem.css";

const AddMenuItem = ({
  name,
  input,
  setInput,
  inputHandler,
  dishes,
  catagories,
  setCatagories,
  catagoryId
}) => {
  const [imageUrl, setImageUrl] = useState("");
  const [showDish, setShowDish] = useState(false);
  const [buttonTitle, setButtonTitle] = useState("Add Dish");
  const inputFile = useRef();

  const classes = useStyles();

  useEffect(() => {
    if (!input.image) return;

    const fileReader = new FileReader();

    fileReader.readAsDataURL(input.image);
    fileReader.onloadend = () => {
      fileReader.onerror = (err) => {
        if (err) console.log(err);
      };
      setImageUrl(fileReader.result);
    };
  }, [input.image]);

  const fileHandler = (e) => {
    const { files } = e.target;

    if (files && files.length === 1) {
      setInput((prevState) => ({ ...prevState, image: files[0] }));
    }
  };

  const addMenuDishButton = () => {
    setShowDish((prevState) => {
      if (buttonTitle === "Edit Dish") return true;

      return !prevState;
    });
    setButtonTitle("Add Dish");
    setInput((prevState) => ({
      ...prevState,
      _id: "",
      name: "",
      description: "",
      price: 0.5,
      image: null
    }));
    setImageUrl("");
  };

  // handle dish form submittion
  const dishFormHandler = () => {
    if (!input.name || !input.description || !input.price) return;

    if (
      input.name.length === 0 ||
      input.description.length === 0 ||
      input.price.length === 0
    )
      return;

    setShowDish(false);

    if (buttonTitle === "Edit Dish") {
      // check if edit dish
      const dish = dishes.find((dish) => dish._id === input._id);

      dish.name = input.name;
      dish.description = input.description;
      dish.price = input.price;
      dish._id = input._id;
      dish.image = input.image;
      dish.imageUrl = imageUrl;
    } else {
      // else add dish
      if (!input.image || input.image.length === 0) return;

      dishes.push({
        name: input.name,
        description: input.description,
        price: input.price,
        image: input.image,
        _id: uuid(),
        imageUrl
      });
    }

    setInput((prevState) => ({
      ...prevState,
      name: "",
      description: "",
      price: 0.5,
      _id: "",
      image: null
    }));

    setImageUrl(null);
  };

  // delete catagory
  const removeCatagory = () => {
    // find catagory by _id
    const filteredCatagories = catagories.filter(
      (catagory) => catagory._id !== catagoryId
    );
    // update catagories state
    setCatagories(filteredCatagories);
  };

  return (
    <li className="addMenuItem">
      <div className="addMenuItem__header">
        <span className="addMenuItem__remove" onClick={removeCatagory}>
          &#10006;
        </span>

        <h2>{name}</h2>
      </div>

      {/* render catagory dishes */}
      <ul>
        {dishes &&
          dishes.map(({ _id, name, description, price, imageUrl }) => (
            <li key={_id || uuid()} id={_id} className="addMenuItem__dish">
              <div className="addMenuItem__dish-backdrop">
                <IconButton
                  className={`${classes.backdropButton} ${classes.editButton}`}
                  onClick={() => {
                    // setState of show dish
                    setShowDish(true);
                    // deliver dish data to dish form
                    setInput((prevState) => ({
                      ...prevState,
                      name,
                      description,
                      price,
                      _id
                    }));
                    setImageUrl(imageUrl);
                    // change button text to edit
                    setButtonTitle("Edit Dish");
                  }}
                >
                  <Edit />
                </IconButton>

                <IconButton
                  className={`${classes.backdropButton} ${classes.deleteButton}`}
                  onClick={() => {
                    setCatagories((prevState) => {
                      let catagories = [];

                      for (const catagory of prevState) {
                        catagory.dishes = catagory.dishes.filter((dish) => {
                          if (input._id.length > 0) {
                            return dish._id !== input._id;
                          } else {
                            return dish._id !== _id;
                          }
                        });

                        catagories.push(catagory);
                      }
                      return catagories;
                    });
                  }}
                >
                  <Delete />
                </IconButton>
              </div>

              <div className="addMenuItem__dish-details">
                <h4>{name}</h4>
                <p>{description}</p>
                <p>${price}</p>
              </div>

              <div className="addMenuItem__dish-image">
                {imageUrl ? (
                  <img src={imageUrl} alt={name} />
                ) : (
                  <h5>no image</h5>
                )}
              </div>
            </li>
          ))}
      </ul>

      <button
        className="addMenuItem__dish-button"
        type="button"
        onClick={addMenuDishButton}
      >
        add new dish
      </button>

      {showDish && (
        <>
          <div className="addMenuItem__addDish">
            <div className="addMenuItem__addDish-details">
              <div>
                <label htmlFor="name">name</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={input.name}
                  onChange={inputHandler}
                  autoComplete="off"
                  autoFocus
                />
              </div>

              <div>
                <label htmlFor="description">description</label>
                <textarea
                  style={{ textTransform: "initial" }}
                  name="description"
                  id="description"
                  rows="4"
                  value={input.description}
                  onChange={inputHandler}
                  autoComplete="off"
                />
              </div>

              <div>
                <label htmlFor="price">price</label>
                <input
                  type="number"
                  name="price"
                  id="price"
                  step={0.5}
                  min={0.5}
                  value={parseFloat(input.price)}
                  onChange={inputHandler}
                  autoComplete="off"
                />
              </div>
            </div>

            <div className="addMenuItem__addDish-image">
              {imageUrl ? (
                <img src={imageUrl} alt="dish_image" />
              ) : (
                <h5>no image</h5>
              )}

              <input
                ref={inputFile}
                type="file"
                name="image"
                hidden
                onChange={fileHandler}
              />

              <button type="button" onClick={() => inputFile.current.click()}>
                upload image
              </button>
            </div>
          </div>

          <button
            className="addMenuItem__addDish-button"
            type="button"
            onClick={dishFormHandler}
          >
            {buttonTitle}
          </button>
        </>
      )}
    </li>
  );
};

export default AddMenuItem;
