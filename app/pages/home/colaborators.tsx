import style from './style.module.css';
import { Perfil } from '@atoms';


const Colaborators: React.FC = () => {
  return (
    <section className={style.section}>
      <h2 className={style.h2}> Colaboradores </h2>

      <h3>Orientador</h3>
      <div className={style.grid_container}>
        <Perfil name={'Maurício Beltrão Rossiter'}/>
      </div>

      <h3>Discentes</h3>        
      <div className={style.grid_container}>
        <Perfil name={'Antônio Carlos'} descr={['Curvas características']}/>
        <Perfil name={'Arturo Jiménez Loaisa'} descr={['Dimensionamento']}/>
        <Perfil name={'José Gomes'} descr={['Base de dados', 'Irradiância no plano inclinado']}/>
        <Perfil name={'José Renilson'} descr={['Payback']}/>
        <Perfil name={'Marlos Nunes'} descr={['Front-End', 'Análise CA e solução de controle']}/>
      </div>
    </section>
  );
};

export default Colaborators;



{/* <section className={style.section}>
  <h2 className={style.h2}>Colaboradores</h2>

  <h3>Orientador</h3>
  <div className={style.grid_container}>
    <Perfil name={''}/>
  </div>

  <h3>Discentes</h3>        
  <div className={style.grid_container}>
    <Perfil name={''}/>
    <Perfil name={''}/>
    <Perfil name={''}/>
    <Perfil name={''}/>
    <Perfil name={''}/>
    <Perfil name={''}/>
  </div>
</section> */}