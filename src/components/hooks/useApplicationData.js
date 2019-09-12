import { useEffect, useReducer } from "react";
import axios from "axios";
import {
  getDayFromAppointmentId
} from "../../helpers/selectors";
require("dotenv").config();

export const SET_DAY = "SET_DAY";
export const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
export const SET_INTERVIEW = "SET_INTERVIEW";

const ws = new WebSocket("ws://localhost:3001");

const updateSpots = function(state, decrease) {
  return state.days.map(day => {
    if (day.name !== state.day) {
      return day;
    }

    return {
      ...day,
      spots: decrease ? day.spots-- : day.spots++
    };
  });
};

export default function reducer(state, action) {
  switch (action.type) {
    case SET_DAY: {
      return { ...state, day: action.day };
    }
    case SET_APPLICATION_DATA: {
      return {
        ...state,
        days: action.days,
        appointments: action.appointments,
        interviewers: action.interviewers
      };
    }
    case SET_INTERVIEW: {
      const appointment = {
        ...state.appointments[action.id],
        interview: action.interview ? { ...action.interview } : null
      };

      const appointments = {
        ...state.appointments,
        [action.id]: appointment
      };

      let days = state.days;

      if (action.interview && !state.appointments[action.id].interview) {
        days = updateSpots(state, true);
      } else if (!action.interview && state.appointments[action.id].interview) {
        days = updateSpots(state, false);
      }

      return { ...state, ...days, appointments };
    }
    default:
      throw new Error(
        `Tried to reduce with unsupported action type: ${action.type}`
      );
  }
}

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

  ws.onmessage = function(event) {
    const { type, id, interview } = JSON.parse(event.data);
    const day = getDayFromAppointmentId(state, id);
    dispatch({ type, id, interview, day: day });
  };

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
