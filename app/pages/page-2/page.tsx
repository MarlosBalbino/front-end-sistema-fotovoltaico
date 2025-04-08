'use client'

import { Plot, DimensionForm } from "@/app/components/organisms";
import { useEffect, useState } from "react";

import style from './style.module.css'

export default function Page2() {
  const [userData, setUserData] = useState<{
    location: string,
    consumption: string,
    phase: "monofasico",
    tilt: string,
    orientation: string,
    model: string,
    fileName: string,
    importFile: boolean,
    useDefaultData: boolean,
  } | null>(null);



  // const [userData, setUserData] = useState<{local: string}>

  useEffect(() => {
    const data = localStorage.getItem("solarFormData");
    if (data) {
      setUserData(JSON.parse(data));
    }
  }, []);

  return (    
    <div className={style.main_container}>
      {/* <SolarForm>
            
      </SolarForm> */}
      {/* <div className={style.sub_container}>
        <div className={style.data_container}>
          <h1>Dados Recebidos</h1>
          <p><strong>Local:</strong> {userData?.location || ""}</p>
          <p><strong>Consumo:</strong> {userData?.consumption || ""}</p>
          <p><strong>Fase:</strong> {userData?.phase || ""}</p>
          <p><strong>Orientação:</strong> {userData?.orientation || ""}</p>   
        </div>
        <div className={style.plot_container}>
          {userData?.useDefaultData ? 
            <Plot fileName="11_03_19_novo.dat"></Plot> : 
            <p><strong>Nome do arquivo:</strong> {userData?.fileName || ""}</p>}  
        </div>         

      </div> */}
      
    </div>
  );
}