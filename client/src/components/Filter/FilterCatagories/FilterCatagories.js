import React from "react";

import "./FilterCatagories.css";

const FilterCatagories = ({ setInputs, inputs }) => {
  const checkboxHandler = (e) => {
    const { checked, id } = e.target;

    if (checked) {
      setInputs((prevState) => ({
        ...prevState,
        catagories: [...prevState.catagories, id]
      }));
    } else {
      const filteredCatagories = inputs.catagories.filter(
        (item) => item !== id
      );

      setInputs((prevState) => ({
        ...prevState,
        catagories: filteredCatagories
      }));
    }
  };

  const checkboxColor = (e) => {
    if (e.target.checked) {
      e.target.parentNode.children[1].style.backgroundColor = "#454ae4";
      e.target.parentNode.children[1].style.color = "white";
    } else {
      e.target.parentNode.children[1].style.backgroundColor = "white";
      e.target.parentNode.children[1].style.color = "black";
    }
  };

  return (
    <div className="filterCatagories">
      <h2 htmlFor="catagories">Catagories</h2>

      <div className="filterCatagories__catagory" onClick={checkboxColor}>
        <input type="checkbox" hidden onChange={checkboxHandler} id="meat" />
        <label htmlFor="meat">meat</label>
      </div>

      <div className="filterCatagories__catagory" onClick={checkboxColor}>
        <input type="checkbox" hidden onChange={checkboxHandler} id="sushi" />
        <label htmlFor="sushi">sushi</label>
      </div>

      <div className="filterCatagories__catagory" onClick={checkboxColor}>
        <input type="checkbox" hidden onChange={checkboxHandler} id="fish" />
        <label htmlFor="fish">fish</label>
      </div>

      <div className="filterCatagories__catagory" onClick={checkboxColor}>
        <input type="checkbox" hidden onChange={checkboxHandler} id="noodles" />
        <label htmlFor="noodles">noodles</label>
      </div>

      <div className="filterCatagories__catagory" onClick={checkboxColor}>
        <input type="checkbox" hidden onChange={checkboxHandler} id="thai" />
        <label htmlFor="thai">thai</label>
      </div>

      <div className="filterCatagories__catagory" onClick={checkboxColor}>
        <input type="checkbox" hidden onChange={checkboxHandler} id="indian" />
        <label htmlFor="indian">indian</label>
      </div>

      <div className="filterCatagories__catagory" onClick={checkboxColor}>
        <input type="checkbox" hidden onChange={checkboxHandler} id="italian" />
        <label htmlFor="italian">italian</label>
      </div>

      <div className="filterCatagories__catagory" onClick={checkboxColor}>
        <input type="checkbox" hidden onChange={checkboxHandler} id="vegan" />
        <label htmlFor="vegan">vegan</label>
      </div>

      <div className="filterCatagories__catagory" onClick={checkboxColor}>
        <input type="checkbox" hidden onChange={checkboxHandler} id="chinese" />
        <label htmlFor="chinese">chinese</label>
      </div>

      <div className="filterCatagories__catagory" onClick={checkboxColor}>
        <input type="checkbox" hidden onChange={checkboxHandler} id="salads" />
        <label htmlFor="salads">salads</label>
      </div>

      <div className="filterCatagories__catagory" onClick={checkboxColor}>
        <input type="checkbox" hidden onChange={checkboxHandler} id="pizza" />
        <label htmlFor="pizza">pizza</label>
      </div>

      <div className="filterCatagories__catagory" onClick={checkboxColor}>
        <input
          type="checkbox"
          hidden
          onChange={checkboxHandler}
          id="breakfast"
        />
        <label htmlFor="breakfast">breakfast</label>
      </div>

      <div className="filterCatagories__catagory" onClick={checkboxColor}>
        <input type="checkbox" hidden onChange={checkboxHandler} id="burgers" />
        <label htmlFor="burgers">burgers</label>
      </div>
    </div>
  );
};

export default FilterCatagories;
