import Link from 'next/link'
import style from './style.module.css'
import { SimpleLinkItem } from '../../atoms'

export default function Footer() {
  return(
    <footer className={style.footer}>
      <div className={style.top_line}/>
      <div className={style.sub_container}>
        <SimpleLinkItem link={'/documentacao'} label={'Documentação'}/>
        <SimpleLinkItem link={'/artigos'} label={'Artigos'}/> 
        <SimpleLinkItem link={'/colaboracoes'} label={'Colaborações'}/> 
        <SimpleLinkItem link={'/banco-de-dados'} label={'Banco de dados'}/>
      </div>   
    </footer>
  )
}