import { useState } from 'react'
import Button from './components/ui/Button'
import Loader from './components/ui/loader'
import Input from './components/ui/Input'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <div>
      <p className='bg-yellow-500'>Hello</p>
      {/* <Loader size="medium"/> */}
    </div>
    </>
  )
}

export default App
