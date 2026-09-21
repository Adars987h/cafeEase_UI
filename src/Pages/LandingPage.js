import "../CSS/LandingPage.css";
import Home from "../Components/LandingPageComponents/Home";
import LoginRegister from "../Components/LandingPageComponents/Login_Register";
import Category from "../Components/LandingPageComponents/Category";
import Story from "../Components/LandingPageComponents/Story";
import Contact from "../Components/LandingPageComponents/Contact";
import Footer from "../Components/LandingPageComponents/Footer";
import Navbar from "../Components/LandingPageComponents/Navbar";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function LandingPage() {
  return (
    <div className="App">
      <ToastContainer/>
      <Navbar />
      <Home />
      <LoginRegister />
      
      <Category />
      <Story />
      <Contact />
      <Footer />
    </div>
  );
}

export default LandingPage;
