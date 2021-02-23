import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { HashLink as Link } from "react-router-hash-link";
import uuid from "react-uuid";
import smoothscroll from "smoothscroll-polyfill";

import { useFetch } from "../../hooks/useFetch";

import "./SideMenu.css";

const SideMenu = () => {
  const [catagories, setCatagories] = useState([]);

  const restaurantId = useParams().restaurantId;
  const { fetchHandler } = useFetch();

  useEffect(() => {
    fetchHandler(`/${restaurantId}/restaurant_menu`)
      .then((res) => {
        if (res && res.menu) {
          for (const item of res.menu.items) {
            setCatagories((prevState) => [...prevState, item.name]);
          }
        }
      })
      .catch((err) => console.log(err));
  }, [fetchHandler, restaurantId]);

  useEffect(() => {
    window.__forceSmoothScrollPolyfill__ = true;
    smoothscroll.polyfill();
  }, []);

  const scrollWithOffset = (el) => {
    const yCoordinate = el.getBoundingClientRect().top + window.pageYOffset;
    const yOffset = -180; 
    window.scrollTo({ top: yCoordinate + yOffset, behavior: 'smooth' }); 
}

  return (
    <aside className="sideMenu">
      {catagories &&
        catagories.map((catagory) => (
          <Link smooth key={uuid()} to={`#${catagory}`} scroll={scrollWithOffset}>
            {catagory}
          </Link>
        ))}
    </aside>
  );
};

export default SideMenu;
