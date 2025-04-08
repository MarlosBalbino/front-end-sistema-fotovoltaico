"use client";
import { useEffect, useState } from "react";
import styles from "./style.module.css";

export default function Results({ update }: { update: boolean }) {
  const [formData, setFormData] = useState<any>(null);
  const [csvData, setCsvData] = useState<string[][]>([]);

  useEffect(() => {
    const form = localStorage.getItem("solarFormData");
    const csv = localStorage.getItem("solarCsvData");

    if (csv) {  
      setCsvData(JSON.parse(csv));
      setFormData(null);
    } else if (form) {      
      setFormData(JSON.parse(form));
      setCsvData([]);
    }
  
  }, [update]);  

  if (csvData.length > 0) {
    const headers = csvData[0] || [];   
    const dataRows = csvData.slice(1);
  
    return (
      <div className={styles.mainContainer}>
        <label className={styles.label}>Dados importados:</label>
        <div className={styles.resultsContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                {headers.map((header, hIdx) => (
                  <th key={hIdx} className={styles.tableCell}>
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dataRows.map((row, idx) => (
                <tr key={idx}>
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className={styles.tableCell}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
  
  if (formData) {
    // const formEntries = Object.entries(formData);
    const headers = Object.keys(formData);    
    const valuesRow = Object.values(formData).map(value => String(value));
  
    return (
      <div className={styles.mainContainer}>
        <label className={styles.label}>Dados do formulário:</label>
        <div className={styles.resultsContainer}>   
          <table className={styles.table}>
            <thead>
              <tr>
                {headers.map((header, index) => (
                  <th key={index} className={styles.tableCell}>
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {valuesRow.map((value, index) => (
                  <td key={index} className={styles.tableCell}>
                    {value}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return <div className={styles.resultsContainer}>Nenhum dado disponível.</div>;
}
