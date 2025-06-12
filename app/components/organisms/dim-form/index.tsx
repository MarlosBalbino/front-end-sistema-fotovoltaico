"use client";
import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import style from "./style.module.css";
import Link from "next/link";
import { FormData } from "@/app/types/FormData";

import { InfoTooltip } from "@molecules";

import { orientationMap } from "@/app/utils/orientationMap";

const inputLabels = {
  consumo: "Consumo mensal (kWh)",
  perfil: "Perfil de instalação",
  inclinacao: "Inclinação (graus)",
  orientacao: "Orientação",
  modelo: "Modelo do painel",
  isc: "Corrente de curto-circuito (Isc)",
  voc: "Tensão de circuito aberto (Voc)",
  imp: "Corrente no MPP (Imp)",
  vmp: "Tensão no MPP (Vmp)",
  ns: "N° de celulas em serie (Ns)",
  ki: "Coeficiente de temperatura de corrente (ki)",
  kv: "Coeficiente de temperatura de tensão (kv)",
  area: "Área do do painel (m²)",
  eficiencia: "Eficiencia",
  tarifa_de_energia: "Tarifa de energia (R$)",
  tarifa_da_bandeira: "Tarifa da bandeira (R$)",
  custo_por_painel: "Custo por painel (R$)",
  custo_por_inversor: "Custo por inversor (R$)",
  custo_mao_de_obra: "Custo da mão de obra (R$)",
  inflacao_de_energia: "Inflação de energia (%)",
  anos_de_analise: "Anos de análise",
  depreciacao_anual: "Depreciação anual (%)",
  taxa_do_fio_b: "Taxa do fio B (R$)",
  inflacao_anual: "Inflação anual (%)"
};

const paybackPlaceHolders = {
  tarifa_de_energia: "0.86293",
    tarifa_da_bandeira: "0",
    custo_por_painel: "1000",
    custo_por_inversor: "5000",
    custo_mao_de_obra: "5000",
    inflacao_de_energia: "5.3",
    anos_de_analise: "25",
    depreciacao_anual: "0.5",
    taxa_do_fio_b: "0.22",
    inflacao_anual: "5"
}

interface DimensionFormProps {
  onSubmit: (formData: any) => Promise<string>,
}

