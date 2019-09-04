import React from "react";
import "./styles.scss";

import Empty from "components/Appointment/Empty";
import Show from "components/Appointment/Show";

const Appointment = props => {
  return (
    <div>
      <header className="appointment__time">
        <h4 className="text--semi-bold">{props.time}</h4>
        <hr className="appointment__separator" />
      </header>
        {props.interview ? (
          <Show
            interviewer={props.interview.interviewer}
            student={props.interview.student}
          />
        ) : (
          <Empty />
        )}
    </div>
  );
};

export default Appointment;
