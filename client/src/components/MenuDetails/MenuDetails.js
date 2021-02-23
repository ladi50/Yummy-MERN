import React from "react";

import MenuOrders from "./MenuOrders/MenuOrders";

import "./MenuDetails.css";

const MenuDetails = ({ street, city, phoneNumber, schedule, hidden }) => {
  return (
    <aside className="menuDetails">
      <div>
        <h2>restaurant details</h2>

        <div className="menuDeatils__details">
          <h3>address</h3>

          <p>
            {street}, {city}
          </p>

          <h3>phone number</h3>

          <p>{phoneNumber}</p>
        </div>

        <div className="menuDetails__schedule">
          <h3>opening times</h3>

          <ul>
            {schedule &&
              schedule.map((item) => (
                <li key={item._id}>
                  <div>{item.days}</div>

                  <div>
                    {item.openingTime} - {item.closingTime}
                  </div>
                </li>
              ))}
          </ul>
        </div>
      </div>

      <MenuOrders hidden={hidden} />
    </aside>
  );
};

export default MenuDetails;
