import React, { useState, useRef, useEffect, useContext } from "react";
import { CSSTransition } from "react-transition-group";
import { ExpandMore } from "@material-ui/icons";

import "./Order.css";
import Button from "../Button/Button";
import Spinner from "../Spinner/Spinner";
import { AppContext } from "../../context/context";
import { useFetch } from "../../hooks/useFetch";

const Order = ({ _id, createdAt, products, payment, restaurant }) => {
  const [show, setShow] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [date, setDate] = useState();
  const arrowRef = useRef();

  const { userId, token } = useContext(AppContext);
  const { loading, fetchHandler } = useFetch();

  useEffect(() => {
    for (const product of products) {
      setTotalPrice(
        (prevState) => (prevState += product.price * product.quantity)
      );
    }
  }, [products]);

  useEffect(() => {
    setDate(
      new Date(createdAt)
        .toLocaleString()
        .replace(/\./g, "/")
        .substr(0, new Date(createdAt).toLocaleString().length - 3)
    );
  }, [createdAt]);

  const downloadInvoice = () => {
    setShow(true);

    fetchHandler(`/${userId}/order/${_id}/download_invoice`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((res) => {
        if (res) {
          window.open(
            `https://${process.env.REACT_APP_AWS_BUCKET}.s3.amazonaws.com/invoices/invoice-${_id}.pdf`,
            "_blank"
          );
        }
      })
      .catch((err) => console.log(err));
  };

  const rotateArrow = () => {
    if (!show) {
      arrowRef.current.style.transform = "rotate(180deg)";
    } else {
      arrowRef.current.style.transform = "rotate(0)";
    }
  };

  return (
    <li className="order" onClick={() => setShow((prevState) => !prevState)}>
      <div className="order__header">
        <div className="order__header-date">
          <p>{date}</p>
        </div>

        <div className="order__header-id">
          <h3>order #{_id}</h3>

          <ExpandMore ref={arrowRef} onClick={rotateArrow} />
        </div>
      </div>

      <CSSTransition
        in={show}
        timeout={300}
        classNames="order-show"
        mountOnEnter
        unmountOnExit
      >
        <div className="order__details">
          <div className="order__restaurant">
            <h3>ordered from:</h3>

            <ul>
              <li>{restaurant.name}</li>
              <li>
                {restaurant.street}, {restaurant.city}
              </li>
              <li>{restaurant.phoneNumber}</li>
            </ul>
          </div>

          <div className="order__payment">
            <h3>payment:</h3>

            <ul>
              <li>
                <span>method:</span> {payment.type}
              </li>
              <li>
                <span>card number:</span> {payment.card}
              </li>
              <li>
                <span>card holder:</span> {payment.name}
              </li>
              <li>
                <span>status:</span> {payment.status}
              </li>
            </ul>
          </div>

          <div className="order__price">
            <p>Total Price: ${totalPrice}</p>
          </div>

          <div className="order__button">
            <Button
              type="button"
              title="download invoice"
              onClick={downloadInvoice}
            >
              {loading && <Spinner button />}
            </Button>
          </div>
        </div>
      </CSSTransition>
    </li>
  );
};

export default Order;
