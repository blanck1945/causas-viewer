import { Link, Route, Routes } from "react-router-dom";
import { CaseDetail } from "./components/CaseDetail";
import { CaseFilters } from "./components/CaseFilters";
import { CaseList } from "./components/CaseList";
import { ClientList } from "./components/ClientList";
import { useCases } from "./hooks/useCases";
import { es } from "./i18n/es";

export function App() {
  const { cases, filters, setFilters, overdueCount, today } = useCases();

  return (
    <main className="app">
      <header>
        <h1>{es.appTitle}</h1>
        <p>{es.appSubtitle}</p>
        <nav className="nav">
          <Link to="/">{es.nav.cases}</Link>
          <Link to="/clients">{es.nav.clients}</Link>
        </nav>
      </header>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <p className="overdue-summary">
                {es.overdueCount}: {overdueCount}
              </p>
              <CaseFilters filters={filters} onChange={setFilters} />
              <CaseList cases={cases} today={today} />
            </>
          }
        />
        <Route path="/cases/:id" element={<CaseDetail />} />
        <Route path="/clients" element={<ClientList />} />
      </Routes>
    </main>
  );
}
