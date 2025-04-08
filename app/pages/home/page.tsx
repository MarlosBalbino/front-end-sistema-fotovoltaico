'use client'

import { Plot } from "@organisms";
import { RandomWalkMode } from "@/app/components/molecules";


import style from './style.module.css'

const DEFAULT_COLORS = ['#8884d8', '#82ca9d', '#ff7300', '#ff0000', '#00ff00', '#0000ff', '#1c9963'];
export default function HomePage() {
  // const [userData, setUserData] = useState<{
  //   location: string,
  //   consumption: string,
  //   phase: "monofasico",
  //   tilt: string,
  //   orientation: string,
  //   model: string,
  //   fileName: string,
  //   importFile: boolean,
  //   useDefaultData: boolean,
  // } | null>(null);

  return (
    <div className={style.main_container}>

      <section className={style.intro}>
        {/* <RandomWalkMode /> */}
        <h1 className={style.title}>Sistema Fotovoltaico</h1>
        <sub className={style.sub}>Dimensionamento e Simulação</sub>        
        
      </section>

      <section className={style.section_2}>
        <h1 className={style.h1}>Dimensione Seu Sistema</h1>

        <div className={style.alguma_coisa}>
          <p>Alguma coisa</p>

        </div>

        

      </section>

      <section className={style.section_3}>
        <p style={{fontSize: '20pt'}}> Irradiância No Plano Horizontal </p>

        <div className={style.plot_container}>        
          <Plot fileName="11_03_19_novo.dat" />        
          <div className={style.select_container}>
            <select className={style.select} name="dia" ><option value="11">11</option></select>
            <select className={style.select} name="mes" ><option value="03">03</option></select>
            <select className={style.select} name="ano" ><option value="2019">2019</option></select>
          </div>        
        </div>

      </section>
      


      

    </div>       
    
  );
}