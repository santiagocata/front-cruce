import { Route, Routes } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import ResponsiveGrid from "./commons/Grid";
import Footer from "./components/Footer";

import SingleView from "./commons/SingleView";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<ResponsiveGrid />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/book/:id" element={<SingleView />} />
      </Routes>
        <Footer />
    </>
  );
}

export default App;

//Armado de rutas momentaneo

/*
<Route path="/login" element={<Login/>}/>
<Route path="/" element={<Home/>}/>
*/
