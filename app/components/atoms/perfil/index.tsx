import style from './style.module.css'
import { LinkItem } from '@atoms'


interface InterfacePerfil {
  name: string;
}

const Perfil: React.FC<InterfacePerfil> = ({ name }) => {

  // const async function fodase (params:type) {
  //   const response = await fetch(`/${fileName}`);
  // }

  

  return (
    <div className={style.main_container}>
      {/* <SimpleLinkItem link='' label={name}></SimpleLinkItem><label className={style.label}>{name}</label> */}
      <LinkItem link='' label={name}/>
      <div className={style.perfil}><img className={style.img} src="/perfil_sem_fundo.png" alt="foto de perfil" /></div>
    </div>)
}

export default Perfil