import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Commerce from "./Pages/Commerce";
import Layout from "./Pages/Layout";
import Charts from "./Pages/Charts";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import { useEffect, useState } from "react";
import { UserContext } from "./UserContext"


function App() {

  const [token, setToken] = useState(window.sessionStorage.getItem("token"));

  const PrivateRoute = (percorso: string, component) => {
    //Creare fetch per prendere tokenServer?
    // If(tokenSession == tokenServer?)
    if (window.sessionStorage.getItem("token") != null) {
      return <Route index path={percorso} element={component} />
    }
    return <Route path={percorso} element={<Navigate replace to="/login" />} />
  };

  const GuestRoute = (percorso: string, component) => {
    //Creare fetch per prendere tokenServer?
    // If(tokenSession == tokenServer?)
    if (window.sessionStorage.getItem("token") != null) {
      return <Route path={percorso} element={<Navigate replace to="/commerce" />} />
    }
    return <Route index path={percorso} element={component} />
  };


  return (

    <BrowserRouter>
      <UserContext.Provider value={[token, setToken]}>
        <Routes>
          <Route path="/" element={<Layout />}>
            {PrivateRoute("commerce", <Commerce />)}
            {PrivateRoute("charts", <Charts />)}
            {GuestRoute("login", <Login />)}
            {GuestRoute("register", <Register />)}
          </Route>
        </Routes>
      </UserContext.Provider>
    </BrowserRouter>
  );
}

export default App;

