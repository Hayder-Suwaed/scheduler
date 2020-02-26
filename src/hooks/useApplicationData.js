//Creating Reducers.
import React, { useState, useEffect, useReducer } from "react";
import axios from "axios";

export default function useApplicationData() {
  const SET_DAY = "SET_DAY";
  const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
  const SET_INTERVIEW = "SET_INTERVIEW";
  const SET_SPOTSREMAINING = "SET_SPOTSREMAINING";

  function reducer(state, action) {
    switch (action.type) {
      case SET_DAY:
        return { ...state, day: action.day };
      case SET_APPLICATION_DATA:
        return {
          ...state,
          days: action.days,
          appointments: action.appointments,
          interviewers: action.interviewers
        };
      case SET_INTERVIEW: {
        return { ...state, appointments: action.appointments, spots: 5 };
      }
      case SET_SPOTSREMAINING: {
        return { ...state, days: action.stateDays };
      }
      default:
        throw new Error(
          `Tried to reduce with unsupported action type: ${action.type}`
        );
    }
  }

  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    spots: 0,
    appointments: {},
    interviews: {}
  });

  const dayByAppId = (id) => {
    let dayByAppointmenID = {};
    state.days.forEach((item) => {
      item.appointments.forEach((appointmentID) => {
        if (id === appointmentID) {
          dayByAppointmenID = { ...item };
        }
      });
    });
    return dayByAppointmenID;
  };

  const setDay = (day) => dispatch({ type: SET_DAY, day });
  //Booking interview and spots remaining functions
  function bookInterview(id, interview, isEdit) {
    const daySpot = dayByAppId(id);
    const spotIncrease = (daySpot) => {
      const output = state.days.map((item, index) => {
        if (index !== daySpot.id - 1) {
          return item;
        }
        return {
          ...daySpot,
          spots: item.spots - 1
        };
      });
      return output;
    };
    let stateDays = state.days;
    if (!isEdit) {
      stateDays = spotIncrease(daySpot);
    }

    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
console.log(id, interview)
    return axios
      .put(`api/appointments/${id}`, { interview: { ...interview } })
      .then((data) => {
        return axios.get("api/days").then((res) => {
          console.log(res);
          return (
            dispatch({ type: SET_INTERVIEW, appointments }),
            dispatch({ type: SET_SPOTSREMAINING, stateDays })
          );
        });
      });
  }
  //Updating the number of Spots remaining.
  function cancel(id, interview) {
    const daySpot = dayByAppId(id);

    const spotIncrease = (daySpot) => {
      const output = state.days.map((item, index) => {
        if (index !== daySpot.id - 1) {
          return item;
        }
        return {
          ...daySpot,
          spots: ++item.spots
        };
      });
      return output;
    };
    const stateDays = spotIncrease(daySpot);
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    return axios
      .delete(`api/appointments/${id}`)
      .then(
        (res) => dispatch({ type: SET_INTERVIEW, appointments }),
        dispatch({ type: SET_SPOTSREMAINING, stateDays })
      );
  }
  // Use Promise.all to make both requests(for the days and the appointments data) before updating the state
  useEffect(() => {
    Promise.all([
      Promise.resolve(axios.get(`/api/days`)),
      Promise.resolve(axios.get(`/api/appointments`)),
      Promise.resolve(axios.get(`/api/interviewers`))
    ])
      .then((res) => {
        dispatch({
          type: SET_APPLICATION_DATA,
          days: res[0].data,
          appointments: res[1].data,
          interviewers: res[2].data
        });
      })
      .catch((error) => console.log(error));
    return () => {};
  }, []);

  return {
    state,
    setDay,
    bookInterview,
    cancel
  };
}
