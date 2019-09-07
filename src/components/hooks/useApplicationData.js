import { useEffect, useReducer } from "react";
import axios from "axios";
import { getSpotsForDay } from "../../helpers/selectors";
require("dotenv").config();

export const SET_DAY = "SET_DAY";
export const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
export const SET_INTERVIEW = "SET_INTERVIEW";

// websockets
const ws = new WebSocket("ws://localhost:3001");

export const reducer = (state, action) => {
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
      const dayObj = state.days.find(eachDay => eachDay.name === day);
      const dayIndex = dayObj.id - 1;
      const appointment = {
        ...state.appointments[id],
        interview: interview
      };
      const appointments = {
        ...state.appointments,
        [id]: appointment
      };
      dayObj.spots = getSpotsForDay(state, appointments, day);
      const days = state.days;
      days[dayIndex] = dayObj;
      return {
        ...state,
        appointments: { ...appointments },
        days
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

  useEffect(() => {
    const getDays = axios.get("/api/days");
    const getAppointments = axios.get("/api/appointments");
    const getInterviewers = axios.get("/api/interviewers");
    Promise.all([getDays, getAppointments, getInterviewers])
      .then(res => {
        dispatch({
          type: SET_APPLICATION_DATA,
          days: res[0].data,
          appointments: res[1].data,
          interviewers: res[2].data
        });
      })
      .catch(err => console.log(err));
  }, []);
  
  const webSocket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);

  webSocket.onopen = function (event) {
    console.log("Began listening for updates from the scheduler-api server.")
  };

  webSocket.onmessage = function (event) {
    event = JSON.parse(event.data);

    if (event.type === SET_INTERVIEW) {
      dispatch({ ...event });
    } else {
      console.log("Event details came from the server but were never handled:", event);
    }
  }

  const bookInterview = (id, interview, day) => {
    return axios.put(`/api/appointments/${id}`, { interview }).then(() => {
      dispatch({ type: SET_INTERVIEW, id, interview, day });
    });
  };

  const cancelInterview = (id, day) => {
    return axios.delete(`/api/appointments/${id}`).then(() => {
      dispatch({ type: SET_INTERVIEW, id, interview: null, day });
    });
  };

  return {
    state,
    setDay,
    bookInterview,
    cancelInterview
  };
};
