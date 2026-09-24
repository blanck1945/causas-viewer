import { useState, type FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import { isOverdue } from "../domain/deadlines";
import { useCases } from "../hooks/useCases";
import { es } from "../i18n/es";
import { EntryTimeline } from "./EntryTimeline";

export function CaseDetail() {
  const { id = "" } = useParams();
  const { allCases, clients, today, getEntries, addEntry } = useCases();
  const [date, setDate] = useState(today);
  const [description, setDescription] = useState("");
  const [showError, setShowError] = useState(false);

  const item = allCases.find((candidate) => candidate.id === id);
  if (!item) {
    return (
      <section>
        <p role="alert">{es.detail.notFound}</p>
        <Link to="/">{es.detail.back}</Link>
      </section>
    );
  }

  const client = clients.find((candidate) => candidate.id === item.clientId);
  const overdue = isOverdue(item.nextDeadline, today);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!date || description.trim() === "") {
      setShowError(true);
      return;
    }
    addEntry(id, date, description.trim());
    setDescription("");
    setShowError(false);
  }

  return (
    <article className="case-detail">
      <Link to="/">{es.detail.back}</Link>
      <h1>{item.caption}</h1>
      <p>{item.fileNumber}</p>
      <dl>
        <dt>{es.detail.court}</dt>
        <dd>{item.court}</dd>
        <dt>{es.detail.status}</dt>
        <dd>{es.status[item.status]}</dd>
        <dt>{es.detail.createdAt}</dt>
        <dd>{item.createdAt}</dd>
        <dt>{es.detail.nextDeadline}</dt>
        <dd className={overdue ? "overdue" : undefined}>
          {item.nextDeadline ?? es.list.noDeadline}
        </dd>
      </dl>
      <h2>{es.detail.client}</h2>
      {client ? (
        <dl>
          <dt>{es.detail.client}</dt>
          <dd>{client.name}</dd>
          <dt>{es.detail.phone}</dt>
          <dd>{client.phone}</dd>
          <dt>{es.detail.email}</dt>
          <dd>{client.email}</dd>
        </dl>
      ) : (
        <p>{es.detail.unknownClient}</p>
      )}
      <Link to={`/cases/${id}/workspace`}>{es.detail.workspaceLink}</Link>
      <EntryTimeline entries={getEntries(id)} />
      <form className="entry-form" onSubmit={handleSubmit}>
        <h2>{es.entryForm.title}</h2>
        <label>
          {es.entryForm.date}
          <input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
        </label>
        <label>
          {es.entryForm.description}
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </label>
        {showError && <p role="alert">{es.entryForm.required}</p>}
        <button type="submit">{es.entryForm.submit}</button>
      </form>
    </article>
  );
}
