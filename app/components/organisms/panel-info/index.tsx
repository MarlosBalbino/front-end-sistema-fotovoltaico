import style from './style.module.css'

export default function PanelInfo () {

  return(
    <div className={style.main_container}>
      <label className={style.label}>Cálculo do dimensionamento</label>

      <div className={style.calc_container}>
        <label >Método utilizado:</label>
        <label >Consumo diário:</label>
        <label >Perdas no sistema (20% ~ 30%):</label>
        <label >Potência necessária:</label>
        <label >Quantidade de paineis:</label>
      </div> 
    </div>
  )
}