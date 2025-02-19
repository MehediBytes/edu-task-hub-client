import { Route, Routes } from "react-router"
import Root from "./layouts/Root/Root"
import Home from "./pages/Home/Home/Home"

function App() {

  return (
    <Routes>
      <Route path="/" element={<Root></Root>}>
        <Route index element={<Home></Home>}></Route>
      </Route>
    </Routes>
  )
}

export default App
