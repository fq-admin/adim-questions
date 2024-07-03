import { BrowserRouter, Routes, Route } from 'react-router-dom'
import DisplayQues from './Components/DisplayQues'
import AddQuestion from './Components/AddQuestion'
import ImportQues from './Components/ImportQues'
function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* <VariableContext.Provider value={}> */}
            <Route path="/" element={<DisplayQues/>} />
            <Route path="/add" element={<AddQuestion/>} />
            <Route path="/import" element={<ImportQues/>} />
          {/* </VariableContext.Provider> */}
          </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
