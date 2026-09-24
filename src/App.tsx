import { Route, Routes } from "react-router-dom";
import { CaseDetail } from "./components/CaseDetail";
import { CaseFilters } from "./components/CaseFilters";
import { CaseList } from "./components/CaseList";
import { ReminderList } from "./components/ReminderList";
import { useCases } from "./hooks/useCases";
import { useReminders } from "./hooks/useReminders";
import { es } from "./i18n/es";

export function App() {
  const { cases, filters, setFilters, overdueCount, today } = useCases();
  const { reminders } = useReminders();

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
              <ReminderList reminders={reminders} />
              <CaseFilters filters={filters} onChange={setFilters} />
              <CaseList cases={cases} today={today} />
            </>
          }
        />
        <Route path="/cases/:id" element={<CaseDetail />} />
      </Routes>
    </main>
  );
}
