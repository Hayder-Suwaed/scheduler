import "components/Application.scss";
import React, { useEffect, useState } from "react";
import Appointment from "components/Appointment";
import DayList from "./DayList";
import {
  getAppointmentsForDay,
  getInterview,
  getInterviewersForDay
} from "../helpers/selectors";
import axios from "axios";

//--------------------------------

export default function Application(props) {
  let [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  //-------------
  useEffect(() => {
    axios
      .all([
        axios.get("http://localhost:4000/api/days"),
        axios.get("http://localhost:4000/api/appointments"),
        axios.get("http://localhost:4000/api/interviewers")
      ])
      .then((all) => {
        setState((prev) => ({
          ...prev,
          days: all[0].data,
          appointments: all[1].data,
          interviewers: all[2].data
        }));
      });
  }, []);
  const interviewers = getInterviewersForDay(state, state.day);

  console.log("STATE IS", state);
  const appointments = getAppointmentsForDay(state, state.day);


  const setDay = (day) => setState((prev) => ({ ...prev, day }));
  function bookInterview(id, interview) {
    return axios
      .put(`http://localhost:4000/api/appointments/${id}`, { interview })
      .then((resp) => {
        const intvw = { ...interview };

        const appointment = {
          ...state.appointments[id],
          interview: { ...intvw }
        };

        const appointments = {
          ...state.appointments,
          [id]: appointment
        };

        setState({
          ...state,
          appointments
        });
      });
  }

  function cancel(id) {
    return axios.delete(`/api/appointments/${id}`).then((resp) => {
      const interview = {
        ...state.appointments[id],
        interview: null
      };
      console.log(interview);
      const appointments = {
        ...state.appointments,
        [id]: interview
      };

      setState({
        ...state,
        appointments
      });
    });
  }

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
        {appointments.map((e) => {
          const interview = getInterview(state, e.interview);
          return (
            <Appointment
              key={e.id}
              id={e.id}
              time={e.time}
              interview={interview}
              interviewers={interviewers}
              bookInterview={bookInterview}
              cancel={cancel}
            />
          );
        })}
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}
