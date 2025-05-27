'use client'

import { useState } from "react";
import style from './style.module.css'

// Tipos e modelos
type PvInput = {
  Isc: number;
  Voc: number;
  Imp: number;
  Vmp: number;
  Ns: number;
  Tstc: number;
  ki: number;
  kv: number;
};

type PvResult = {
  Rs: number;
  Rsh: number;
  A: number;
  iterations: number;
  success: boolean;
  error?: string;
};

type PvModel = {
  name: string;
  params: Omit<PvInput, 'Tstc'>;
};

const PV_MODELS: Record<string, PvModel> = {
  bpmsx: {
    name: "BP MSX 120",
    params: {
      Isc: 3.87,
      Voc: 42.1,
      Imp: 3.56,
      Vmp: 33.7,
      Ns: 72,
      ki: -0.005,
      kv: -0.16
    }
  },
  byd: {
    name: "BYD 400W",
    params: {
      Isc: 9.25,
      Voc: 46.1,
      Imp: 8.72,
      Vmp: 38.4,
      Ns: 144,
      ki: 0.00057,
      kv: -0.00285
    }
  },
  era: {
    name: "ERA 500W",
    params: {
      Isc: 16.05,
      Voc: 49.25,
      Imp: 14.85,
      Vmp: 41.3,
      Ns: 120,
      ki: 0.00045,
      kv: -0.0023
    }
  },
  canadian: {
    name: "Canadian Solar 450W",
    params: {
      Isc: 18.42,
      Voc: 41.1,
      Imp: 17.15,
      Vmp: 34.7,
      Ns: 120,
      ki: 0.00050,
      kv: -0.00260
    }
  }
};

export default function Page3() {
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

  // Estado para o modelo selecionado
  const [selectedModel, setSelectedModel] = useState<string>('');

  // Estados para resultados
  const [results, setResults] = useState({
    // Parâmetros extraídos
    rs: null as number | null,
    rsh: null as number | null,
    a: null as number | null,
    
    // Correntes-base
    io: null as number | null,
    iph: null as number | null,
    vt: null as number | null,
    
    // Ponto de MPP
    vMpp: null as number | null,
    iMpp: null as number | null,
    pMpp: null as number | null,
    
    // Arrays para curvas
    vs: [] as number[],
    is: [] as number[],
    ps: [] as number[],
    vsSeries: [] as number[],
    isSeries: [] as number[],
    psSeries: [] as number[],
    vsParallel: [] as number[],
    isParallel: [] as number[],
    psParallel: [] as number[]
  });

  // Estados para loading e erro
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Manipulador para seleção de modelo
  const handleModelSelect = (modelKey: string) => {
    const model = PV_MODELS[modelKey];
    if (model) {
      setSelectedModel(modelKey);
      setPanelParams({
        isc: model.params.Isc.toString(),
        voc: model.params.Voc.toString(),
        impp: model.params.Imp.toString(),
        vmp: model.params.Vmp.toString(),
        ns: model.params.Ns.toString(),
        ki: model.params.ki.toString(),
        kv: model.params.kv.toString()
      });
      // Definir valores padrão para condições ambientais
      setEnvironmentalConditions({
        g: '1000',
        t: '25'
      });
    }
  };

  // Manipuladores de mudança para os inputs
  const handlePanelParamChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPanelParams(prev => ({
      ...prev,
      [name]: value
    }));
    // Resetar o modelo selecionado se os dados forem editados manualmente
    if (selectedModel) {
      setSelectedModel('');
    }
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

  return (    
    <div className={style.main_container}>
      {/* Seção de Seleção de Modelo */}
      <div className={style.section}>
        <h2 className={style.section_title}>Modelos Pré-existentes</h2>
        <div className={style.subsection}>
          <div className={style.grid_container}>
            {Object.entries(PV_MODELS).map(([key, model]) => (
              <div 
                key={key}
                className={`${style.model_card} ${selectedModel === key ? style.model_card_selected : ''}`}
                onClick={() => handleModelSelect(key)}
              >
                <h3>{model.name}</h3>
                <p>Isc: {model.params.Isc}A, Voc: {model.params.Voc}V</p>
              </div>
            ))}
          </div>
        </div>
      </div>

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

        <button 
          className={style.calculate_button} 
          // onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Calculando...' : 'Extrair parametros'}
        </button>

        {errorMsg && (
          <div className={style.error_message}>
            <strong>Erro:</strong> {errorMsg}
          </div>
        )}
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
              <strong>{results.rs !== null ? results.rs.toFixed(4) : '-'}</strong>
            </div>
            <div className={style.result_card}>
              <span>Rsh – Resistência shunt (Ω)</span>
              <strong>{results.rsh !== null ? results.rsh.toFixed(2) : '-'}</strong>
            </div>
            <div className={style.result_card}>
              <span>A – Fator de idealidade</span>
              <strong>{results.a !== null ? results.a.toFixed(4) : '-'}</strong>
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
              <strong>{results.io !== null ? results.io.toExponential(2) : '-'}</strong>
            </div>
            <div className={style.result_card}>
              <span>Iph – Corrente foto-gerada (A)</span>
              <strong>{results.iph !== null ? results.iph.toFixed(2) : '-'}</strong>
            </div>
            <div className={style.result_card}>
              <span>Vt – Tensão térmica (V)</span>
              <strong>{results.vt !== null ? results.vt.toFixed(2) : '-'}</strong>
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
              <strong>{results.vMpp !== null ? results.vMpp.toFixed(1) : '-'}</strong>
            </div>
            <div className={style.result_card}>
              <span>I_mpp – Corrente (A)</span>
              <strong>{results.iMpp !== null ? results.iMpp.toFixed(2) : '-'}</strong>
            </div>
            <div className={style.result_card}>
              <span>P_mpp – Potência (W)</span>
              <strong>{results.pMpp !== null ? results.pMpp.toFixed(1) : '-'}</strong>
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