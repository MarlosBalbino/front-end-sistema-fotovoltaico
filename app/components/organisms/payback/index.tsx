import classNames from 'classnames'
import style from './style.module.css'

export default function Payback () {

  return(
    <div className={style.main_container}>

      <label className={style.label}>Cálculo do Payback e VPL</label>
      <div className={style.calc_container}>
        <label>Estimativa de custos:</label>
        <label>Economia mensal e anual:</label>
        <label>Payback:</label>
        <label>Viabiliade a longo prazo:</label>  
        <label>Resumo:</label>     
        <div className={style.resum_container}>          
          <ul>
            <li>Sistema necessário:</li>
            <li>Custo estimádo:</li>
            <li>Payback:</li>
            <li>Lucro acumulado em _ anos:</li>
            <li>Lucro líquido:</li>
          </ul>
        </div>      
      </div>
    </div>
  )
}