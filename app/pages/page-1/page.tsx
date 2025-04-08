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
      <DimensionForm onSubmit={handleSubmit} />
      <hr style={{ height: '1px', marginTop: "2rem", marginBottom: "2rem", borderColor: "#ccc" }} />
      <Results update={update} />
      <hr style={{ height: '1px', marginTop: "2rem", marginBottom: "2rem", borderColor: "#ccc" }} />
      <DataProcessing update={update}/>
      <hr style={{ height: '1px', marginTop: "2rem", marginBottom: "2rem", borderColor: "#ccc" }} />
      <PanelInfo/>
      <hr style={{ height: '1px', marginTop: "2rem", marginBottom: "2rem", borderColor: "#ccc" }} />
      <Payback/>
    </div>
  );
}