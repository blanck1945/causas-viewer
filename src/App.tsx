import { Route, Routes } from "react-router-dom";
import { CaseDetail } from "./components/CaseDetail";
import { CaseFilters } from "./components/CaseFilters";
import { CaseList } from "./components/CaseList";
import { CaseSort } from "./components/CaseSort";
import { useCases } from "./hooks/useCases";
import { es } from "./i18n/es";

export function App() {
  const { cases, filters, setFilters, sortBy, setSortBy, overdueCount, today } = useCases();

  return (
    <main className="app">
      <header>
        <h1>{es.appTitle}</h1>
        <p>{es.appSubtitle}</p>
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
              <CaseSort value={sortBy} onChange={setSortBy} />
              <CaseList cases={cases} today={today} />
            </>
          }
        />
        <Route path="/cases/:id" element={<CaseDetail />} />
      </Routes>
    </main>
  );
}
