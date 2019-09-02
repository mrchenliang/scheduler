import React from "react";
import DayListItem from "components/DayListItem";

export default function DayList(props) {
  const dayListItems = props.days.map(day => {
    return (
      <DayListItem
        key={day.id}
        selected={day.name === props.day}
        spots={day.spots}
        name={day.name}
        setDay={props.setDay}
      />
    );
  });
  return (
    <ul>
      <li>{dayListItems}</li>
    </ul>
  );
}

