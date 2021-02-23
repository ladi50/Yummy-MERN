import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import MenuCatagory from "./MenuCatagory/MenuCatagory";
import { useFetch } from "../../hooks/useFetch";

import "./MenuDishes.css";

const MenuDishes = () => {
  const [menu, setMenu] = useState();

  const restaurantId = useParams().restaurantId;
  const { fetchHandler } = useFetch();

  useEffect(() => {
    fetchHandler(`/${restaurantId}/restaurant_menu`)
      .then((res) => res && setMenu(res.menu))
      .catch((err) => console.log(err));
  }, [fetchHandler, restaurantId]);

  return (
    <div className="menuDishes">
      {menu &&
        menu.items.map(({ _id, name, dishes }) => (
          <MenuCatagory key={_id} catagory={name} dishes={dishes} />
        ))}
    </div>
  );
};

export default MenuDishes;
