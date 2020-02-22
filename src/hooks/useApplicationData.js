//Creating Reducers.
import { useEffect, useReducer } from "react";
import axios from "axios";
const webSocket = new WebSocket("ws://localhost:4000");

const dayByAppId = (id, days) => {
  let dayByAppointmenID = {};
  days.forEach((item) => {
    item.appointments.forEach((appointmentID) => {
      if (id === appointmentID) {
        dayByAppointmenID = { ...item };
      }
    });
  });
  return dayByAppointmenID;
};

const spotIncrease = ({ id, interview }, { appointments, days }) => {
  let inc;
  if (!interview) {
    inc = 1;
  } else if (appointments[id].interview) {
    inc = 0;
  } else {
    inc = -1;
  }
  const daySpot = dayByAppId(id, days);
  const output = days.map((item, index) => {
    if (index !== daySpot.id - 1) {
      return item;
    }
    return {
      ...daySpot,
      spots: item.spots + inc
    };
  });
  return output;
};

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
      return {
        ...state,
        appointments: {
          ...state.appointments,
          [action.id]: {
            ...state.appointments[action.id],
            interview: action.interview
          }
        },

        days: spotIncrease(action, state),
        spots: 5
      };
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

export default function useApplicationData() {
  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    spots: 0,
    appointments: {},
    interviews: {}
  });

  const setDay = (day) => dispatch({ type: SET_DAY, day });
  //Booking interview and spots remaining functions
  function bookInterview(id, interview, isEdit) {
    return axios
      .put(`api/appointments/${id}`, { interview: { ...interview } })
      .then((data) => {});
  }
  //Updating the number of Spots remaining.
  function cancel(id, interview) {
    return axios.delete(`api/appointments/${id}`).then();
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

  useEffect(() => {
    // webSocket.onopen = function(event) {
    //   webSocket.send("ping");
    // };

    webSocket.onmessage = function(event) {
      const message = JSON.parse(event.data);

      if (message.type === "SET_INTERVIEW") {
        console.log("tedt");

        const inc = message.interview ? 0 : 1;

        dispatch({ type: SET_INTERVIEW, ...message, inc });
      }
    };

    return () => {
      webSocket.close();
    };
  }, []);

  return {
    state,
    setDay,
    bookInterview,
    cancel
  };
}
