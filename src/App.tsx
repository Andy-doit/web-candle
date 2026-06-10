import {BrowserRouter} from "react-router-dom";
import Main from "./views/Main.tsx";
import ScrollToTop from "./components/ScrollToTop.tsx";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

function App() {
  return (
    <GoogleReCaptchaProvider reCaptchaKey="6Lew6MosAAAAAKmhsQtRLqe7xH-Xrz9exhkDEM_A">
      <BrowserRouter>
        <ScrollToTop />
        <Main />
      </BrowserRouter>
    </GoogleReCaptchaProvider>
  );
}

export default App
