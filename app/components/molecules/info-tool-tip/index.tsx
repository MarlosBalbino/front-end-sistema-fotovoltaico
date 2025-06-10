'use client'

import React, { useEffect, useRef, useState } from 'react';
import { TbInfoCircle } from 'react-icons/tb';
import styles from './style.module.css';

interface InfoTooltipProps {
  text: string;
  iconSize?: number;
}

const InfoTooltip: React.FC<InfoTooltipProps> = ({ text, iconSize = 20 }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  return (
    <div className={styles.container} ref={ref}>
      <button type='button' className={styles.iconButton} onClick={() => setOpen((prev) => !prev)}>
        <TbInfoCircle size={iconSize} />
      </button>
      {open && (
        <div className={styles.tooltip}>
          {text.split('\n').map((line, idx) => (
            <React.Fragment key={idx}>
              {line}
              <br />
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};

export default InfoTooltip;
