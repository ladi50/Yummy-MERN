import React from "react";
import {
  Timer,
  InsertEmoticon,
  AttachMoney,
  Brightness4Outlined
} from "@material-ui/icons";

import "./Advantages.css";

const Advatages = () => {
  const aosDelay = (time) => {
    if (window.innerWidth > 769) {
      return time;
    } else {
      return time / 2.5;
    }
  };

  return (
    <section className="advantages">
      <div className="advantages__skill" data-aos="fade">
        <Timer />
        <h3>fast delivery</h3>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea eaque
          eligendi consequatur, itaque soluta id iure tempora at. Repudiandae
          totam dicta cupiditate autem aliquid eius!
        </p>
      </div>

      <div
        className="advantages__skill"
        data-aos="fade"
        data-aos-delay={aosDelay(500)}
      >
        <Brightness4Outlined />
        <h3>24/7 order</h3>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea eaque
          eligendi consequatur, itaque soluta id iure tempora at. Repudiandae
          totam dicta cupiditate autem aliquid eius!
        </p>
      </div>

      <div
        className="advantages__skill"
        data-aos="fade"
        data-aos-delay={aosDelay(1000)}
      >
        <AttachMoney />
        <h3>lowest prices</h3>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea eaque
          eligendi consequatur, itaque soluta id iure tempora at. Repudiandae
          totam dicta cupiditate autem aliquid eius!
        </p>
      </div>

      <div
        className="advantages__skill"
        data-aos="fade"
        data-aos-delay={aosDelay(1500)}
      >
        <InsertEmoticon />
        <h3>happy customers</h3>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea eaque
          eligendi consequatur, itaque soluta id iure tempora at. Repudiandae
          totam dicta cupiditate autem aliquid eius!
        </p>
      </div>
    </section>
  );
};

export default Advatages;
