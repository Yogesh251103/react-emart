import { useState } from 'react'
import './App.css'
import { RouterProvider } from 'react-router-dom'
import router from './router/router'
import { RecoilRoot } from 'recoil'
import { SnackbarProvider } from './contexts/SnackbarContexts'

function App() {
  const [count, setCount] = useState(0)

  return (
    <RecoilRoot>
      <SnackbarProvider>
        <RouterProvider router={router}/>
      </SnackbarProvider>
    </RecoilRoot>
  )
}

export default App
