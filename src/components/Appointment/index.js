import React from "react";
import useVisualMode from "hooks/useVisualMode";
import "./styles.scss";
import Header from "components/Appointment/Header";
import Error from "components/Appointment/Error";
import Empty from "components/Appointment/Empty";
import Show from "components/Appointment/Show";
import Form from "components/Appointment/Form";
import Status from "components/Appointment/Status";
import Confirm from "components/Appointment/Confirm";

export default function Appointment(props) {
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const DELETING = "DELETING";
  const CONFIRM = "CONFIRM";
  const EDIT = "EDIT";
  const ERROR_SAVE = "ERROR_SAVE";
  const ERROR_DELETE = "ERROR_DELETE";
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );
  //passing three parameters to save function
  const onAdd = () => transition(CREATE);
  function save(name, interviewer, isEdit) {
    const interview = {
      student: name,
      interviewer
    };

    transition(SAVING);
    props
      .bookInterview(props.id, interview, isEdit)
      .then(() => transition(SHOW))
      .catch((Error) => transition(ERROR_SAVE, true));
  }
  //Confirm function
  function CONFIRMIt() {
    transition(CONFIRM);
  }
  //Edit function
  function edit() {
    transition(EDIT);
  }
  //Cancel function and delete an appointent
  function cancel(id) {
    transition(DELETING, true);
    props
      .cancel(props.id)
      .then(() => transition(EMPTY))
      .catch((Error) => transition(ERROR_DELETE, true));
  }
  return (
    <article className="appointment" data-testid="appointment">
      <Header time={props.time} />
      {mode === EMPTY && <Empty onAdd={onAdd} />}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onDelete={CONFIRMIt}
          onEdit={edit}
        />
      )}

      {mode === SAVING && <Status message={"Saving"} />}
      {mode === DELETING && <Status message={"Deleting"} />}
      {mode === CONFIRM && (
        <Confirm
          message={"Please confirm the deletion?"}
          onCancel={back}
          onConfirm={cancel}
        />
      )}
      {mode === CREATE && (
        <Form interviewers={props.interviewers} onCancel={back} onSave={save} />
      )}

      {mode === EDIT && (
        <Form
          interviewers={props.interviewers}
          onCancel={back}
          onSave={(name, interviewer) => save(name, interviewer, true)}
        />
      )}
      {mode === ERROR_SAVE && (
        <Error message={"Could not save the appointment"} onClose={back} />
      )}
      {mode === ERROR_DELETE && (
        <Error message={"Could not delete the appointment"} onClose={back} />
      )}
    </article>
  );
}
