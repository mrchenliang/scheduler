import { useState, useEffect, useReducer } from "react";
import axios from "axios";

// websockets
const ws = new WebSocket("ws://localhost:8001");

const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";

const reducer = (state, action) => {
  const { day, days, appointments, interviewers, id, interview } = action;
  switch (action.type) {
    case SET_DAY:
      return { ...state, day };

    case SET_APPLICATION_DATA:
      return {
        ...state,
        days,
        appointments,
        interviewers
      };

    case SET_INTERVIEW: {
      const appointment = {
        ...state.appointments[id],
        interview: { ...interview }
      };
      const appointments = {
        ...state.appointments,
        [id]: appointment
      };
      return {
        ...state,
        appointments: { ...appointments }
      };
    }

    default:
      throw new Error(
        `Tried to reduce with unsupported action type: ${action.type}`
      );
  }
};

export const useApplicationData = () => {
  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {}
  });

  const setDay = day => dispatch({ type: SET_DAY, day });

  const getDays = axios.get("/api/days");
  const getAppointments = axios.get("/api/appointments");
  const getInterviewers = axios.get("/api/interviewers");

  useEffect(() => {
    Promise.all([getDays, getAppointments, getInterviewers])
      .then(res => {
        dispatch({
          type: SET_APPLICATION_DATA,
          ...state,
          days: res[0].data,
          appointments: res[1].data,
          interviewers: res[2].data
        });
      })
      .catch(err => console.log(err));
  }, []);

  const bookInterview = (id, interview) => {
    return axios.put(`api/appointments/${id}`, { interview }).then(() => {
      dispatch({ type: SET_INTERVIEW, id, interview });
    });
  };

  const deleteInterview = id => {
    return axios.delete(`/api/appointments/${id}`).then(() => {
      dispatch({ type: SET_INTERVIEW, id })
    });
  };

  return {
    state,
    setDay,
    bookInterview,
    deleteInterview
  };
};
