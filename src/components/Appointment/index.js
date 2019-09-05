import React, { useState } from 'react';
import "./styles.scss";

import Empty from "components/Appointment/Empty";
import Show from "components/Appointment/Show";
import Form from './Form';
import useVisualMode from "../../hooks/useVisualMode";

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";

const Appointment = props => {
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  return (
    <div>
      <header className="appointment__time">
        <h4 className="text--semi-bold">{props.time}</h4>
        <hr className="appointment__separator" />
      </header>
      {mode === EMPTY && <Empty onAdd={props.onAdd} />}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
        />
      )}
    </div>
  );
};

export default Appointment;
