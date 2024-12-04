import { BrowserRouter, Routes , Route} from "react-router-dom";
import Home from "./components/Home";
import { Quiz } from "./components/Quiz";
import SignIn from "./components/signIn";
import SignupForm from "./components/signUp";
import Admin from "./components/admin";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element ={<Home />} />
        <Route path="/quiz/:id" element={<Quiz />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignupForm />} />
        <Route path="/score/:id" element={<Admin />} />

       </Routes>
    </BrowserRouter>
  );
}
