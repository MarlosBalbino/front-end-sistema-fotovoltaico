import Link from "next/link"
import React from "react"
import style from './style.module.css'

interface LinkProps {
  label: string
  link: string
}

const SimpleLinkItem: React.FC<LinkProps> = ({ label, link }) => {
  return (
    <Link href={link} className={style.linkItem}>
      {label}
    </Link>
  )
}

export default SimpleLinkItem