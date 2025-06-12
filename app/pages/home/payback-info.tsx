import React, { useState } from 'react';
import style from './style.module.css';
import { SimpleButton } from '@/app/components/atoms';

const PaybackInfo: React.FC = () => {
  const [mostrarMais, setMostrarMais] = useState(false);

  return (
    <section className={style.section}>
      <h2 className={style.h2}>Análise de retorno (Payback)</h2>
      <div className={style.alguma_coisa}>
        <p>Contúdo sobre payback</p>
      </div>      
    </section>
  );
};

export default PaybackInfo;

