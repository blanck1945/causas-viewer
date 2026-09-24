import { useClients } from "../hooks/useClients";
import { es } from "../i18n/es";

export function ClientList() {
  const { clients } = useClients();

  return (
    <section>
      <h2>{es.clients.title}</h2>
      {clients.length === 0 ? (
        <p className="empty">{es.clients.empty}</p>
      ) : (
        <table className="client-list">
          <thead>
            <tr>
              <th>{es.clients.name}</th>
              <th>{es.clients.phone}</th>
              <th>{es.clients.email}</th>
              <th>{es.clients.caseCount}</th>
            </tr>
          </thead>
          <tbody>
            {clients.map(({ client, caseCount }) => (
              <tr key={client.id}>
                <td>{client.name}</td>
                <td>{client.phone}</td>
                <td>{client.email}</td>
                <td>{caseCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
