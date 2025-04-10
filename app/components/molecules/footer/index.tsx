import Link from 'next/link'
import style from './style.module.css'
import { SimpleLinkItem, LinkItem } from '../../atoms'

export default function Footer(){

  return(
    <footer className={style.footer}>
      <div className={style.top_line}/>
      <div className={style.sub_container}>
        <SimpleLinkItem link={''} label={'Documentação'}></SimpleLinkItem> 
        <SimpleLinkItem link={''} label={'Artigos'}></SimpleLinkItem> 
        <SimpleLinkItem link={''} label={'Colaborações'}></SimpleLinkItem> 
        <SimpleLinkItem link={''} label={'Banco de dados'}></SimpleLinkItem>
      </div>   
    </footer>
  )}