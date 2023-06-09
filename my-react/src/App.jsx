import { useState } from 'react'
import axios from "axios";
import './App.css'

function App() {
  /*If you run from the host machine then you must use "8089" port from the frontend,as frontend rests in the host machine
  and "5000" port from the backend, and you will get access to the backend api from the
  host machine using this "8089" port*/
  // const backendUrl = 'http://localhost:8089/';

  /* Or, you can use vscode port forwarding */
  const backendUrl = 'http://localhost:5000/';


  const [displayValue, setDisplayValue] = useState("");
  const [inputValue, setInputValue] = useState("");

  const createData = async ()=>{
    try{
      const data = await axios.post(backendUrl, {data: inputValue});
      console.log("submitted data", data)
    }catch{
      console.log("Cant create the data")
    }
  }

  const getData = async ()=>{
    const {data} = await axios.get(backendUrl)
    setDisplayValue(data);
    console.log(data);
  }


  const handleClick = async (event)=>{
    event.preventDefault();
    await createData();
    setInputValue("");
  }

  return (
    <>

    <div>
      <input 
      type="text" 
      value={inputValue}
      onChange={(event)=>{setInputValue(event.target.value)}}/>
      <button onClick={handleClick}>Submit</button>
    </div>

    <div>
      <button onClick={()=> getData()}>Get Data</button>
    </div>

    <div style={{ border: "1px solid" }}>
        <h4>{displayValue}</h4>
    </div>

    </>
  )
}

export default App
