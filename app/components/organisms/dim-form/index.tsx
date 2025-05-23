"use client";
import { useState, ChangeEvent, FormEvent } from "react";
import style from "./style.module.css";
import Link from "next/link";

export default function DimensionForm({ onSubmit }: { onSubmit: () => void }) {
  const [formData, setFormData] = useState({
    latitude: "",
    longitude: "",
    consumo: "",
    perfil: "monofasico",
    inclinacao: "",
    orientacao: "",
    modelo: "",
    fileName: "",
    importFile: false,
    useDefaultData: true,
  });

  const [csvData, setCsvData] = useState<string[][]>([]);
  
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === "checkbox";

    setFormData((prevData) => ({
      ...prevData,
      [name]: isCheckbox ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleExclusiveCheck = (selected: "importFile" | "useDefaultData") => {
    setFormData((prevData) => ({
      ...prevData,
      importFile: selected === "importFile",
      useDefaultData: selected === "useDefaultData",
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
  
    setFormData((prev) => ({ ...prev, fileName: file.name }));
  
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const rows = text
        .trim()
        .split("\n")
        .map((line) => line.split(",").map((v) => v.trim()));
      setCsvData(rows);
  
      // Extrair cabeçalhos (primeira linha) e valores (segunda linha)
      const headers = rows[0];
      const values = rows.length > 1 ? rows[1] : [];
  
      // Criar objeto com os dados do CSV
      const csvDataObj: Record<string, string> = {};
      headers.forEach((header, index) => {
        if (values[index] !== undefined) {
          csvDataObj[header.toLowerCase()] = values[index];
        }
      });
  
      setFormData(prevData => {
        const updatedData = { ...prevData };
        
        // Mapear as propriedades do formData que existem no CSV
        Object.keys(prevData).forEach(key => {
          const csvKeyMatch = Object.keys(csvDataObj).find(
            csvKey => csvKey.toLowerCase() === key.toLowerCase()
          );
          
          if (csvKeyMatch && csvDataObj[csvKeyMatch] !== undefined) {
            // @ts-ignore - Ignora a verificação de tipo (sabendo que a chave existe)
            updatedData[key] = csvDataObj[csvKeyMatch];
          }
        });
  
        return updatedData;
      });
    };
    reader.readAsText(file);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (formData.useDefaultData) {
      localStorage.setItem("solarFormData", JSON.stringify(formData));
      localStorage.removeItem("solarCsvData");
    } else {
      localStorage.setItem("solarCsvData", JSON.stringify(csvData));
      localStorage.setItem("solarFormData", JSON.stringify(formData))
      // localStorage.removeItem("solarFormData");
    }
    onSubmit();
  };

return (
    <form onSubmit={handleSubmit} className={style.form_container}>
      <div className={style.sub_container}>
        {/* Seção de Preenchimento Manual */}
        <div>
          <div className={style.form_group}>
            <label className={style.label}>
              <input
                className={style.input_box}
                type="checkbox"
                checked={formData.useDefaultData}
                onChange={() => handleExclusiveCheck("useDefaultData")}
              />
              Preencher dados manualmente
            </label>
          </div>

          <fieldset className={style.form_section} disabled={!formData.useDefaultData}>
            <legend className={style.legend}>Dados da residência</legend>
            
            <div className={style.row_inputs}>
              <input
                className={style.input}
                type="text"
                name="latitude"
                placeholder="Latitude"
                value={formData.latitude}
                onChange={handleChange}
              />
              <input
                className={style.input}
                type="text"
                name="longitude"
                placeholder="Longitude"
                value={formData.longitude}
                onChange={handleChange}
              />
            </div>
            
            <input
              className={style.input}
              type="number"
              name="consumo"
              placeholder="Consumo mensal (kWh)"
              value={formData.consumo}
              onChange={handleChange}
            />
            <select
              className={style.select}
              name="perfil"
              value={formData.perfil}
              onChange={handleChange}
            >
              <option value="monofasico">Monofásico</option>
              <option value="bifasico">Bifásico</option>
              <option value="trifasico">Trifásico</option>
            </select>
          </fieldset>

          <fieldset className={style.form_section} disabled={!formData.useDefaultData}>
            <legend className={style.legend}>Dados dos painéis</legend>

            <input
              className={style.input}
              type="number"
              name="inclinacao"
              placeholder="Inclinação (graus)"
              value={formData.inclinacao}
              onChange={handleChange}
            />
            <input
              className={style.input}
              type="text"
              name="orientacao"
              placeholder="Orientação (ex: Norte)"
              value={formData.orientacao}
              onChange={handleChange}
            />
            <input
              className={style.input}
              type="text"
              name="modelo"
              placeholder="Modelo do painel"
              value={formData.modelo}
              onChange={handleChange}
            />
          </fieldset>
        </div>

        <div className={style.vertical_line}></div>

        {/* Seção de Importação de Arquivo */}
        <div>
          <div className={style.form_group}>
            <label className={style.label}>
              <input
                className={style.input_box}
                type="checkbox"
                checked={formData.importFile}
                onChange={() => handleExclusiveCheck("importFile")}
              />
              Importar arquivo CSV
            </label>
          </div>

          <input
            className={style.input_file}
            type="file"
            name="fileName"
            disabled={!formData.importFile}
            onChange={handleFileChange}
            accept=".csv"
          />

          {formData.importFile && (          
            <div className={style.file_info}>
              <p className={style.attention}>
                Atenção! O arquivo CSV deve seguir o formato especificado 
                <Link href="/formato-csv" className={style.download}> aqui</Link>.
              </p>
              
              <Link className={style.download} href="/form.csv" download>
                <span>Baixar modelo de formulário</span>
              </Link>
            </div>
          )}  
        </div>
      </div>

      <button type="submit" className={style.submit_button}>
        Calcular Dimensionamento
      </button>
    </form>
  );
}
