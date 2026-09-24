import { createLocalRepository } from "../data/repository";
import { casesToCsv } from "../domain/csv";
import { es } from "../i18n/es";

const FILE_NAME = "causas.csv";

export function CaseExportButton() {
  function handleClick() {
    const cases = createLocalRepository().listCases();
    const csv = casesToCsv(cases, es.csv.headers);
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = FILE_NAME;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <button type="button" className="export-button" onClick={handleClick}>
      {es.csv.button}
    </button>
  );
}
