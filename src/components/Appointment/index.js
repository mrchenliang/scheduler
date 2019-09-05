import React, { useState } from "react";
import "./styles.scss";

import Header from "./Header";
import Empty from "./Empty";
import Form from "./Form";
import Show from "./Show";
import { useVisualMode } from "../hooks/useVisualMode";

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";

const Appointment = props => {
  const { mode, transition, back } = useVisualMode(props.interview ? SHOW : EMPTY)
  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    return interview;
  }

  return (
    <div>
      <header className="appointment__time">
        <h4 className="text--semi-bold">{props.time}</h4>
        <hr className="appointment__separator" />
      </header>
      {console.log(props)}
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
        />
      )}
      {mode === CREATE && (
        <Form
          interviewers={props.interviewers}
          onCancel={back}
          onSave={(name, interviewer) => {
            if (name && interviewer) {
              props.bookInterview(props.id, save(name, interviewer));
              transition(SHOW);
            } else {
              back();
            }
          }}
        />
      )}
    </div>
  );
};

export default Appointment;
