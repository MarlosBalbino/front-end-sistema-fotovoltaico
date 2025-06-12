'use client'
import { Plot } from "@organisms";
import { RandomWalkMode } from "@molecules";
import style from './style.module.css'
import { Perfil, SimpleButton } from "@atoms";

import PvPanelInfo from './panel-info'
import PvSizingInfo from "./panel-sizing-info";
import LocationInfo from "./location-info";
import Colaborators from "./colaborators";
import ControlSolutionInfo from "./control-solution-info";
import PaybackInfo from "./payback-info";

export default function HomePage() {
  return (
    <div className={style.main_container}>
      
      <div className={style.intro_container}>

        {/* Seção Hero 1 */}
        <section className={style.intro}>
          <RandomWalkMode />
          <h1 className={style.title}>Sistema Fotovoltaico</h1>
          <sub className={style.sub}>Dimensionamento e Simulação</sub>    
        </section>

        {/* Seção Hero 2 */}
        <section className={style.intro}>
          <h1 className={style.title}>ECOM117</h1>
          <sub className={style.sub}>Tópicos em Energia Solar Fotovoltaica</sub> 
        </section>
      </div>     

      {/* Seção de Conteúdo 1 */}
      <PvSizingInfo/>

      {/* Seção de Conteúdo 2 */}    
      <PvPanelInfo/>
        
      {/* Seção de Conteúdo 3 */}
      <LocationInfo/>

      {/* Seção de Conteúdo 4*/}
      <ControlSolutionInfo/>

      {/* Seção de Conteúdo 5 */}
      <PaybackInfo/>
      
      {/* Seção de Colaboradores */}
      <Colaborators/>
    </div>       
  );
}
