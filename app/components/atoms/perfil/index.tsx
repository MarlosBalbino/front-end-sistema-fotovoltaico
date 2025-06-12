import style from './style.module.css'
import { LinkItem } from '@atoms'


interface InterfacePerfil {
  name: string;
  descr?: string[];
}

const Perfil: React.FC<InterfacePerfil> = ({ name, descr = []}) => {

  // const async function fodase (params:type) {
  //   const response = await fetch(`/${fileName}`);
  // }

  

  return (
    <div className={style.main_container}>
      {/* <SimpleLinkItem link='' label={name}></SimpleLinkItem><label className={style.label}>{name}</label> */}
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <LinkItem link='' label={name}/>
        {descr.length > 0 && (
          <ul className={style.ul}>
            {descr.map(item => (<li>{item}</li>))}
          </ul>)}
      </div>      
      <div className={style.perfil}><img className={style.img} src="/perfil_sem_fundo.png" alt="foto de perfil" /></div>
    </div>)
}

export default Perfil