import React, { useState, useEffect } from "react";
import DayList from "components/DayList";
import "components/Application.scss";
import Appointment from "./Appointment";

import axios from "axios";

const appointments = [
  {
    id: 1,
    time: "12pm"
  },
  {
    id: 2,
    time: "1pm",
    interview: {
      student: "Lydia Miller-Jones",
      interviewer: {
        id: 1,
        name: "Sylvia Palmer",
        avatar: "https://i.imgur.com/LpaY82x.png"
      }
    }
  },
  {
    id: 3,
    time: "2pm"
  },
  {
    id: 4,
    time: "2:30pm",
    interview: {
      student: "James Truong",
      interviewer: {
        id: 5,
        name: "Sven Jones",
        avatar: "https://i.imgur.com/twYrpay.jpg"
      }
    }
  },
  {
    id: 5,
    time: "4pm"
  }
];

export default function Application(props) {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {}
  });

  const setDay = (day) => setState((prev) => ({ ...prev, day }));
  const setDays = (days) => setState((prev) => ({ ...prev, days }));

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/days")
      .then((resp) => setDays(resp.data))
      .catch((error) => {});
  }, []);
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
          <DayList days={state.days} day={state.day} setDay={setDay} />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {appointments.map((appointment) => (
          <Appointment
            key={appointment.id}
            id={appointment.id}
            time={appointment.time}
            interview={appointment.interview}
          />
        ))}
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}
