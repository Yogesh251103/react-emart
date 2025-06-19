import { useState } from 'react'
import './App.css'
import { RouterProvider } from 'react-router-dom'
import router from './router/router'
import { RecoilRoot } from 'recoil'

function App() {
  const [count, setCount] = useState(0)

  return (
    <RecoilRoot>
      <RouterProvider router={router}/>
    </RecoilRoot>
  )
}

export default App
