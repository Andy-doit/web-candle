import { BrowserRouter } from "react-router-dom";
import Main from "./views/Main.tsx";
import { ScrollToTop } from "./components";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Main></Main>
    </BrowserRouter>
  )
}

export default App
