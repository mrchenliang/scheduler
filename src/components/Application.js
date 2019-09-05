import React, { useState, useEffect } from "react";

import "components/Application.scss";
import DayList from "components/DayList.js";
import Appointment from "components/Appointment/index.js";
import axios from "axios";
import {
  getAppointmentsForDay,
  getInterview,
  getInterviewersForDay
} from "../helpers/selectors";

// const days = [
//   {
//     id: 1,
//     name: "Monday",
//     spots: 2
//   },
//   {
//     id: 2,
//     name: "Tuesday",
//     spots: 5
//   },
//   {
//     id: 3,
//     name: "Wednesday",
//     spots: 0
//   }
// ];

// const appointments = [
//   {
//     id: 1,
//     time: "12pm"
//   },
//   {
//     id: 2,
//     time: "1pm",
//     interview: {
//       student: "Lydia Miller-Jones",
//       interviewer: {
//         id: 1,
//         name: "Sylvia Palmer",
//         avatar: "https://i.imgur.com/LpaY82x.png"
//       }
//     }
//   },
//   {
//     id: 3,
//     time: "2pm"
//   },
//   {
//     id: 4,
//     time: "3pm"
//     // interview: {
//     //   student: "Chen Liang",
//     //   interviewer: {
//     //     id: 1,
//     //     name: "Mr. Roberts",
//     //     avatar: "https://i.imgur.com/LpaY82x.png"
//     //   }
//     // }
//   },
//   {
//     id: "last",
//     time: "4pm"
//   }
// ];

export default function Application(props) {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {}
  });

  const setDay = day => setState(prev => ({ ...prev, day }));
  const setDays = days => setState(prev => ({ ...prev, days }));
  const setAppointments = appointments =>
    setState(prev => ({ ...prev, appointments }));
  const setInterviewers = interviewers =>
    setState(prev => ({ ...prev, interviewers }));

  const getDays = axios.get("api/days");
  const getAppointments = axios.get("/api/appointments");
  const getInterviewers = axios.get("/api/interviewers");

  useEffect(() => {
    Promise.all([getDays, getAppointments, getInterviewers])
      .then(res => {
        setDays(res[0].data);
        setAppointments(res[1].data);
        setInterviewers(res[2].data);

        console.log(res[0].data, res[1].data, res[2].data);
      })
      .catch(err => console.log(err));
  }, []);

  const appointmentList = getAppointmentsForDay(state, state.day).map(
    appointment => {
      const interview = getInterview(state, appointment.interview);
      const interviewer = getInterviewersForDay(state, appointment.interviewer);
      return (
        <Appointment
          key={appointment.id}
          id={appointment.id}
          time={appointment.time}
          interview={interview}
          interviewer={interviewer}
        />
      );
    }
  );

  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList
            days={state.days}
            day={state.day}
            setDay={day => setDay(day)}
          />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">{appointmentList}</section>
    </main>
  );
}
