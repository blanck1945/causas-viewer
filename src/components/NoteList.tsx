import type { CaseNote } from "../domain/types";

interface NoteListProps {
  notes: CaseNote[];
}

function newestFirst(a: CaseNote, b: CaseNote): number {
  return b.createdAt.localeCompare(a.createdAt);
}

export function NoteList({ notes }: NoteListProps) {
  return (
    <ul className="note-list">
      {[...notes].sort(newestFirst).map((note) => (
        <li key={note.id}>
          <time className="note-date" dateTime={note.createdAt}>
            {note.createdAt.slice(0, 10)}
          </time>
          <span>{note.text}</span>
        </li>
      ))}
    </ul>
  );
}
