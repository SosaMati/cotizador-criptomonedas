import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { monedas } from '../data/monedas';
import { useSelectMonedas } from '../hooks/useSelectMonedas';
import { Error } from './Error';




const InputSubmit = styled.input`
  background-color: #9497FF;
  border: none;
  width: 100%;
  padding: 10px;
  color: #FFF;
  font-weight: 700;
  text-transform: uppercase;
  font-size: 20px;
  border-radius: 5px;
  transition: background-color .3s ease;
  margin-top: 30px;

  &:hover {
    background-color: #7A7DFE;
    cursor: pointer;
  }
`

export const Formulario = ({ setMonedas }) => {

  const [ criptos, setCriptos ] = useState([]);
  const [ error, setError ] = useState(false);

  
  // Utilizar custom hook, no importa el nombre que le pongamos, pero el orden si es importante moneda es state
  const [ moneda, SelecMonedas ] = useSelectMonedas('Elige tu Moneda', monedas); 
  const [ criptomoneda, SelectCriptomoneda ] = useSelectMonedas('Elige tu Criptomoneda', criptos); 
  
  useEffect(() => {
    
    const consultarApi = async () => {
      const url ='https://min-api.cryptocompare.com/data/top/mktcapfull?limit=20&tsym=USD';
      const respuesta = await fetch(url); // fetch es una api nativa de javascript
      const resultado = await respuesta.json();

      const arrayCriptos = resultado.Data.map(cripto => {
        const Objecto = {
          id: cripto.CoinInfo.Name,
          nombre: cripto.CoinInfo.FullName
        }
        return Objecto;
      })
      setCriptos(arrayCriptos); //Guardamos los datos de las criptomonedas en el state
    }
    consultarApi(); 
  
   
  }, []) //como no hay dependencias, solo se ejecuta una vez cuando se carga el componente
  
  const handleSubmit = e => {
    e.preventDefault();
    if([moneda, criptomoneda].includes('')){
      setError(true);
      return;
    }
    setError(false); // si pasa la validacion, se cambia el state a false
    setMonedas({ // se envia el state al componente principal
      moneda,
      criptomoneda
    })
  }
  

  return (

    <>
      { error && <Error>Todos los campos son obligatorios</Error> }

      <form
        onSubmit={ handleSubmit }
      >

          <SelecMonedas />
          <SelectCriptomoneda />

          <InputSubmit 
            type='submit' value='Cotizar'
          />

      </form>
    </>
  )
}
