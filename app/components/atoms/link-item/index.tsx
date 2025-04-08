'use client'
import Link from "next/link"
import React from "react"
import style from './style.module.css'

import { usePathname } from "next/navigation";
import classNames from "classnames";


interface LinkProps {
  label: string
  link: string
}

const LinkItem: React.FC<LinkProps> = ({ label, link }) => {
  const pathname = usePathname();
  
  return (
    // <div className={pathname === link ? classNames(style.linkContainer, style.div_active)  : style.linkContainer}>
    //   <Link href={link} className={ style.linkItem }>{label}</Link>
    // </div>

    <div className={style.linkContainer}>
      <Link href={link} className={pathname === link ? classNames(style.linkItem, style.active1)  : style.linkItem}>{label}</Link>
    </div>

    // <div className={style.linkContainer}>
    //   <Link href={link} className={pathname === link ? classNames(style.linkItem, style.active2)  : style.linkItem}>{label}</Link>
    // </div>
    
    // <Link href={link} className={style.linkItem}>{label}</Link>
  )
}

export default LinkItem