export default function DimensionForm({ onSubmit }: DimensionFormProps) {
  const [formData, setFormData] = useState<FormData>({
    consumo: "",
    perfil: "monofasico",
    inclinacao: "",
    orientacao: "",
    modelo: "",
    isc: "",
    voc: "",
    imp: "",
    vmp: "",
    ns: "",
    ki: "",
    kv: "",
    area: "",
    eficiencia: "",
    fileName: "",
    importFile: false,
    useDefaultData: true,
    
    // Dados do Payback
    tarifa_de_energia: "",
    tarifa_da_bandeira: "",
    custo_por_painel: "",
    custo_por_inversor: "",
    custo_mao_de_obra: "",
    inflacao_de_energia: "",
    anos_de_analise: "",
    depreciacao_anual: "",
    taxa_do_fio_b: "",
    inflacao_anual: ""
  });

  const [csvData, setCsvData] = useState<string[][]>([]);
  const [importFile, setImportFile] = useState(false)

  const requiredFields: string[] = [
    'consumo', 'perfil', 'inclinacao', 'orientacao', 'isc', 'voc', 'imp', 'vmp', 'ns',
    'ki', 'kv', 'tarifa_de_energia', 'custo_por_painel', 'custo_por_inversor', 'custo_mao_de_obra',
    'anos_de_analise'
  ];

  const [inputErrors, setInputErrors] = useState<Record<string, boolean>>({});
  const [errorMsg, setErrorMsg] = useState('');
  // const [loading, setLoading] = useState(false);
  
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


  const [loading, setLoading] = useState(false)


  const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();
  
  setLoading(true);
  setErrorMsg('');

  // Permite que o estado `loading` seja refletido antes de continuar
  await new Promise(resolve => setTimeout(resolve, 0)); 

  const errors: Record<string, boolean> = {};
  for (const field of requiredFields) {
    const value = field in formData ? formData[field as keyof FormData] : null;
    if (!value || String(value).trim() === "") {
      errors[field] = true;
    }
  }


  if (Object.keys(errors).length > 0) {
    setInputErrors(errors);
    setErrorMsg("Campo obrigatório não preenchido");
    setLoading(false);
    return;
  }

  setInputErrors({});

  const response = await onSubmit(formData); 

  if (response === 'ok') {
    setLoading(false);
  }
};


  return (
    <form onSubmit={handleSubmit} className={style.form_container}>
      <div className={style.sub_container}>
        <div>   
          <fieldset className={style.form_section}>          
            <legend className={style.legend}>Dados da residência</legend>
            
            <div className={style.parameter_card}>
              <label htmlFor="consumo">{inputLabels.consumo}</label>
              <input
                id="consumo"
                className={`${style.input} ${inputErrors["consumo"] ? style.input_error : ''}`}
                type="number"
                name="consumo"
                value={formData.consumo}
                onChange={handleChange}
                placeholder="Ex: 300"
              />
            </div>
            
            <div className={style.parameter_card}>
              <label htmlFor="perfil">{inputLabels.perfil}</label>
              <select
                id="perfil"
                className={`${style.select} ${inputErrors[""] ? style.input_error : ''}`}
                name="perfil"
                value={formData.perfil}
                onChange={handleChange}
              >
                <option value="monofasico">Monofásico</option>
                <option value="bifasico">Bifásico</option>
                <option value="trifasico">Trifásico</option>
              </select>
            </div>
          </fieldset>

          <fieldset className={style.form_section}>
            <legend className={style.legend}>Dados dos painéis</legend>

            <div className={style.parameter_card}>
              <label htmlFor="inclinacao">{inputLabels.inclinacao}</label>
              <input
                id="inclinacao"
                className={`${style.input} ${inputErrors["inclinacao"] ? style.input_error : ''}`}
                type="number"
                name="inclinacao"
                value={formData.inclinacao}
                onChange={handleChange}
                placeholder="Ex: 15"
              />
            </div>

            <div className={style.parameter_card}>
              <label htmlFor="orientacao">{inputLabels.orientacao}</label>              
              <select 
                className={`${style.select} ${inputErrors["orientacao"] ? style.input_error : ''}`}
                name="orientacao" 
                id="orientacao" 
                value={formData.orientacao}
                onChange={handleChange}
              >
                <option value="">Selecione a orientação</option>
                {Object.entries(orientationMap).map(([key, { label }]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>            
            
            <div className={style.parameter_card}>
              <label htmlFor="modelo">{inputLabels.modelo}</label>
              <input
                id="modelo"
                className={`${style.input} ${inputErrors["modelo"] ? style.input_error : ''}`}
                type="text"
                name="modelo"
                value={formData.modelo}
                onChange={handleChange}
                placeholder="Ex: CANADIAN-HiKu7"
              />
            </div>

            <div className={style.parameter_card}>
              <label htmlFor="isc">{inputLabels.isc}</label>
              <input
                id="isc"
                className={`${style.input} ${inputErrors["isc"] ? style.input_error : ''}`}
                type="number"
                name="isc"
                value={formData.isc}
                onChange={handleChange}
                step="0.01"
                placeholder="Ex: 18.42"
              />
            </div>

            <div className={style.parameter_card}>
              <label htmlFor="voc">{inputLabels.voc}</label>
              <input
                id="voc"
                className={`${style.input} ${inputErrors["voc"] ? style.input_error : ''}`}
                type="number"
                name="voc"
                value={formData.voc}
                onChange={handleChange}
                step="0.1"
                placeholder="Ex: 41.1"
              />
            </div>

            <div className={style.parameter_card}>
              <label htmlFor="imp">{inputLabels.imp}</label>
              <input
                id="imp"
                className={`${style.input} ${inputErrors["imp"] ? style.input_error : ''}`}
                type="number"
                name="imp"
                value={formData.imp}
                onChange={handleChange}
                step="0.01"
                placeholder="Ex: 17.15"
              />
            </div>

            <div className={style.parameter_card}>
              <label htmlFor="vmp">{inputLabels.vmp}</label>
              <input
                id="vmp"
                className={`${style.input} ${inputErrors["vmp"] ? style.input_error : ''}`}
                type="number"
                name="vmp"
                value={formData.vmp}
                onChange={handleChange}
                step="0.1"
                placeholder="Ex: 34.7"
              />
            </div>

            <div className={style.parameter_card}>
              <label htmlFor="ns">{inputLabels.ns}</label>
              <input
                id="ns"
                className={`${style.input} ${inputErrors["ns"] ? style.input_error : ''}`}
                type="number"
                name="ns"
                value={formData.ns}
                onChange={handleChange}
                placeholder="Ex: 120"
              />
            </div>

            <div className={style.parameter_card}>
              <label htmlFor="ki">{inputLabels.ki}</label>
              <input
                id="ki"
                className={`${style.input} ${inputErrors["ki"] ? style.input_error : ''}`}
                type="number"
                name="ki"
                value={formData.ki}
                onChange={handleChange}
                step="0.00001"
                placeholder="Ex: 0.00050"
              />
            </div>

            <div className={style.parameter_card}>
              <label htmlFor="kv">{inputLabels.kv}</label>
              <input
                id="kv"
                className={`${style.input} ${inputErrors["kv"] ? style.input_error : ''}`}
                type="number"
                name="kv"
                value={formData.kv}
                onChange={handleChange}
                step="0.00001"
                placeholder="Ex: -0.00260"
              />
            </div>        

            <div className={style.parameter_card}>
              <label htmlFor="area">{inputLabels.area}</label>
              <input
                id="area"
                className={`${style.input} ${inputErrors["area"] ? style.input_error : ''}`}
                type="number"
                name="area"
                value={formData.area}
                onChange={handleChange}
                step="0.00001"
                placeholder="Ex: 3.106"
              />
            </div>       

            <div className={style.parameter_card}>
              <label htmlFor="eficiencia">{inputLabels.eficiencia}</label>
              <input
                id="eficiencia"
                className={`${style.input} ${inputErrors["eficiencia"] ? style.input_error : ''}`}
                type="number"
                name="eficiencia"
                value={formData.eficiencia}
                onChange={handleChange}
                step="0.00001"
                placeholder="Ex: 0.216" 
              />
            </div>           
          </fieldset>
        </div>

        <div className={style.vertical_line}></div>

        <fieldset className={style.form_section}>
          <legend className={style.legend}>Dados do Payback</legend>

          {Object.entries({
            tarifa_de_energia: "0.86293",
            tarifa_da_bandeira: "0",
            custo_por_painel: "1000",
            custo_por_inversor: "5000",
            custo_mao_de_obra: "5000",
            inflacao_de_energia: "5.3",
            anos_de_analise: "25",
            depreciacao_anual: "0.5",
            taxa_do_fio_b: "0.22",
            inflacao_anual: "5"
          }).map(([field, defaultValue], idx) => (
            <div key={idx} className={style.parameter_card}>
              <label htmlFor={field}>{(inputLabels as any)[field]}</label>
              <input
                id={field}
                className={`${style.input} ${inputErrors[field] ? style.input_error : ''}`}
                type="number"
                name={field}
                value={(formData as any)[field] || ""}
                onChange={handleChange}
                placeholder={defaultValue}
              />
            </div>
          ))}

        </fieldset>

        <div>
          <div className={style.form_group}>
            <label className={style.label}>
              <input
                className={style.input_box}
                type="checkbox"                
                onChange={() => setImportFile(!importFile)}
              />
              Importar arquivo CSV
              <InfoTooltip iconSize={15} text={`Preencha automaticamente o formulário importando um arquivo .csv com todas as informações.
                \nDica: com a caixa marcada à esquerda, clique no link abaixo para verificar o formato especificado, crie uma cópia da tabela no google sheets, edite os parametros como quiser, baixe e importe.`}/>
            </label>            
          </div>

          <input
            className={style.input_file}
            type="file"
            name="fileName"
            disabled={!importFile}
            onChange={handleFileChange}
            accept=".csv"
          />

          {/* Essa parte será mostrada caso a check box esteja "checada" */}
          {importFile ? (          
            <div className={style.file_info}>
              <p className={style.attention}>
                Atenção! O arquivo CSV deve seguir o formato especificado                   
                {" "}
                <Link 
                  href="https://docs.google.com/spreadsheets/d/1xQkTmfH2RbEItwAA1TsHcabfGzb4xEJaXfJS24G-j44/edit?usp=sharing"  
                  className={style.download} target="_blank" rel="noopener noreferrer">
                    
                      aqui
                    
                </Link>.
              </p>
              
              <Link className={style.download} href="/form.csv" download>
                <span>Baixar modelo de formulário</span>
              </Link>
            </div>
          ) : <></>}            
        </div>
      </div>

      <button type="submit" className={style.submit_button} disabled={loading}>
        {loading ? 'Carregando...' : 'Submeter'}
      </button>

      {errorMsg && (
          <div className={style.error_message}>
            <strong>Erro:</strong> {errorMsg}
          </div>
      )}
    </form>
  );
}