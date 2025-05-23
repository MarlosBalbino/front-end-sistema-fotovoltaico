'use client'

import { Plot, Results } from "@organisms";
import { useEffect, useState } from "react";
import style from './style.module.css'

export default function Page3() {
  // const [update, setUpdate] = useState(false);

  // const handleSubmit = () => {
  //   setUpdate(prev => !prev); // força o re-render dos componentes dependentes
  // };

    // Estados para parâmetros do painel
  const [panelParams, setPanelParams] = useState({
    isc: '',
    voc: '',
    impp: '',
    vmp: '',
    ns: '',
    ki: '',
    kv: ''
  });

  // Estados para condições ambientais
  const [environmentalConditions, setEnvironmentalConditions] = useState({
    g: '',
    t: ''
  });

  // Estados para configuração de módulos
  const [moduleConfig, setModuleConfig] = useState({
    nSeries: '',
    nParallel: ''
  });

  // Estados para resultados
  const [results, setResults] = useState({
    // Parâmetros extraídos
    rs: null,
    rsh: null,
    a: null,
    
    // Correntes-base
    io: null,
    iph: null,
    vt: null,
    
    // Ponto de MPP
    vMpp: null,
    iMpp: null,
    pMpp: null,
    
    // Arrays para curvas (inicialmente vazios)
    vs: [],
    is: [],
    ps: [],
    vsSeries: [],
    isSeries: [],
    psSeries: [],
    vsParallel: [],
    isParallel: [],
    psParallel: []
  });

  // Manipuladores de mudança para os inputs
  const handlePanelParamChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPanelParams(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEnvironmentalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEnvironmentalConditions(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleModuleConfigChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setModuleConfig(prev => ({
      ...prev,
      [name]: value
    }));
  };

    // Função para calcular a curva característica
  // const calculateCharacteristicCurve = () => {
  //   // Aqui você implementará os cálculos reais
  //   // Esta é uma estrutura básica para demonstração
    
  //   // Exemplo de cálculo simulado (substitua pela lógica real)
  //   const simulatedResults = {
  //     rs: 0.42,
  //     rsh: 312.5,
  //     a: 1.3,
  //     io: 9.32e-10,
  //     iph: parseFloat(panelParams.isc),
  //     vt: 1.12,
  //     vMpp: parseFloat(panelParams.vmp),
  //     iMpp: parseFloat(panelParams.impp),
  //     pMpp: parseFloat(panelParams.vmp) * parseFloat(panelParams.impp),
  //     vs: Array.from({length: 100}, (_, i) => i * parseFloat(panelParams.voc) / 100),
  //     is: Array.from({length: 100}, (_, i) => parseFloat(panelParams.isc) * (1 - i/99)),
  //     ps: Array.from({length: 100}, (_, i) => i * parseFloat(panelParams.voc) / 100 * parseFloat(panelParams.isc) * (1 - i/99))
  //   };

  //   setResults({
  //     ...results,
  //     ...simulatedResults
  //   });
  // };

  // Função para lidar com o envio do formulário
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(panelParams)
    // calculateCharacteristicCurve();
  };

  

  return (    
    <div className={style.main_container}>
      {/* Seção de Entradas */}
      <div className={style.section}>
        <h2 className={style.section_title}>Entradas</h2>
        
        {/* Parâmetros do painel */}
        <div className={style.subsection}>
          <h3 className={style.subsection_title}>Parâmetros do painel (datasheet)</h3>
          <div className={style.grid_container}>
            <div className={style.parameter_card}>
              <label>Isc – Corrente de curto-circuito (A)</label>
                <input
                  type="number"
                  name="isc"
                  value={panelParams.isc}
                  onChange={handlePanelParamChange}
                  placeholder="Ex: 8.21"
                  step="0.01"
                  required
                />
            </div>
            <div className={style.parameter_card}>
              <label>Voc – Tensão de circuito-aberto (V)</label>
                <input
                  type="number"
                  name="voc"
                  value={panelParams.voc}
                  onChange={handlePanelParamChange}
                  placeholder="Ex: 32.9"
                  step="0.1"
                  required
                />
            </div>
            <div className={style.parameter_card}>
              <label>Impp – Corrente no MPP (A)</label>
                <input
                  type="number"
                  name="impp"
                  value={panelParams.impp}
                  onChange={handlePanelParamChange}
                  placeholder="Ex: 7.61"
                  step="0.01"
                  required
                />
            </div>
            <div className={style.parameter_card}>
              <label>Vmp – Tensão no MPP (V)</label>
                <input
                  type="number"
                  name="vmp"
                  value={panelParams.vmp}
                  onChange={handlePanelParamChange}
                  placeholder="Ex: 26.3"
                  step="0.1"
                  required
                />
            </div>
            <div className={style.parameter_card}>
              <label>Ns – Número de células em série</label>
                <input
                  type="number"
                  name="ns"
                  value={panelParams.ns}
                  onChange={handlePanelParamChange}
                  placeholder="Ex: 60"
                  min="1"
                  required
                />
            </div>
            <div className={style.parameter_card}>
              <label>ki – Coef. temperatura de Isc (/°C)</label>
                <input
                  type="number"
                  name="ki"
                  value={panelParams.ki}
                  onChange={handlePanelParamChange}
                  placeholder="Ex: 0.003"
                  step="0.0001"
                  required
                />
            </div>
            <div className={style.parameter_card}>
              <label>kv – Coef. temperatura de Voc (V/°C)</label>
                <input
                  type="number"
                  name="kv"
                  value={panelParams.kv}
                  onChange={handlePanelParamChange}
                  placeholder="Ex: -0.123"
                  step="0.001"
                  required
                />
            </div>
          </div>
        </div>

        <hr className={style.subsection_divider} />

        {/* Condições ambientais */}
        <div className={style.subsection}>
          <h3 className={style.subsection_title}>Condições ambientais</h3>
          <div className={style.grid_container}>
            <div className={style.parameter_card}>
              <label>G – Irradiância (W/m²)</label>
                <input
                  type="number"
                  name="g"
                  value={environmentalConditions.g}
                  onChange={handleEnvironmentalChange}
                  placeholder="Ex: 1000"
                  min="0"
                  required
                />
            </div>
            <div className={style.parameter_card}>
              <label>T – Temperatura ambiente (°C)</label>
                <input
                  type="number"
                  name="t"
                  value={environmentalConditions.t}
                  onChange={handleEnvironmentalChange}
                  placeholder="Ex: 25"
                  step="0.1"
                  required
                />
            </div>
          </div>
        </div>

        <hr className={style.subsection_divider} />

        {/* Configuração de módulos */}
        <div className={style.subsection}>
          <h3 className={style.subsection_title}>Configuração de módulos (opcional)</h3>
          <div className={style.grid_container}>
            <div className={style.parameter_card}>
              <label>n_series – Módulos em série</label>
                <input
                  type="number"
                  name="nSeries"
                  value={moduleConfig.nSeries}
                  onChange={handleModuleConfigChange}
                  placeholder="Ex: 2"
                  min="1"
                />
            </div>
            <div className={style.parameter_card}>
              <label>n_parallel – Módulos em paralelo</label>
                <input
                  type="number"
                  name="nParallel"
                  value={moduleConfig.nParallel}
                  onChange={handleModuleConfigChange}
                  placeholder="Ex: 3"
                  min="1"
                />
            </div>
          </div>
        </div>

        <button className={style.calculate_button} onClick={handleSubmit}>
          Calcular Curva Característica
        </button>
      </div>

      <hr className={style.section_divider} />

      {/* Seção de Saídas */}
      <div className={style.section}>
        <h2 className={style.section_title}>Saídas</h2>
        
        {/* Parâmetros extraídos */}
        <div className={style.subsection}>
          <h3 className={style.subsection_title}>Parâmetros extraídos</h3>
          <div className={style.grid_container}>
            <div className={style.result_card}>
              <span>Rs – Resistência série (Ω)</span>
              <strong>0.42</strong>
            </div>
            <div className={style.result_card}>
              <span>Rsh – Resistência shunt (Ω)</span>
              <strong>312.5</strong>
            </div>
            <div className={style.result_card}>
              <span>A – Fator de idealidade</span>
              <strong>1.3</strong>
            </div>
          </div>
        </div>

        <hr className={style.subsection_divider} />

        {/* Correntes-base */}
        <div className={style.subsection}>
          <h3 className={style.subsection_title}>Correntes-base</h3>
          <div className={style.grid_container}>
            <div className={style.result_card}>
              <span>Io – Corrente de saturação (A)</span>
              <strong>9.32e-10</strong>
            </div>
            <div className={style.result_card}>
              <span>Iph – Corrente foto-gerada (A)</span>
              <strong>8.21</strong>
            </div>
            <div className={style.result_card}>
              <span>Vt – Tensão térmica (V)</span>
              <strong>1.12</strong>
            </div>
          </div>
        </div>

        <hr className={style.subsection_divider} />

        {/* Ponto de Máxima Potência */}
        <div className={style.subsection}>
          <h3 className={style.subsection_title}>Ponto de Máxima Potência (MPP)</h3>
          <div className={style.grid_container}>
            <div className={style.result_card}>
              <span>V_mpp – Tensão (V)</span>
              <strong>26.3</strong>
            </div>
            <div className={style.result_card}>
              <span>I_mpp – Corrente (A)</span>
              <strong>7.61</strong>
            </div>
            <div className={style.result_card}>
              <span>P_mpp – Potência (W)</span>
              <strong>200.1</strong>
            </div>
          </div>
        </div>

        <hr className={style.subsection_divider} />

        {/* Gráficos */}
        <div className={style.subsection}>
          <h3 className={style.subsection_title}>Gráficos</h3>
          <div className={style.plot_container}>
            {/* <Plot title="Curva IV" />
            <Plot title="Curva PV" /> */}
          </div>
        </div>
      </div>
    </div>
  );
}


  // return (    
  //   <div className={style.main_container}>
  //     <form onSubmit={handleSubmit}>
  //       {/* Seção de Entradas */}
  //       <div className={style.section}>
  //         <h2 className={style.section_title}>Entradas</h2>
          
  //         {/* Parâmetros do painel */}
  //         <div className={style.subsection}>
  //           <h3 className={style.subsection_title}>Parâmetros do painel (datasheet)</h3>
  //           <div className={style.grid_container}>
  //             <div className={style.parameter_card}>
  //               <label>Isc – Corrente de curto-circuito (A)</label>
  //               <input
  //                 type="number"
  //                 name="isc"
  //                 value={panelParams.isc}
  //                 onChange={handlePanelParamChange}
  //                 placeholder="Ex: 8.21"
  //                 step="0.01"
  //                 required
  //               />
  //             </div>
  //             <div className={style.parameter_card}>
  //               <label>Voc – Tensão de circuito-aberto (V)</label>
  //               <input
  //                 type="number"
  //                 name="voc"
  //                 value={panelParams.voc}
  //                 onChange={handlePanelParamChange}
  //                 placeholder="Ex: 32.9"
  //                 step="0.1"
  //                 required
  //               />
  //             </div>
  //             <div className={style.parameter_card}>
  //               <label>Impp – Corrente no MPP (A)</label>
  //               <input
  //                 type="number"
  //                 name="impp"
  //                 value={panelParams.impp}
  //                 onChange={handlePanelParamChange}
  //                 placeholder="Ex: 7.61"
  //                 step="0.01"
  //                 required
  //               />
  //             </div>
  //             <div className={style.parameter_card}>
  //               <label>Vmp – Tensão no MPP (V)</label>
  //               <input
  //                 type="number"
  //                 name="vmp"
  //                 value={panelParams.vmp}
  //                 onChange={handlePanelParamChange}
  //                 placeholder="Ex: 26.3"
  //                 step="0.1"
  //                 required
  //               />
  //             </div>
  //             <div className={style.parameter_card}>
  //               <label>Ns – Número de células em série</label>
  //               <input
  //                 type="number"
  //                 name="ns"
  //                 value={panelParams.ns}
  //                 onChange={handlePanelParamChange}
  //                 placeholder="Ex: 60"
  //                 min="1"
  //                 required
  //               />
  //             </div>
  //             <div className={style.parameter_card}>
  //               <label>ki – Coef. temperatura de Isc (/°C)</label>
  //               <input
  //                 type="number"
  //                 name="ki"
  //                 value={panelParams.ki}
  //                 onChange={handlePanelParamChange}
  //                 placeholder="Ex: 0.003"
  //                 step="0.0001"
  //                 required
  //               />
  //             </div>
  //             <div className={style.parameter_card}>
  //               <label>kv – Coef. temperatura de Voc (V/°C)</label>
  //               <input
  //                 type="number"
  //                 name="kv"
  //                 value={panelParams.kv}
  //                 onChange={handlePanelParamChange}
  //                 placeholder="Ex: -0.123"
  //                 step="0.001"
  //                 required
  //               />
  //             </div>
  //           </div>
  //         </div>

  //         <hr className={style.subsection_divider} />

  //         {/* Condições ambientais */}
  //         <div className={style.subsection}>
  //           <h3 className={style.subsection_title}>Condições ambientais</h3>
  //           <div className={style.grid_container}>
  //             <div className={style.parameter_card}>
  //               <label>G – Irradiância (W/m²)</label>
  //               <input
  //                 type="number"
  //                 name="g"
  //                 value={environmentalConditions.g}
  //                 onChange={handleEnvironmentalChange}
  //                 placeholder="Ex: 1000"
  //                 min="0"
  //                 required
  //               />
  //             </div>
  //             <div className={style.parameter_card}>
  //               <label>T – Temperatura ambiente (°C)</label>
  //               <input
  //                 type="number"
  //                 name="t"
  //                 value={environmentalConditions.t}
  //                 onChange={handleEnvironmentalChange}
  //                 placeholder="Ex: 25"
  //                 step="0.1"
  //                 required
  //               />
  //             </div>
  //           </div>
  //         </div>

  //         <hr className={style.subsection_divider} />

  //         {/* Configuração de módulos */}
  //         <div className={style.subsection}>
  //           <h3 className={style.subsection_title}>Configuração de módulos (opcional)</h3>
  //           <div className={style.grid_container}>
  //             <div className={style.parameter_card}>
  //               <label>n_series – Módulos em série</label>
  //               <input
  //                 type="number"
  //                 name="nSeries"
  //                 value={moduleConfig.nSeries}
  //                 onChange={handleModuleConfigChange}
  //                 placeholder="Ex: 2"
  //                 min="1"
  //               />
  //             </div>
  //             <div className={style.parameter_card}>
  //               <label>n_parallel – Módulos em paralelo</label>
  //               <input
  //                 type="number"
  //                 name="nParallel"
  //                 value={moduleConfig.nParallel}
  //                 onChange={handleModuleConfigChange}
  //                 placeholder="Ex: 3"
  //                 min="1"
  //               />
  //             </div>
  //           </div>
  //         </div>

  //         <button type="submit" className={style.calculate_button}>
  //           Calcular Curva Característica
  //         </button>
  //       </div>
  //     </form>

  //     <hr className={style.section_divider} />

  //     {/* Seção de Saídas */}
  //     <div className={style.section}>
  //       <h2 className={style.section_title}>Saídas</h2>
        
  //       {/* Parâmetros extraídos */}
  //       <div className={style.subsection}>
  //         <h3 className={style.subsection_title}>Parâmetros extraídos</h3>
  //         <div className={style.grid_container}>
  //           <div className={style.result_card}>
  //             <span>Rs – Resistência série (Ω)</span>
  //             <strong>{results.rs ?? '-'}</strong>
  //           </div>
  //           <div className={style.result_card}>
  //             <span>Rsh – Resistência shunt (Ω)</span>
  //             <strong>{results.rsh ?? '-'}</strong>
  //           </div>
  //           <div className={style.result_card}>
  //             <span>A – Fator de idealidade</span>
  //             <strong>{results.a ?? '-'}</strong>
  //           </div>
  //         </div>
  //       </div>

  //       <hr className={style.subsection_divider} />

  //       {/* Correntes-base */}
  //       <div className={style.subsection}>
  //         <h3 className={style.subsection_title}>Correntes-base</h3>
  //         <div className={style.grid_container}>
  //           <div className={style.result_card}>
  //             <span>Io – Corrente de saturação (A)</span>
  //             <strong>{results.io ? results.io.toExponential(2) : '-'}</strong>
  //           </div>
  //           <div className={style.result_card}>
  //             <span>Iph – Corrente foto-gerada (A)</span>
  //             <strong>{results.iph ?? '-'}</strong>
  //           </div>
  //           <div className={style.result_card}>
  //             <span>Vt – Tensão térmica (V)</span>
  //             <strong>{results.vt ?? '-'}</strong>
  //           </div>
  //         </div>
  //       </div>

  //       <hr className={style.subsection_divider} />

  //       {/* Ponto de Máxima Potência */}
  //       <div className={style.subsection}>
  //         <h3 className={style.subsection_title}>Ponto de Máxima Potência (MPP)</h3>
  //         <div className={style.grid_container}>
  //           <div className={style.result_card}>
  //             <span>V_mpp – Tensão (V)</span>
  //             <strong>{results.vMpp ?? '-'}</strong>
  //           </div>
  //           <div className={style.result_card}>
  //             <span>I_mpp – Corrente (A)</span>
  //             <strong>{results.iMpp ?? '-'}</strong>
  //           </div>
  //           <div className={style.result_card}>
  //             <span>P_mpp – Potência (W)</span>
  //             <strong>{results.pMpp ?? '-'}</strong>
  //           </div>
  //         </div>
  //       </div>

  //       <hr className={style.subsection_divider} />

  //       {/* Gráficos (serão implementados posteriormente) */}
  //       <div className={style.subsection}>
  //         <h3 className={style.subsection_title}>Gráficos</h3>
  //         <div className={style.plot_container}>
  //           <div className={style.plot_placeholder}>
  //             <p>Curva IV será exibida aqui</p>
  //             {/* Substituir pelo componente Plot real */}
  //           </div>
  //           <div className={style.plot_placeholder}>
  //             <p>Curva PV será exibida aqui</p>
  //             {/* Substituir pelo componente Plot real */}
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );