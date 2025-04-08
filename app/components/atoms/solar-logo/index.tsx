
interface LogoProps {
  size: number
}

const SolarLogo: React.FC<LogoProps> = ({ size }) => {
  
  return (
    <div style={{ /*backgroundColor: '#FFD700', */ width: `${size}px`, height: `${size}px`}}>
      {/* <p >SISTEMA</p> */}
      <svg width={size} height={size} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">

      {/* <text x="40" y="40" font-family="Arial" font-size="16" text-anchor="middle" fill="#2C3E50" font-weight="bold">SISTEMA</text> */}
        
        <rect x="50" y="50" width="100" height="100" fill="#2C3E50" rx="5"/>
        
       
        <rect x="60" y="60" width="20" height="20" fill='var(--color-4)'/>
        <rect x="85" y="60" width="20" height="20" fill='var(--color-4)'/>
        <rect x="110" y="60" width="20" height="20" fill='var(--color-4)'/>
        
        <rect x="60" y="85" width="20" height="20" fill='var(--color-4)'/>
        <rect x="85" y="85" width="20" height="20" fill='var(--color-4)'/>
        <rect x="110" y="85" width="20" height="20" fill='var(--color-4)'/>
        
        <rect x="60" y="110" width="20" height="20" fill='var(--color-4)'/>
        <rect x="85" y="110" width="20" height="20" fill='var(--color-4)'/>
        <rect x="110" y="110" width="20" height="20" fill='var(--color-4)'/>
        
        {/* <text x="110" y="170" font-family="Arial" font-size="16" text-anchor="middle" fill="#2C3E50" font-weight="bold">FOTOVOLTAICO</text> */}
      </svg>
      {/* <p style={{display: 'flex', justifyContent: 'flex-end'}}>FOTOVOLTAICO</p>   */}
    </div>
  )
}

export default SolarLogo