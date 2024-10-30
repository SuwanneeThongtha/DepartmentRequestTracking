import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import DepartmentRequestsInterface from './DepartmentRequestsInterface.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <DepartmentRequestsInterface/>
    </>
  )
}

export default App
