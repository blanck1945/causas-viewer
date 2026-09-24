import { useState, type FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import { useCases } from "../hooks/useCases";
import { useChecklist } from "../hooks/useChecklist";
import { useNotes } from "../hooks/useNotes";
import { es } from "../i18n/es";
import { ChecklistItemRow } from "./ChecklistItemRow";
import { ChecklistProgress } from "./ChecklistProgress";
import { NoteList } from "./NoteList";

export function CaseWorkspace() {
  const { id = "" } = useParams();
  const { allCases } = useCases();
  const { notes, addNote } = useNotes(id);
  const { items, doneCount, addItem, toggleItem } = useChecklist(id);

  const [noteText, setNoteText] = useState("");
  const [noteError, setNoteError] = useState(false);
  const [noteQuery, setNoteQuery] = useState("");
  const [itemLabel, setItemLabel] = useState("");
  const [itemError, setItemError] = useState(false);
  const [hideDone, setHideDone] = useState(false);

  const item = allCases.find((candidate) => candidate.id === id);
  if (!item) {
    return (
      <section>
        <p role="alert">{es.detail.notFound}</p>
        <Link to="/">{es.detail.back}</Link>
      </section>
    );
  }

  const query = noteQuery.trim().toLowerCase();
  const visibleNotes =
    query === "" ? notes : notes.filter((note) => note.text.toLowerCase().includes(query));
  const visibleItems = hideDone ? items.filter((entry) => !entry.done) : items;
  const suggestions = es.workspace.checklist.suggestions.filter(
    (label) => !items.some((entry) => entry.label === label),
  );

  function handleNoteSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (noteText.trim() === "") {
      setNoteError(true);
      return;
    }
    addNote(noteText.trim());
    setNoteText("");
    setNoteError(false);
  }

  function handleItemSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (itemLabel.trim() === "") {
      setItemError(true);
      return;
    }
    addItem(itemLabel.trim());
    setItemLabel("");
    setItemError(false);
  }

  return (
    <article className="workspace">
      <Link to={`/cases/${id}`}>{es.detail.back}</Link>
      <h2>{es.workspace.title}</h2>
      <p>{item.caption}</p>

      <section>
        <h3>{es.workspace.notes.title}</h3>
        {notes.length > 0 && (
          <label>
            {es.workspace.notes.search}
            <input
              type="search"
              value={noteQuery}
              onChange={(event) => setNoteQuery(event.target.value)}
            />
          </label>
        )}
        {query !== "" && (
          <button type="button" onClick={() => setNoteQuery("")}>
            {es.workspace.notes.clearSearch}
          </button>
        )}
        {notes.length > 0 && (
          <p>
            {es.workspace.notes.total}: {visibleNotes.length}/{notes.length}
          </p>
        )}
        {notes.length === 0 && <p className="empty">{es.workspace.notes.empty}</p>}
        {notes.length > 0 && visibleNotes.length === 0 && (
          <p className="empty">{es.workspace.notes.noMatches}</p>
        )}
        <NoteList notes={visibleNotes} />
        <form className="entry-form" onSubmit={handleNoteSubmit}>
          <label>
            {es.workspace.notes.placeholder}
            <textarea
              value={noteText}
              onChange={(event) => setNoteText(event.target.value)}
            />
          </label>
          {noteError && <p role="alert">{es.workspace.notes.required}</p>}
          <button type="submit">{es.workspace.notes.add}</button>
        </form>
      </section>

      <section>
        <h3>{es.workspace.checklist.title}</h3>
        <ChecklistProgress done={doneCount} total={items.length} />
        {items.length > 0 && doneCount === items.length && (
          <p>{es.workspace.checklist.allDone}</p>
        )}
        {items.length === 0 && <p className="empty">{es.workspace.checklist.empty}</p>}
        {items.length > 0 && (
          <label>
            <input
              type="checkbox"
              checked={hideDone}
              onChange={(event) => setHideDone(event.target.checked)}
            />
            {es.workspace.checklist.hideDone}
          </label>
        )}
        <ul>
          {visibleItems.map((entry) => (
            <ChecklistItemRow key={entry.id} item={entry} onToggle={toggleItem} />
          ))}
        </ul>
        {suggestions.length > 0 && (
          <p>
            {suggestions.map((label) => (
              <button key={label} type="button" onClick={() => addItem(label)}>
                {label}
              </button>
            ))}
          </p>
        )}
        <form className="entry-form" onSubmit={handleItemSubmit}>
          <label>
            {es.workspace.checklist.newItem}
            <input
              type="text"
              value={itemLabel}
              onChange={(event) => setItemLabel(event.target.value)}
            />
          </label>
          {itemError && <p role="alert">{es.workspace.checklist.required}</p>}
          <button type="submit">{es.workspace.checklist.add}</button>
        </form>
      </section>
    </article>
  );
}
