import { Link } from "react-router-dom";
import { isOverdue } from "../domain/deadlines";
import type { Case } from "../domain/types";
import { es } from "../i18n/es";

interface CaseListProps {
  cases: Case[];
  today: string;
}

export function CaseList({ cases, today }: CaseListProps) {
  if (cases.length === 0) {
    return <p className="empty">{es.list.empty}</p>;
  }

  return (
    <table className="case-list">
      <thead>
        <tr>
          <th>{es.list.fileNumber}</th>
          <th>{es.list.caption}</th>
          <th>{es.list.court}</th>
          <th>{es.list.status}</th>
          <th>{es.list.deadline}</th>
        </tr>
      </thead>
      <tbody>
        {cases.map((item) => {
          const overdue = isOverdue(item.nextDeadline, today);
          return (
            <tr key={item.id}>
              <td>{item.fileNumber}</td>
              <td>
                <Link to={`/cases/${item.id}`}>{item.caption}</Link>
              </td>
              <td>{item.court}</td>
              <td>{es.status[item.status]}</td>
              <td className={overdue ? "overdue" : undefined}>
                {item.nextDeadline ?? es.list.noDeadline}
                {overdue ? ` (${es.list.overdue})` : ""}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
