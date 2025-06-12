import React, { useState } from 'react';
import style from './style.module.css';
import { SimpleButton } from '@/app/components/atoms';

const LocationInfo: React.FC = () => {
  const [mostrarMais, setMostrarMais] = useState(false);

  return (
    <section className={style.section}>
      <h2 className={style.h2}>Localização e Irradiância</h2>
      <div className={style.alguma_coisa}>
        <p>Conteúdo sobre localização geografica, irradiância no plano horizontal e inclinado</p>          
      </div>

      <div className={style.plot_container}>        
        {/* <Plot fileName="11_03_19_novo.dat" />        
        <div className={style.select_container}>
          <select className={style.select} name="dia"><option value="11">11</option></select>
          <select className={style.select} name="mes"><option value="03">03</option></select>
          <select className={style.select} name="ano"><option value="2019">2019</option></select>
        </div>         */}
      </div>
    </section>
  );
};

export default LocationInfo;

