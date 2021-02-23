import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  CheckCircleOutline,
  Schedule,
  Phone,
  Restaurant,
  Home
} from "@material-ui/icons";

import InvoiceDishes from "../../components/InvoiceDishes/InvoiceDishes";
import Button from "../../components/Button/Button";
import Spinner from "../../components/Spinner/Spinner";
import { AppContext } from "../../context/context";
import { useFetch } from "../../hooks/useFetch";

import "./Invoice.css";

const Invoice = () => {
  const [order, setOrder] = useState([]);

  const orderId = useParams().orderId;
  const { userId, token, orderDetails } = useContext(AppContext);
  const { fetchHandler, loading } = useFetch();

  const date = order && new Date(order.createdAt).toLocaleString();

  useEffect(() => {
    setOrder(orderDetails);
  }, [orderDetails]);

  const downloadInvoice = () => {
    fetchHandler(`/${userId}/order/${orderId}/download_invoice`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((res) => {
        if (res) {
          window.open(
            `https://${process.env.REACT_APP_AWS_BUCKET}.s3.amazonaws.com/invoices/invoice-${orderId}.pdf`,
            "_blank"
          );
        }
      })
      .catch((err) => console.log(err));
  };

  if (!order || !order.restaurantId) {
    return (
      <>
        <h1 style={{ marginTop: "100px", textAlign: "center" }}>
          Order not found!
        </h1>
        <Link className="emptyInvoice__link" to={`/${userId}/orders`}>Go to order history</Link>
      </>
    );
  }

  return (
    <div className="invoice">
      {loading && <Spinner />}

      <div className="invoice__success">
        <div>
          <h2>payment succeeded!</h2>
          <CheckCircleOutline />
        </div>

        <div>
          <h3>delivery time: {order.restaurantId.deliveryTime} min</h3>
          <Schedule />
        </div>

        <div>
          <p>Order Date: {date.substr(0, date.length - 3)}</p>
        </div>
      </div>

      <div className="invoice__restaurant">
        <h4>ordered from:</h4>

        <div>
          <Restaurant />
          <p>{order.restaurantId.name}</p>
        </div>

        <div>
          <Home />
          <p>
            {order.restaurantId.street}, {order.restaurantId.city}
          </p>
        </div>

        <div>
          <Phone />
          <p>{order.restaurantId.phoneNumber}</p>
        </div>
      </div>

      <div className="invoice__order">
        <h5>order details:</h5>

        <p>Order #{order._id}</p>

        <InvoiceDishes dishes={order.products} />
      </div>

      <div className="invoice__payment">
        <h6>payment details:</h6>
        <p>
          <span>card type:</span> {order.payment.type}
        </p>
        <p>
          <span>card number:</span> {order.payment.card}
        </p>
        <p>
          <span>card holder:</span> {order.payment.name}
        </p>
        <p>
          <span>payment status:</span> {order.payment.status}
        </p>
        <p>
          <span>payment amount:</span> ${order.payment.amount}
        </p>
      </div>

      <div className="invoice__button">
        <Button
          type="button"
          title="download invoice"
          onClick={downloadInvoice}
          download={true}
        >
          {loading && <Spinner button />}
        </Button>
      </div>
    </div>
  );
};

export default Invoice;
