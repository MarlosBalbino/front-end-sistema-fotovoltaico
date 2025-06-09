import { PvResult } from "@/app/types/PvResult"
import { RechartsPlot } from "@organisms"
import style from "./style.module.css"

type ClimaticInput = {
  T: string;
  G: string;
}

type Props = {
  result: PvResult;
  climaticConditionsForm: ClimaticInput;
};

export default function ShowRechartsPlots ({result, climaticConditionsForm}: Props) {

  return (
    <div>
      <hr className={style.subsection_divider} />
      <h3 className={style.subsection_title}>Curva característica</h3>
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
  )
}