'use client'

import { useState } from 'react';
import style from './style.module.css';

type PvInput = {
  Isc: string;
  Voc: string;
  Imp: string;
  Vmp: string;
  Ns: string;
  Tstc: string;
  ki: string;
  kv: string;
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
    name: "BP-MSX120",
    params: {
      Isc: "3.87",
      Voc: "42.1",
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
  Tstc: "25 (fixo)",
  ki: "Ex: 0.003",
  kv: "Ex: -0.123"
};

export default function Page3() {
  const [useModel, setUseModel] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [form, setForm] = useState<PvInput>({
    Isc: "",
    Voc: "",
    Imp: "",
    Vmp: "",
    Ns: "",
    Tstc: "25",
    ki: "",
    kv: ""
  });

  const [result, setResult] = useState<PvResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const modelKey = e.target.value;
    setSelectedModel(modelKey);
    
    if (modelKey) {
      setForm({
        ...PV_MODELS[modelKey].params,
        Tstc: "25" // Mantém a temperatura fixa
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Se estiver usando modelo, limpa a seleção ao editar manualmente
    if (useModel && selectedModel) {
      setSelectedModel('');
    }
    
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setErrorMsg('');
    setResult(null);

    try {
      // Converte para número antes de enviar
      const numericForm = {
        Isc: parseFloat(form.Isc),
        Voc: parseFloat(form.Voc),
        Imp: parseFloat(form.Imp),
        Vmp: parseFloat(form.Vmp),
        Ns: parseFloat(form.Ns),
        Tstc: parseFloat(form.Tstc) + 273.15, // Converte para Kelvin
        ki: parseFloat(form.ki),
        kv: parseFloat(form.kv)
      };

      const res = await fetch('/api/run-python', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(numericForm)
      });

      const data: PvResult = await res.json();

      if (data.success) {
        setResult(data);
      } else {
        setErrorMsg(data.error || 'Erro desconhecido');
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

        {/* Formulário de parâmetros */}
        <div className={style.subsection}>
          <h3 className={style.subsection_title}>
            {useModel ? 'Parâmetros do Modelo' : 'Insira os Parâmetros'}
          </h3>
          <div className={style.parameters_grid}>
            {Object.entries(form).map(([key, value]) => (
              <div key={key} className={style.parameter_card}>
                <label htmlFor={key}>
                  {key}:
                </label>
                <input
                  id={key}
                  type="text"
                  name={key}
                  value={value}
                  onChange={handleChange}
                  placeholder={DEFAULT_PLACEHOLDERS[key as keyof PvInput]}
                  disabled={key === 'Tstc'}
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

      {1 && ( //results && (
        <div className={style.section}>
          <h3 className={style.subsection_title}>Resultados</h3>
          <div className={style.results_grid}>
            <div className={style.result_card}>
              <span>Rs</span>
              {result ? <strong>{result.Rs.toFixed(4)} Ω</strong> : <strong>-</strong> }
            </div>
            <div className={style.result_card}>
              <span>Rsh</span>
              {result ? <strong>{result.Rsh.toFixed(2)} Ω</strong> : <strong>-</strong> }
            </div>
            <div className={style.result_card}>
              <span>A</span>
              {result ? <strong>{result.A.toFixed(4)} Ω</strong> : <strong>-</strong> }      
            </div>
          </div>
          {result ? result.iterations && (
            <div className={style.iteration_count}>
              <strong>Iterações:</strong> {result.iterations}
            </div>
          ) : <></>}
        </div>
      )}
    </div>
  );
}