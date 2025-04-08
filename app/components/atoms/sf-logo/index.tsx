

export default function SfLogo () {

  return (
    <div style={{backgroundColor: '#f9f9', fontSize: '9pt', width: '100px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignContent: 'center', margin: '0 0 0 2rem'}}>
      <p>Sistema</p>      
      <div style={{height:'65px', width: '100px'}}>
        <svg width="100" height="100" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">

          <text x="50" y="100" fontFamily="Arial" fontSize="80" fill="black" fontWeight="bold">S</text>
          <text x="100" y="100" fontFamily="Arial" fontSize="80" fill="blue" fontWeight="bold">F</text>
          
          
          <line x1="130" y1="40" x2="170" y2="10" stroke="orange" strokeWidth="5"/>
          <line x1="130" y1="60" x2="180" y2="60" stroke="orange" strokeWidth="5"/>
          <line x1="130" y1="80" x2="170" y2="110" stroke="orange" strokeWidth="5"/>

        </svg>
      </div>
      <p style={{display: 'flex', justifyContent: 'flex-end'}}>Fotovoltaico</p>    
    </div>
  )
}