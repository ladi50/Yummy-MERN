import { useEffect, useState } from "react";

import { useFetch } from "./useFetch";

export const useFilter = () => {
  const [restaurants, setRestaurants] = useState([]);

  const { fetchHandler } = useFetch();

  useEffect(() => {
    fetchHandler(`/restaurants`)
      .then((res) => {
        if (res && res.restaurants) {
          setRestaurants(res.restaurants);
        }
      })
      .catch((err) => console.log(err));
  }, [fetchHandler]);

  return { restaurants };
};
