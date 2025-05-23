import React from 'react';
import styles from './style.module.css';

interface LogoProps {
  size: number;
}

const SolarLogo: React.FC<LogoProps> = ({ size }) => {
  return (
    <div className={styles.logoContainer} style={{ width: `${size}px`, height: `${size}px` }}>
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 200 200" 
        xmlns="http://www.w3.org/2000/svg"
        className={styles.logoSvg}
      >
        {/* Definindo o gradiente */}
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8884d8" />
            <stop offset="100%" stopColor="#82ca9d" />
          </linearGradient>
        </defs>
        
        {/* Fundo com gradiente */}
        <rect 
          x="50" 
          y="50" 
          width="100" 
          height="100" 
          className={styles.logoBackground}
        />
        
        {/* Células solares animadas */}
        {/* Linha 1 */}
        <rect 
          x="60" y="60" width="20" height="20" 
          className={styles.solarCell}
        />
        <rect 
          x="85" y="60" width="20" height="20" 
          className={styles.solarCell}
          style={{ animationDelay: '0.1s' }}
        />
        <rect 
          x="110" y="60" width="20" height="20" 
          className={styles.solarCell}
          style={{ animationDelay: '0.2s' }}
        />
        
        {/* Linha 2 */}
        <rect 
          x="60" y="85" width="20" height="20" 
          className={styles.solarCell}
          style={{ animationDelay: '0.3s' }}
        />
        <rect 
          x="85" y="85" width="20" height="20" 
          className={styles.solarCell}
          style={{ animationDelay: '0.4s' }}
        />
        <rect 
          x="110" y="85" width="20" height="20" 
          className={styles.solarCell}
          style={{ animationDelay: '0.5s' }}
        />
        
        {/* Linha 3 */}
        <rect 
          x="60" y="110" width="20" height="20" 
          className={styles.solarCell}
          style={{ animationDelay: '0.6s' }}
        />
        <rect 
          x="85" y="110" width="20" height="20" 
          className={styles.solarCell}
          style={{ animationDelay: '0.7s' }}
        />
        <rect 
          x="110" y="110" width="20" height="20" 
          className={styles.solarCell}
          style={{ animationDelay: '0.8s' }}
        />
      </svg>
    </div>
  );
};

export default SolarLogo;