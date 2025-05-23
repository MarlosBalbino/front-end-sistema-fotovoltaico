'use client'

import { Plot, DimensionForm, Results, DataProcessing, PanelInfo, Payback } from "@organisms";
import { useEffect, useState } from "react";
import style from './style.module.css'

export default function Page1() {
  const [update, setUpdate] = useState(false);

  const handleSubmit = () => {
    setUpdate(prev => !prev); // força o useEffect no Results
  };

  return (    
    <div className={style.main_container}>
      {/* Seção de Dimensionamento */}
      <div className={style.section}>
        <h2 className={style.section_title}>Dimensionamento do Sistema</h2>
        <div className={style.form_container}>
          <DimensionForm onSubmit={handleSubmit} />
        </div>
      </div>

      <hr className={style.section_divider} />

      {/* Seção de Resultados */}
      <div className={style.section}>
        <h2 className={style.section_title}>Resultados</h2>
        <div className={style.results_container}>
          <Results update={update} />
        </div>
      </div>

      <hr className={style.section_divider} />

      {/* Seção de Processamento de Dados */}
      <div className={style.section}>
        <h2 className={style.section_title}>Localidades disponíveis</h2>
        <div className={style.data_processing_container}>
          <DataProcessing update={update}/>
        </div>
      </div>

      <hr className={style.section_divider} />

      {/* Seção de Informações do Painel */}
      <div className={style.section}>
        <h2 className={style.section_title}>Informações do Painel Solar</h2>
        <div className={style.panel_info_container}>
          <PanelInfo/>
        </div>
      </div>

      <hr className={style.section_divider} />

      {/* Seção de Payback */}
      <div className={style.section}>
        <h2 className={style.section_title}>Análise de Retorno (Payback)</h2>
        <div className={style.payback_container}>
          <Payback/>
        </div>
      </div>
    </div>
  );
}