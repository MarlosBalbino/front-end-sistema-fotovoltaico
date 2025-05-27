'use client'

import { useState } from 'react';

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

export default function RunPythonTest() {
  const [selectedModel, setSelectedModel] = useState<string>('bpmsx');
  const [form, setForm] = useState<PvInput>({
    ...PV_MODELS.bpmsx.params,
    Tstc: 25 + 273.15,
  });

  const [result, setResult] = useState<PvResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const modelKey = e.target.value;
    setSelectedModel(modelKey);
    setForm({
      ...PV_MODELS[modelKey].params,
      Tstc: 25 + 273.15, // Mantém a temperatura padrão
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: parseFloat(e.target.value)
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setErrorMsg('');
    setResult(null);

    try {
      const res = await fetch('/api/run-python', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
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
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h2>Calculadora de Parâmetros PV</h2>

      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="model-select" style={{ display: 'block', marginBottom: '8px' }}>
          Selecione o Modelo:
        </label>
        <select
          id="model-select"
          value={selectedModel}
          onChange={handleModelChange}
          style={{ width: '100%', padding: '8px' }}
        >
          {Object.entries(PV_MODELS).map(([key, model]) => (
            <option key={key} value={key}>{model.name}</option>
          ))}
        </select>
      </div>

      <div style={{ display: 'grid', gap: '12px', marginBottom: '20px' }}>
        <h3>Parâmetros do Painel</h3>
        {Object.entries(form).map(([key, value]) => (
          <div key={key} style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '8px' }}>
            <label htmlFor={key} style={{ alignSelf: 'center' }}>
              {key.toUpperCase()}:
            </label>
            <input
              id={key}
              type="number"
              step="any"
              name={key}
              value={value}
              onChange={handleChange}
              style={{ padding: '8px' }}
              disabled={key === 'Tstc'} // Temperatura fixa em STC
            />
          </div>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{
          padding: '10px 20px',
          backgroundColor: loading ? '#ccc' : '#0070f3',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontSize: '16px'
        }}
      >
        {loading ? 'Calculando...' : 'Calcular Parâmetros'}
      </button>

      {errorMsg && (
        <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#ffebee', color: '#d32f2f' }}>
          <strong>Erro:</strong> {errorMsg}
        </div>
      )}

      {result && (
        <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
          <h3>Resultados</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            <div>
              <strong>Rs</strong>
              <div>{result.Rs.toFixed(4)} Ω</div>
            </div>
            <div>
              <strong>Rsh</strong>
              <div>{result.Rsh.toFixed(2)} Ω</div>
            </div>
            <div>
              <strong>A</strong>
              <div>{result.A.toFixed(4)}</div>
            </div>
          </div>
          {result.iterations && (
            <div style={{ marginTop: '10px' }}>
              <strong>Iterações:</strong> {result.iterations}
            </div>
          )}
        </div>
      )}
    </div>
  );
}