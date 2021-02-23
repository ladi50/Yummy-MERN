import React from "react";

import "./InvoiceDish.css";

const InvoiceDish = ({ name, image, price, quantity }) => {
  return (
    <li className="invoiceDish">
      <div className="invoiceDish__details">
        <p>
          <span>name:</span> {name}
        </p>
        <p>
          <span>quantity:</span> {quantity}
        </p>
        <p>
          <span>dish price:</span> ${price}
        </p>
      </div>

      <div className="invoiceDish__image">
        <img src={image} alt={name} />
      </div>
    </li>
  );
};

export default InvoiceDish;
