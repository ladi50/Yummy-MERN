import { useCallback, useEffect, useMemo, useState } from "react";

export const useFetch = () => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState();

  const controller = useMemo(() => new AbortController(), []);
  const { signal } = controller;

  const fetchHandler = useCallback(
    async (url, args) => {
      setLoading(true);
      setErrorMsg(null);

      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}${url}`,
          { ...args, signal }
        );

        const res = await response.json();

        if (!response.ok) {
          throw new Error(res.message);
        }

        setLoading(false);

        return res;
      } catch (err) {
        setLoading(false);
        setErrorMsg(err.message.split(","));
      }
    },
    [signal]
  );

  useEffect(() => {
    return () => {
      controller.abort();
    };
  }, [controller]);

  return { fetchHandler, loading, errorMsg };
};
