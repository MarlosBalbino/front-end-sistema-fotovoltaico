'use client'

import { useState } from 'react';
import style from './style.module.css';
import { RechartsPlot } from '@/app/components/organisms';
import { boolean } from 'mathjs';
import { PvResult } from '@/app/types/PvResult';
import { ShowRechartsPlots } from "@organisms"
import { ClimaticInput } from '@/app/types/climaticInput';

type PvInput = {
  Isc: string;
  Voc: string;
  Imp: string;
  Vmp: string;
  Ns: string;
  ki: string;
  kv: string;
};

type moduleConfigInput = {
  n_series: string;
  n_parallel: string;
}


type PvModel = {
  name: string;
  params: Omit<PvInput, 'Tstc' | 'Gstc'>;
};

const PV_MODELS: Record<string, PvModel> = {
  bpmsx: {
    name: "BP-MSX120",
    params: {
      Isc: "3.87",
      Voc: "44.6",
      Imp: "3.56",
      Vmp: "33.7",
      Ns: "72", 
      ki: "-0.005",
      kv: "-0.16"
    }
  },
  byd: {
    name: "BYD-335PHK",
    params: {
      Isc: "9.252",
      Voc: "45.44",
      Imp: "8.794",
      Vmp: "38.10",
      Ns: "144",
      ki: "0.00057",
      kv: "-0.00285"
    }
  },
  era: {
    name: "ERA-RC66HD",
    params: {
      Isc: "16.05",
      Voc: "49.25",
      Imp: "14.85",
      Vmp: "41.3",
      Ns: "120",
      ki: "0.00045",
      kv: "-0.0023"
    }
  },
  canadian: {
    name: "CANADIAN-HiKu7",
    params: {
      Isc: "18.42",
      Voc: "41.1",
      Imp: "17.15",
      Vmp: "34.7",
      Ns: "120",
      ki: "0.00050",
      kv: "-0.00260"
    }
  }
};

const DEFAULT_PLACEHOLDERS: PvInput = {
  Isc: "Ex: 8.21",
  Voc: "Ex: 32.9",
  Imp: "Ex: 7.61",
  Vmp: "Ex: 26.3",
  Ns: "Ex: 60",
  ki: "Ex: 0.003",
  kv: "Ex: -0.123"
};

const CLIMATIC_DEFAULT_PLACEHOLDERS: ClimaticInput = {
  T: "Ex: 25",
  G: "Ex: 1000"
}

const MODULE_CONFIG_DEFAULT_PLACEHOLDERS: moduleConfigInput = {
  n_series: "Ex: 2",
  n_parallel: "Ex: 3"
}

const input_labels: PvInput = {
  Isc: "Isc – Corrente de curto-circuito (A)",
  Voc: "Voc – Tensão de circuito-aberto (V)",
  Imp: "Impp – Corrente no MPP (A)",
  Vmp: "Vmp – Tensão no MPP (V)",
  Ns: "Ns – Número de células em série",
  ki: "ki – Coef. temp. de Isc (/°C)",
  kv: "kv – Coef. temp. de Voc (V/°C)"
}

const climatic_input_labels: ClimaticInput = {
  T: "T - Temperatura ambiente (°C)",
  G: "G - Irradiância (W/m²)"
}

const module_config_input_labels: moduleConfigInput = {
  n_series: "n_series – Módulos em série",
  n_parallel: "n_parallel – Módulos em paralelo"
}

