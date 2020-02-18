import React, { useState, useEffect } from "react";
import DayList from "components/DayList";
import "components/Application.scss";
import Appointment from "./Appointment";
import getAppointmentsForDay from "../helpers/selectors";
import axios from "axios";


export default function Application(props) {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {}
  });
 
  const appointments = getAppointmentsForDay(state, state.day);
  const setDay = (day) => setState((prev) => ({ ...prev, day }));
  useEffect(() => {
    axios.all([
      axios.get("http://localhost:4000/api/days"),
      axios.get("http://localhost:4000/api/appointments")
    ])
      .then((all) => {
        setState(prev => ({
          ...prev,
          days: all[0].data,
          appointments: all[1].data
        }))
      })
      .catch((error) => {
        
        // console.log(error.res.status);
        // console.log(error.res.headers);
        // console.log(error.res.data);
      });
  }, [])


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

