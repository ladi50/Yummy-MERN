import React, { useCallback, useContext, useEffect, useState } from "react";
import { IconButton } from "@material-ui/core";
import { Delete, Edit } from "@material-ui/icons";

import Modal from "../../Modal/Modal";
import Button from "../../Button/Button";
import Backdrop from "../../Backdrop/Backdrop";
import { AppContext } from "../../../context/context";

import useStyles from "./styles";
import "./OrderItem.css";

const OrderItem = ({
  id,
  image,
  name,
  price,
  qty,
  description,
  kitchenNotes,
  deliveryNotes
}) => {
  const [show, setShow] = useState(false);
  const [text, setText] = useState({
    kitchenNotes,
    deliveryNotes,
    quantity: qty
  });

  const { removeFromCart, editItemCart } = useContext(AppContext);
  const classes = useStyles();

  const textHandler = (e) => {
    const { name, value } = e.target;

    setText((prevState) => ({ ...prevState, [name]: value }));
  };

  const removeOrderItem = () => {
    removeFromCart(id);
  };

  const editCartDish = useCallback(
    (e) => {
      if (e) {
        e.preventDefault();
      }

      const content = { id, ...text, name, image, price };

      editItemCart(id, content);
    },
    [editItemCart, id, text, name, image, price]
  );

  useEffect(() => {
    editCartDish();
  }, [text.quantity]);

  return (
    <div className="orderItem">
      {show && <Backdrop onClick={() => setShow(false)} />}

      <Modal show={show} setShow={setShow}>
        <form
          onSubmit={(e) => {
            editCartDish(e);
            setShow(false);
          }}
        >
          <div className="modal__dish">
            <div className="modal__dish-details">
              <h4>{name}</h4>
              <p>{description}</p>
              <p>${price * text.quantity}</p>

              <div className="modal__dish-qty">
                <button
                  type="button"
                  onClick={() =>
                    text.quantity > 1 &&
                    setText((prevState) => ({
                      ...prevState,
                      quantity: text.quantity - 1
                    }))
                  }
                >
                  -
                </button>
                <p>{text.quantity}</p>
                <button
                  type="button"
                  onClick={() =>
                    setText((prevState) => ({
                      ...prevState,
                      quantity: text.quantity + 1
                    }))
                  }
                >
                  +
                </button>
              </div>
            </div>

            <div className="modal__dish-image">
              <img width="600" src={image} alt={name} />
            </div>
          </div>

          <div className="modal__dish-notes">
            <label htmlFor="kitchenNotes">kitchen notes</label>
            <textarea
              onChange={textHandler}
              value={text.kitchenNotes}
              name="kitchenNotes"
              id="kitchenNotes"
              rows="3"
            ></textarea>
            <label htmlFor="deliveryNotes">delivery notes</label>
            <textarea
              onChange={textHandler}
              value={text.deliveryNotes}
              name="deliveryNotes"
              id="deliveryNotes"
              rows="3"
            ></textarea>
          </div>

          <div className="modal__dish-button">
            <Button type="submit" title="edit dish" />
          </div>
        </form>
      </Modal>

      <div className="orderItem__buttons">
        <IconButton className={classes.deleteButton} onClick={removeOrderItem}>
          <Delete />
        </IconButton>

        <IconButton
          className={classes.editButton}
          onClick={() => setShow(true)}
        >
          <Edit />
        </IconButton>
      </div>

      <img width="120" src={image} alt={name} />

      <p>{name}</p>

      <div className="orderItem__amount">
        <div className="orderItem__quantity">
          <button
            onClick={() =>
              text.quantity > 1 &&
              setText((prevState) => ({
                ...prevState,
                quantity: prevState.quantity - 1
              }))
            }
          >
            -
          </button>
          <span>{text.quantity}</span>
          <button
            onClick={() => {
              setText((prevState) => ({
                ...prevState,
                quantity: text.quantity + 1
              }));
            }}
          >
            +
          </button>
        </div>

        <p>${price * text.quantity}</p>
      </div>
    </div>
  );
};

export default OrderItem;
