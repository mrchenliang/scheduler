import React from "react";
import classnames from "classnames";

import "components/DayListItem.scss";

export default function DayListItem(props) {
  let dayClass = classnames("day-list__item", {
    "day-list__item--selected": props.selected,
    "day-list__item--full": (props.spots === 0)
  });
  let spotsRemaining = (props.spots === 0 ? "no" : props.spots);
  spotsRemaining += ((props.spots > 1 || props.spots < 1)? " spots remaining" : " spot remaining");


  return (
    <li
      data-testid="day"
      className={dayClass}
      onClick={() => props.setDay(props.name)}
    >
      <h2 className="text--regular">{props.name}</h2>
      <h3 className="text--light">{spotsRemaining}</h3>
    </li>
  );
}
