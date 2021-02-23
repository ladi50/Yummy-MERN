import React, { useContext, useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";

import Button from "../../components/Button/Button";
import Spinner from "../../components/Spinner/Spinner";
import { AppContext } from "../../context/context";
import { useFetch } from "../../hooks/useFetch";

import "./AddRestaurant.css";

const AddRestaurant = () => {
  const fileInput = useRef();
  const [imageUrl, setImageUrl] = useState();
  const [checkboxes, setCheckboxes] = useState({
    meat: false,
    sushi: false,
    fish: false,
    noodles: false,
    thai: false,
    indian: false,
    italian: false,
    vegan: false,
    chinese: false,
    salads: false,
    pizza: false,
    breakfast: false,
    burgers: false
  });
  const [data, setData] = useState({
    name: "",
    street: "",
    city: "",
    image: null,
    phoneNumber: "",
    catagories: [],
    minDeliveryTime: 0,
    maxDeliveryTime: 0,
    deliveryPrice: 0,
    schedule: [
      {
        days: "Monday-Thursday",
        openingTime: "",
        closingTime: ""
      },
      {
        days: "Friday",
        openingTime: "",
        closingTime: ""
      },
      {
        days: "Saturday",
        openingTime: "",
        closingTime: ""
      }
    ]
  });

  const history = useHistory();
  const { token, userId } = useContext(AppContext);
  const { fetchHandler, errorMsg, loading } = useFetch();

  useEffect(() => {
    fetchHandler(`/${userId}/restaurant`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((res) => {
      if (res && res.restaurant) {
        const minDeliveryTime = res.restaurant.deliveryTime.split("-")[0];
        const maxDeliveryTime = res.restaurant.deliveryTime.split("-")[1];
        const catagories = res.restaurant.catagories;

        setData({ ...res.restaurant, minDeliveryTime, maxDeliveryTime });
        setImageUrl(res.restaurant.imageUrl);
        for (const catagory of catagories) {
          setCheckboxes((prevState) => ({ ...prevState, [catagory]: true }));

          const catagoryElement = document.getElementById(catagory);

          catagoryElement.setAttribute("checked", true);
          catagoryElement.parentNode.children[1].style.color = "white";
          catagoryElement.parentNode.children[1].style.backgroundColor =
            "#454ae4";
        }
      }
    });
  }, [fetchHandler, token, userId]);

  useEffect(() => {
    if (!data.image) return;

    const fileReader = new FileReader();
    fileReader.readAsDataURL(data.image);

    fileReader.onloadend = () => {
      fileReader.onerror = (err) => {
        console.log(err);
      };

      setImageUrl(fileReader.result);
    };
  }, [data.image]);

  useEffect(() => {
    const imageDiv = document.getElementsByClassName("addRestaurant__image")[0];
    const emptyImage = document.getElementById("emptyImage");

    if (emptyImage && imageDiv) {
      emptyImage.style.height = imageDiv.offsetWidth + "px";
    }
  }, []);

  const checkboxColor = (e) => {
    if (e.target.checked) {
      e.target.parentNode.children[1].style.backgroundColor = "#454ae4";
      e.target.parentNode.children[1].style.color = "white";
    } else {
      e.target.parentNode.children[1].style.backgroundColor = "white";
      e.target.parentNode.children[1].style.color = "black";
    }

    let newCatagories = [...data.catagories];

    if (newCatagories.includes(e.target.id)) {
      newCatagories = newCatagories.filter((item) => item !== e.target.id);
    } else {
      newCatagories.push(e.target.id);
    }

    setData((prevState) => ({ ...prevState, catagories: newCatagories }));
  };

  const dataChangeHandler = (e) => {
    const { name, value } = e.target;

    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const scheduleChangeHandler = (e) => {
    const { name, value, id } = e.target;

    const index = id.split("#")[1];
    const oldSchedule = [...data.schedule];
    let newSchedule = [];

    oldSchedule[index][name] = value;

    newSchedule = oldSchedule;

    setData((prevData) => ({ ...prevData, schedule: newSchedule }));
  };

  const fileHandler = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setData((prevData) => ({ ...prevData, image: e.target.files[0] }));
    }
  };

  const checkboxHandler = (e) => {
    const { checked, id } = e.target;

    setCheckboxes((prevState) => ({ ...prevState, [id]: checked }));
  };

  const submitRestaurant = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    try {
      formData.append("name", data.name);
      formData.append("street", data.street);
      formData.append("city", data.city);
      formData.append("image", data.image);
      formData.append("imageUrl", imageUrl);
      formData.append("phoneNumber", data.phoneNumber.toString());
      formData.append("deliveryPrice", data.deliveryPrice);
      formData.append("catagories", JSON.stringify(data.catagories));
      formData.append(
        "deliveryTime",
        `${data.minDeliveryTime}-${data.maxDeliveryTime}`.toString()
      );
      formData.append("schedule", JSON.stringify(data.schedule));
    } catch (err) {
      throw new Error(err);
    }

    if (data._id) {
      fetchHandler(`/${userId}/editRestaurant`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      })
        .then(
          (res) =>
            res &&
            history.push({
              pathname: "/",
              search: "?edited_restaurant=true"
            })
        )
        .catch((err) => console.log(err));
    } else {
      fetchHandler(`/${userId}/addRestaurant`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      })
        .then(
          (res) =>
            res &&
            res.restaurant &&
            history.push({
              pathname: "/",
              search: "?added_restaurant=true"
            })
        )
        .catch((err) => console.log(err));
    }
  };

  return (
    <form className="addRestaurant" onSubmit={submitRestaurant}>
      {loading && <Spinner />}

      {data._id ? (
        <h2>{data.name} restaurant form</h2>
      ) : (
        <h2>new restaurant form</h2>
      )}

      <div className="addRestaurant__name">
        <label htmlFor="name">restaurant name</label>
        <input
          type="text"
          name="name"
          id="name"
          value={data.name}
          onChange={dataChangeHandler}
        />
      </div>

      <div className="addRestaurant__address">
        <label htmlFor="street">street</label>
        <input
          type="text"
          name="street"
          id="street"
          value={data.street}
          onChange={dataChangeHandler}
        />
      </div>

      <div className="addRestaurant__address">
        <label htmlFor="city">city</label>
        <input
          type="text"
          name="city"
          id="city"
          value={data.city}
          onChange={dataChangeHandler}
        />
      </div>

      <div className="addRestaurant__phone">
        <label htmlFor="phone">phone number</label>
        <input
          type="tel"
          name="phoneNumber"
          id="phone"
          value={data.phoneNumber}
          onChange={dataChangeHandler}
          placeholder="XXX-XXX-XXXX"
        />
      </div>

      <div className="addRestaurant__catagories">
        <h3>catagories</h3>

        <div>
          <div className="catagory" onClick={checkboxColor}>
            <input
              type="checkbox"
              hidden
              onChange={checkboxHandler}
              id="meat"
            />
            <label htmlFor="meat">meat</label>
          </div>

          <div className="catagory" onClick={checkboxColor}>
            <input
              type="checkbox"
              hidden
              onChange={checkboxHandler}
              id="sushi"
            />
            <label htmlFor="sushi">sushi</label>
          </div>

          <div className="catagory" onClick={checkboxColor}>
            <input
              type="checkbox"
              hidden
              onChange={checkboxHandler}
              id="fish"
            />
            <label htmlFor="fish">fish</label>
          </div>

          <div className="catagory" onClick={checkboxColor}>
            <input
              type="checkbox"
              hidden
              onChange={checkboxHandler}
              id="noodles"
            />
            <label htmlFor="noodles">noodles</label>
          </div>

          <div className="catagory" onClick={checkboxColor}>
            <input
              type="checkbox"
              hidden
              onChange={checkboxHandler}
              id="thai"
            />
            <label htmlFor="thai">thai</label>
          </div>

          <div className="catagory" onClick={checkboxColor}>
            <input
              type="checkbox"
              hidden
              onChange={checkboxHandler}
              id="indian"
            />
            <label htmlFor="indian">indian</label>
          </div>

          <div className="catagory" onClick={checkboxColor}>
            <input
              type="checkbox"
              hidden
              onChange={checkboxHandler}
              id="italian"
            />
            <label htmlFor="italian">italian</label>
          </div>

          <div className="catagory" onClick={checkboxColor}>
            <input
              type="checkbox"
              hidden
              onChange={checkboxHandler}
              id="vegan"
            />
            <label htmlFor="vegan">vegan</label>
          </div>

          <div className="catagory" onClick={checkboxColor}>
            <input
              type="checkbox"
              hidden
              onChange={checkboxHandler}
              id="chinese"
            />
            <label htmlFor="chinese">chinese</label>
          </div>

          <div className="catagory" onClick={checkboxColor}>
            <input
              type="checkbox"
              hidden
              onChange={checkboxHandler}
              id="salads"
            />
            <label htmlFor="salads">salads</label>
          </div>

          <div className="catagory" onClick={checkboxColor}>
            <input
              type="checkbox"
              hidden
              onChange={checkboxHandler}
              id="pizza"
            />
            <label htmlFor="pizza">pizza</label>
          </div>

          <div className="catagory" onClick={checkboxColor}>
            <input
              type="checkbox"
              hidden
              onChange={checkboxHandler}
              id="breakfast"
            />
            <label htmlFor="breakfast">breakfast</label>
          </div>

          <div className="catagory" onClick={checkboxColor}>
            <input
              type="checkbox"
              hidden
              onChange={checkboxHandler}
              id="burgers"
            />
            <label htmlFor="burgers">burgers</label>
          </div>
        </div>
      </div>

      <div className="addRestaurant__addImage">
        <div className="addRestaurant__image">
          {imageUrl ? (
            <img src={imageUrl} alt={data.name} />
          ) : (
            <p id="emptyImage">No Image</p>
          )}
        </div>

        <input
          ref={fileInput}
          type="file"
          name="image"
          hidden
          onChange={fileHandler}
        />

        <Button type="button" onClick={() => fileInput.current.click()}>
          {imageUrl ? "change image" : "add image"}
        </Button>
      </div>

      <div className="addRestaurant__delivery">
        <h3>
          delivery time <small>(minutes)</small>
        </h3>

        <div>
          <div>
            <label htmlFor="minDeliveryTime">min</label>
            <input
              type="number"
              name="minDeliveryTime"
              id="minDeliveryTime"
              value={parseInt(data.minDeliveryTime)}
              onChange={dataChangeHandler}
              min="10"
            />
          </div>

          <div>
            <label htmlFor="maxDeliveryTime">max</label>
            <input
              type="number"
              name="maxDeliveryTime"
              id="maxDeliveryTime"
              value={parseInt(data.maxDeliveryTime)}
              onChange={dataChangeHandler}
              min="10"
            />
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="deliveryPrice">delivery price</label>

        <input
          type="number"
          name="deliveryPrice"
          id="deliveryPrice"
          value={parseInt(data.deliveryPrice)}
          onChange={dataChangeHandler}
          min="0"
        />
      </div>

      <div className="addRestaurant__schedule">
        <h3>restaurant schedule</h3>

        <h4>monday - thursday</h4>

        <div className="addRestaurant__schedule-input">
          <div>
            <label htmlFor="open#0">opening time</label>
            <input
              type="time"
              name="openingTime"
              id="open#0"
              value={data.schedule[0].openingTime}
              onChange={scheduleChangeHandler}
            />
          </div>

          <div>
            <label htmlFor="close#0">closing time</label>
            <input
              type="time"
              name="closingTime"
              id="close#0"
              value={data.schedule[0].closingTime}
              onChange={scheduleChangeHandler}
            />
          </div>
        </div>

        <h4>friday</h4>

        <div className="addRestaurant__schedule-input">
          <div>
            <label htmlFor="open#1">opening time</label>
            <input
              type="time"
              name="openingTime"
              id="open#1"
              value={data.schedule[1].openingTime}
              onChange={scheduleChangeHandler}
            />
          </div>

          <div>
            <label htmlFor="close#1">closing time</label>
            <input
              type="time"
              name="closingTime"
              id="close#1"
              value={data.schedule[1].closingTime}
              onChange={scheduleChangeHandler}
            />
          </div>
        </div>

        <h4>saturday</h4>

        <div className="addRestaurant__schedule-input">
          <div>
            <label htmlFor="open#2">opening time</label>
            <input
              type="time"
              name="openingTime"
              id="open#2"
              value={data.schedule[2].openingTime}
              onChange={scheduleChangeHandler}
            />
          </div>

          <div>
            <label htmlFor="close#2">closing time</label>
            <input
              type="time"
              name="closingTime"
              id="close#2"
              value={data.schedule[2].closingTime}
              onChange={scheduleChangeHandler}
            />
          </div>
        </div>
      </div>

      <div className="addRestaurant__button">
        <Button
          type="submit"
          title={data._id ? "edit restaurant" : "add restaurant"}
        >
          {loading && <Spinner button />}
        </Button>
      </div>

      <div style={{ height: "80px" }}></div>
    </form>
  );
};

export default AddRestaurant;
