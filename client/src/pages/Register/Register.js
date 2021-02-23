import React, { useCallback, useContext, useEffect, useState } from "react";

import Form from "../../components/Form/Form";
import Spinner from "../../components/Spinner/Spinner";
import { useFetch } from "../../hooks/useFetch";
import { AppContext } from "../../context/context";

const Register = () => {
  const [input, setInput] = useState({
    username: "",
    email: "",
    password: ""
  });

  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: ""
  });

  const { fetchHandler, loading, errorMsg } = useFetch();
  const { login } = useContext(AppContext);

  const errorsHandler = useCallback(() => {
    setErrors({
      username: "",
      email: "",
      password: ""
    });

    for (const error of errorMsg) {
      if (error.includes("Password")) {
        setErrors((prevState) => ({ ...prevState, password: error }));
      }

      if (error.includes("Email")) {
        setErrors((prevState) => ({ ...prevState, email: error }));
      }

      if (error.includes("Username")) {
        setErrors((prevState) => ({ ...prevState, username: error }));
      }
    }
  }, [errorMsg]);

  useEffect(() => {
    const inputs = document.getElementsByTagName("input");

    for (const item of inputs) {
      item.style.borderColor = "initial";
    }

    if (errorMsg) {
      for (const item of inputs) {
        if (item.value.length === 0 && item.name === "username") {
          item.style.borderColor = "red";
        }
        if (item.value.length === 0 && item.name === "email") {
          item.style.borderColor = "red";
        }
        if (item.value.length < 6 && item.name === "password") {
          item.style.borderColor = "red";
        }
      }

      errorsHandler();
    }
  }, [errorMsg, errorsHandler]);

  const changeHandler = (e) => {
    const { name, value } = e.target;

    setInput((prevState) => {
      return { ...prevState, [name]: value };
    });
  };

  const inputBlurHandler = (e) => {
    if (e.target.value.length === 0) {
      e.target.style.borderColor = "red";
    }
  };

  const signupHandler = (e) => {
    e.preventDefault();

    fetchHandler("/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(input)
    })
      .then((res) => {
        if (res && res.user) {
          login(res.user._id, res.token, res.user.username);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <Form title="sign up" button="join" register onSubmit={signupHandler}>
        {loading ? (
          <Spinner />
        ) : (
          <>
            <div>
              <label htmlFor="username">Username</label>
              <input
                type="username"
                id="username"
                error={errorMsg}
                value={input.username}
                onChange={changeHandler}
                name="username"
                placeholder="enter username"
                autoFocus
                autoComplete="off"
                onBlur={inputBlurHandler}
              />
              {errors.username && <small>{errors.username}</small>}
            </div>

            <div>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={input.email}
                onChange={changeHandler}
                name="email"
                placeholder="enter your email"
                autoComplete="new_email"
                onBlur={inputBlurHandler}
              />
              {errors.email && <small>{errors.email}</small>}
            </div>

            <div>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={input.password}
                onChange={changeHandler}
                placeholder="enter your password"
                onBlur={inputBlurHandler}
              />
              {errors.password && <small>{errors.password}</small>}
            </div>
          </>
        )}
      </Form>
      <div style={{ height: "30px" }}></div>
    </>
  );
};

export default Register;
