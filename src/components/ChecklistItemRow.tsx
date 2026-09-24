import type { ChecklistItem } from "../domain/types";

interface ChecklistItemRowProps {
  item: ChecklistItem;
  onToggle: (id: string) => void;
}

export function ChecklistItemRow({ item, onToggle }: ChecklistItemRowProps) {
  return (
    <li className={item.done ? "checklist-item done" : "checklist-item"}>
      <label>
        <input type="checkbox" checked={item.done} onChange={() => onToggle(item.id)} />
        <span>{item.label}</span>
      </label>
    </li>
  );
}
