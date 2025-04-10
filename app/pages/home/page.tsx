'use client'

import { Plot } from "@organisms";
import { RandomWalkMode } from "@molecules";


import style from './style.module.css'
import { Perfil, SimpleButton } from "@atoms";

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
        <RandomWalkMode />
        <h1 className={style.title}>Sistema Fotovoltaico</h1>
        <sub className={style.sub}>Dimensionamento e Simulação</sub>    
      </section>

      <section className={style.intro}>
        <h1 className={style.title}>ECOM117</h1>
        <sub className={style.sub}>Tópicos em Energia Solar Fotovoltaica</sub> 
      </section>

      <section className={style.section}>
        <h2 className={style.h2}> Energia Solar e Dimensionamento de Paineis </h2>
        <div className={style.alguma_coisa}>
          <p>** Conteúdo introdutório sobre Energia solar fotovoltaica e dimensionamento de paineis fotovoltaicos **</p>          
        </div>
        <div className={style.button_div}>
          <SimpleButton link={'/pages/page-1'} label={'Ir Para Dimensionamento'}/>
        </div>
        
      </section>

      <section className={style.section}>
        <h2 className={style.h2}> Funcionamento e Curva Característica do Painel Fotovoltaico </h2>
        <div className={style.alguma_coisa}>
          <p>** Conteúdo introdutório sobre o funcionamento técnico de um painel fotovoltaico e sua curva Característica **</p>          
        </div>
        <div className={style.button_div}>
          <SimpleButton link={'/pages/page-3'} label={'Ir Para Curva Característica'}/>
        </div>
      </section>

      <section className={style.section}>
        <h2 className={style.h2}> Simulação de um sistema fotovoltaico </h2>
        <div className={style.alguma_coisa}>
          <p>** Conteúdo introdutório sobre Energia solar fotovoltaica e dimensionamento de paineis fotovoltaicos **</p>          
        </div>
        <div className={style.button_div}>
          <SimpleButton link={'/pages/page-2'} label={'Ir Para Simulação'}/>
        </div>
      </section>

      <section className={style.section}>
        <h2 className={style.h2}> Localização e Irradiância </h2>
        <div className={style.alguma_coisa}>
          <p>** Conteúdo sobre localização geografica, irradiância no plano horizontal e inclinado **</p>          
        </div>

        <div className={style.plot_container}>        
          <Plot fileName="11_03_19_novo.dat" />        
          <div className={style.select_container}>
            <select className={style.select} name="dia" ><option value="11">11</option></select>
            <select className={style.select} name="mes" ><option value="03">03</option></select>
            <select className={style.select} name="ano" ><option value="2019">2019</option></select>
          </div>        
        </div>
      </section>

      <section className={style.section}>
        <h2 className={style.h2}> Colaboradores </h2>

        <h3>Orientador</h3>
        <div className={style.grid_container}>
          <Perfil name={'Maurício Beltrão Rossiter'}/>
        </div>

        <h3>Discentes</h3>        
        <div className={style.grid_container}>
          <Perfil name={'Antônio Carlos'}/>
          <Perfil name={'Arturo Jiménez Loaisa'}/>
          <Perfil name={'José Gomes'}/>
          <Perfil name={'José Renilson'}/>
          <Perfil name={'Marlos Nunes'}/>
          <Perfil name={'Milena Nunes'}/>
        </div>
      </section>
    </div>       
    
  );
}