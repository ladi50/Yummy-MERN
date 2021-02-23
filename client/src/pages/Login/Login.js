import React, { useContext, useEffect, useState } from "react";

import Form from "../../components/Form/Form";
import Spinner from "../../components/Spinner/Spinner";
import { useFetch } from "../../hooks/useFetch";
import { AppContext } from "../../context/context";

const Login = () => {
  const [input, setInput] = useState({
    email: "",
    password: ""
  });

  const { fetchHandler, loading, errorMsg } = useFetch();
  const { login } = useContext(AppContext);

  useEffect(() => {
    if (errorMsg) {
      const inputs = document.getElementsByTagName("input");

      for (const item of inputs) {
        item.style.borderColor = "red";
      }
    }
  }, [errorMsg]);

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

  const loginHandler = (e) => {
    e.preventDefault();

    fetchHandler("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(input)
    }).then((res) => {
      if (res) {
        const { user, token } = res;

        login(user._id, token, user.username);
      }
    });
  };

  return (
    <>
      <Form title="log in" button="log in" onSubmit={loginHandler}>
        {loading ? (
          <Spinner />
        ) : (
          <>
            {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
            <div>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={input.email}
                onChange={changeHandler}
                name="email"
                placeholder="enter your email"
                autoFocus
                autoComplete="off"
                onBlur={inputBlurHandler}
              />
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
            </div>
          </>
        )}
      </Form>
      <div style={{ height: "30px" }}></div>
    </>
  );
};

export default Login;