export default function Page3() {
  const [inputErrors, setInputErrors] = useState<Record<string, boolean>>({});
  const [useModel, setUseModel] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [panelModelForm, setPanelModelForm] = useState<PvInput>({
    Isc: "",
    Voc: "",
    Imp: "",
    Vmp: "",
    Ns: "",
    ki: "",
    kv: "",
    // Tstc: "25",
    // Gstc: "1000"
  });

  const [climaticConditionsForm, setClimaticConditionsForm] = useState<ClimaticInput>({
    T: "25",
    G: "1000"
  })

  const [moduleConfigForm, setModuleConfigForm] = useState<moduleConfigInput>({
    n_series: "",
    n_parallel: ""
  })

  const [result, setResult] = useState<PvResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  const modelKey = e.target.value;
  setSelectedModel(modelKey);

  if (modelKey === "") {
    setPanelModelForm({
      Isc: "",
      Voc: "",
      Imp: "",
      Vmp: "",
      Ns: "",
      ki: "",
      kv: ""
    });
    return;
  }

  setPanelModelForm({
     ...PV_MODELS[modelKey].params
    });
  };

  const panelFormHandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Se estiver usando modelo, limpa a seleção ao editar manualmente
    if (useModel && selectedModel) {
      setSelectedModel('');
    }    
    setPanelModelForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const climaticFormHandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setClimaticConditionsForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const moduleConfigFormHandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setModuleConfigForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async () => {
    setLoading(true);
    setErrorMsg('');
    setResult(null);

    // Validação dos campos obrigatórios
    const requiredFields: string[] = [
      'Isc', 'Voc', 'Imp', 'Vmp', 'Ns', 'ki', 'kv', 'T', 'G'
    ];

    const errors: Record<string, boolean> = {};
    for (const field of requiredFields) {
      const value = field in panelModelForm
        ? panelModelForm[field as keyof PvInput]
        : climaticConditionsForm[field as keyof ClimaticInput];
      if (!value || value.trim() === "") {
        errors[field] = true;
      }
    }

    if (Object.keys(errors).length > 0) {
      setInputErrors(errors);
      setErrorMsg("Campo obrigatório não preenchido");
      setLoading(false);
      return;
    }

    setInputErrors({});
    try {
      const numericForm = {
        Isc: parseFloat(panelModelForm.Isc),
        Voc: parseFloat(panelModelForm.Voc),
        Imp: parseFloat(panelModelForm.Imp),
        Vmp: parseFloat(panelModelForm.Vmp),
        Ns: parseFloat(panelModelForm.Ns),
        ki: parseFloat(panelModelForm.ki),
        kv: parseFloat(panelModelForm.kv),
        T: parseFloat(climaticConditionsForm.T),
        G: parseFloat(climaticConditionsForm.G),
        n_series: isNaN(parseFloat(moduleConfigForm.n_series)) ? 1 : parseFloat(moduleConfigForm.n_series),
        n_parallel: isNaN(parseFloat(moduleConfigForm.n_parallel)) ? 1 : parseFloat(moduleConfigForm.n_parallel)
      };
      
      const url_vercel = 'https://python-vercel-35m9ym18x-marlosbalbinos-projects.vercel.app/extract'
      const url_local = 'http://127.0.0.1:5000/extract'

      console.log('Sending:', JSON.stringify(numericForm));

      const res = await fetch(url_vercel, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(numericForm)
      });

      const data: PvResult = await res.json();

      if (res.ok) {
        setResult(data);
      } else {
        setErrorMsg('Erro desconhecido.');
      }
    } catch (err) {
      setErrorMsg('Erro ao chamar a API.');
      console.error('API Error:', err);
    }
    setLoading(false);
  };

  return (
    <div className={style.main_container}>
      <div className={style.section}>
        <h2 className={style.section_title}>Calculadora de Parâmetros PV</h2>

        {/* Checkbox para usar modelo */}
        <div className={style.checkbox_container}>
          <input
            type="checkbox"
            id="useModel"
            checked={useModel}
            onChange={(e) => setUseModel(e.target.checked)}
            className={style.checkbox_input}
          />
          <label htmlFor="useModel" className={style.checkbox_label}>
            Usar modelo pré-definido
          </label>
        </div>

        {/* Seletor de modelo (visível apenas quando checkbox marcada) */}
        {useModel && (
          <div className={style.subsection}>
            <label htmlFor="model-select" className={style.select_label}>
              Selecione um modelo :
            </label>
            <select
              id="model-select"
              value={selectedModel}
              onChange={handleModelChange}
              className={style.model_select}
            >
              <option value="">-----</option>
              {Object.entries(PV_MODELS).map(([key, model]) => (
                <option key={key} value={key}>{model.name}</option>
              ))}
            </select>
          </div>
        )}

        <hr className={style.subsection_divider} />

        {/* Formulário de parâmetros */}
        <div className={style.subsection}>
          <h3 className={style.subsection_title}>
            {useModel ? 'Parâmetros do Modelo' : 'Insira os Parâmetros de entrada'}
          </h3>
          <div className={style.parameters_grid}>
            {Object.entries(panelModelForm).map(([key, value]) => (
              <div key={key} className={style.parameter_card}>
                <label htmlFor={key}>
                  {input_labels[key as keyof PvInput]}:
                </label>
                <input
                  id={key}
                  type="text"
                  name={key}
                  value={value}
                  onChange={panelFormHandleChange}
                  placeholder={DEFAULT_PLACEHOLDERS[key as keyof PvInput]}
                  disabled={key === 'Tstc' || key === 'Gstc'}
                  className={`${style.parameter_input} ${inputErrors[key] ? style.input_error : ''}`}
                />
              </div>
            ))}
          </div>
        </div>

        <hr className={style.subsection_divider} />

        <div className={style.subsection}>
          <h3 className={style.subsection_title}>
            {'Condições ambientais'}
          </h3>
          <div className={style.parameters_grid}>
            {Object.entries(climaticConditionsForm).map(([key, value]) => (
              <div key={key} className={style.parameter_card}>
                <label htmlFor={key}>
                  {climatic_input_labels[key as keyof ClimaticInput]}:
                </label>
                <input
                  id={key}
                  type="text"
                  name={key}
                  value={value}
                  onChange={climaticFormHandleChange}
                  placeholder={CLIMATIC_DEFAULT_PLACEHOLDERS[key as keyof ClimaticInput]}
                  className={`${style.parameter_input} ${inputErrors[key] ? style.input_error : ''}`}
                />            
              </div>              
            ))}            
          </div>
          <label className={style.label}>
              Dica: <br />
              Tstc: 25°C 
              <span style={{marginRight: "2rem"}}/>
              Gstc: 1000W/m²
          </label>
          
        </div>
        

        <hr className={style.subsection_divider} />

        <div className={style.subsection}>
          <h3 className={style.subsection_title}>
            {'Configuração de módulos (opcional)'}
          </h3>
          <div className={style.parameters_grid}>
            {Object.entries(moduleConfigForm).map(([key, value]) => (
              <div key={key} className={style.parameter_card}>
                <label htmlFor={key}>
                  {module_config_input_labels[key as keyof moduleConfigInput]}:
                </label>
                <input
                  id={key}
                  type="text"
                  name={key}
                  value={value}
                  onChange={moduleConfigFormHandleChange}
                  placeholder={MODULE_CONFIG_DEFAULT_PLACEHOLDERS[key as keyof moduleConfigInput]}
                  // disabled={key === 'Tstc' || key === 'Gstc'}
                  className={style.parameter_input}
                />
              </div>
            ))}
          </div>
        </div>

        <button
          className={style.calculate_button}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Calculando...' : 'Calcular Parâmetros'}
        </button>

        {errorMsg && (
          <div className={style.error_message}>
            <strong>Erro:</strong> {errorMsg}
          </div>
        )}
      </div>

      <div className={style.section}>
        {/* <h3 className={style.subsection_title}>Resultados</h3> */}
        <h2 className={style.section_title}>Resultados</h2>

        <h3 className={style.subsection_title}>Parâmetros extraídos</h3>
        <div className={style.results_grid}>
          <div className={style.result_card}>
            <span>Rs – Resistência série (Ω)</span>
            {result ? <strong>{result.Rs.toFixed(4)} Ω</strong> : <strong>-</strong> }
          </div>
          <div className={style.result_card}>
            <span>Rsh – Resistência shunt (Ω)</span>
            {result ? <strong>{result.Rsh.toFixed(2)} Ω</strong> : <strong>-</strong> }
          </div>
          <div className={style.result_card}>
            <span>A – Fator de idealidade</span>
            {result ? <strong>{result.A.toFixed(4)} Ω</strong> : <strong>-</strong> }      
          </div>
        </div>

        <hr className={style.subsection_divider} />

        <h3 className={style.subsection_title}>Correntes-base</h3>
        <div className={style.results_grid}>
          <div className={style.result_card}>
            <span>Io – Corrente de saturação (A)</span>
            {result ? <strong>{result.I0} A</strong> : <strong>-</strong> }
          </div>
          <div className={style.result_card}>
            <span>Iph – Corrente foto-gerada (A)</span>
            {result ? <strong>{result.Iph.toFixed(2)} A</strong> : <strong>-</strong> }
          </div>
          <div className={style.result_card}>
            <span>Vt – Tensão térmica (V)</span>
            {result ? <strong>{result.Vt.toFixed(4)} V</strong> : <strong>-</strong> }      
          </div>
        </div>
        
        <hr className={style.subsection_divider} />

        <h3 className={style.subsection_title}>Pontos de Máxima Potência (MPP)</h3>
        <div className={style.results_grid}>
          <div className={style.result_card}>
            <span>V_mpp – Tensão (V)</span>
            {result ? <strong>{result.V_mpp.toFixed(4)} V</strong> : <strong>-</strong> }
          </div>
          <div className={style.result_card}>
            <span>I_mpp – Corrente (A)</span>
            {result ? <strong>{result.I_mpp.toFixed(4)} A</strong> : <strong>-</strong> }
          </div>
          <div className={style.result_card}>
            <span>P_mpp – Potência (W)</span>
            {result ? <strong>{result.P_mpp.toFixed(4)} W</strong> : <strong>-</strong> }      
          </div>          
        </div>

        {/* {result?.Vs && (
          <div>
            <hr className={style.subsection_divider} />
            <h3 className={style.subsection_title}>Curva característica</h3>
            <p>{result?.Vs_stc.length}</p>
            <div className={style.results_graph}>
              <RechartsPlot
                x={[result?.Vs, result?.Vs_stc]}
                y={[result?.Is, result?.Is_stc]}          

                scatterPoints = {
                result?.Vs_stc.length === 0 ? 
                  [{x: result?.V_mpp, y: result?.I_mpp, label: `MPP: (${result?.V_mpp.toFixed(1)}V, ${result?.I_mpp.toFixed(1)}A)`}] 
                  :                      
                  [{x: result?.V_mpp, y: result?.I_mpp, label: `MPP: (${result?.V_mpp.toFixed(1)}V, ${result?.I_mpp.toFixed(1)}A)`},
                    {x: result?.V_mpp_stc, y: result?.I_mpp_stc, label: `MPP: (${result?.V_mpp_stc.toFixed(1)}V, ${result?.I_mpp_stc.toFixed(1)}A)`}]
                } 
            
                labels={
                  [climaticConditionsForm.G === "1000" && climaticConditionsForm.T === "25" ? 
                    "Curva IV @ STC" : "Curva IV", "Curva IV @ STC"]
                }
                lineWidths={[2, 2]}
                axisLabels={{ x: 'Tensão (V)', y: 'Corrente (A)' }}
                width={480}
                height={280}
                backgroundColor="#ffffff"
                perCurveYScale={false}
                gridLineWidth={0.1}
                xPrecision={2}
              />
              <RechartsPlot
                x={[result?.Vs, result?.Vs_stc ]}
                y={[result?.Ps, result?.Ps_stc]}
                scatterPoints = {
                  result?.Vs_stc.length === 0 ? 
                    [{x: result?.V_mpp, y: result?.P_mpp, label: `MPP: (${result?.V_mpp.toFixed(1)}V, ${result?.I_mpp.toFixed(1)}A)`}] 
                    :                     
                    [{x: result?.V_mpp, y: result?.P_mpp, label: `MPP: (${result?.V_mpp.toFixed(1)}V, ${result?.P_mpp.toFixed(1)}A)`},
                     {x: result?.V_mpp_stc, y: result?.P_mpp_stc, label: `MPP: (${result?.V_mpp_stc.toFixed(1)}V, ${result?.P_mpp_stc.toFixed(1)}W)`}]
                }   
                
                labels={
                  [climaticConditionsForm.G === "1000" && climaticConditionsForm.T === "25" ? 
                    "Curva PV @ STC" : "Curva PV", "Curva PV @ STC"]
                }
                lineWidths={[2, 2]}
                axisLabels={{ x: 'Tensão (V)', y: 'Potência (W)'}}
                width={480}
                height={280}
                backgroundColor="#ffffff"
                perCurveYScale={false}
                gridLineWidth={0.1}
                xPrecision={2}    
              />
            </div>
          </div>        
        )} */}

        {result?.Vs && <ShowRechartsPlots result={result} climaticConditionsForm={climaticConditionsForm}/>}
        
      </div>
      
    </div>
  );
}