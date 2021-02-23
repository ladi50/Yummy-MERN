import React, { useState } from "react";

import InvoiceDish from "./InvoiceDish/InvoiceDish";

import "./InvoiceDishes.css";

const InvoiceDishes = ({ dishes }) => {
  let totalPrice = 0;

  if (dishes.length > 0) {
    for (const dish of dishes) {
      totalPrice += dish.quantity * dish.price;
    }
  }

  return (
    <ul className="invoiceDishes">
      {dishes &&
        dishes.map((dish) => (
          <InvoiceDish
            key={dish._id}
            image={dish.imageUrl}
            name={dish.name}
            price={dish.price}
            quantity={dish.quantity}
          />
        ))}

      <p>Total Price: ${totalPrice}</p>
    </ul>
  );
};

export default InvoiceDishes;
