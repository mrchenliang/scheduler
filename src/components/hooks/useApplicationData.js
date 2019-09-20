import { useEffect, useReducer } from "react";
import reducer, {
  SET_DAY,
  SET_APPLICATION_DATA,
  SET_INTERVIEW
} from "reducers/application";
import axios from "axios";
import {
  getDayFromAppointmentId
} from "../../helpers/selectors";
require("dotenv").config();

const ws = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);

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
