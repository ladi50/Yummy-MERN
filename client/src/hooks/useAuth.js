import { useCallback, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

export const useAuth = () => {
  const [token, setToken] = useState();
  const [userId, setUserId] = useState();
  const [username, setUsername] = useState();
  const [expirationDate, setExpirationDate] = useState();
  const history = useHistory();

  const login = useCallback(async (userId, token, username, expirationDate) => {
    const expDate =
      expirationDate || new Date(new Date().getTime() + 3600 * 1000);

    setExpirationDate(expDate);
    setToken(token);
    setUserId(userId);
    setUsername(username);

    localStorage.setItem(
      "userData",
      JSON.stringify({
        token,
        userId,
        username,
        expirationDate: expDate
      })
    );
  }, []);

  const logout = useCallback(() => {
    let pushToLogin;

    if (token) {
      pushToLogin = setTimeout(() => {
        history.push("/login");
      }, [50]);
    }

    setExpirationDate(null);
    setToken(null);
    setUsername(null);
    setUserId(null);

    localStorage.removeItem("userData");

    window.addEventListener("unload", () => clearTimeout(pushToLogin));
  }, [history, token]);

  useEffect(() => {
    if (localStorage.getItem("userData")) {
      const userData = JSON.parse(localStorage.getItem("userData"));

      if (
        userData &&
        userData.token &&
        userData.userId &&
        new Date(userData.expirationDate).getTime() > new Date().getTime()
      ) {
        const { userId, username, token, expirationDate } = userData;

        login(userId, token, username, new Date(expirationDate));
      }
    }
  }, [login]);

  useEffect(() => {
    if (new Date(expirationDate).getTime() > new Date().getTime()) {
      return;
    }

    const timeout = new Date(expirationDate).getTime() - new Date().getTime();

    const logoutUser = setTimeout(logout, timeout);

    return () => {
      clearTimeout(logoutUser);
    };
  }, [logout, expirationDate, token]);

  return { login, logout, token, userId, username };
};
