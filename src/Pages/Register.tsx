import { Container } from "react-bootstrap";
import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import { useNavigate, useOutletContext } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import {urlApi} from '../Costanti';

function Register() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("Guest");
  const [password, setPassword] = useState("");
  const [pwdError, setPwdError] = useState("ok");
  const [nameError, setNameError] = useState("ok");

  // Type 'unknown' must have a '[Symbol.iterator]()' method that returns an iterator
  //const [token, setToken] = useOutletContext();

  const [resUser, setResUser] = useState(
    {
      token: "",
      user: {
        created_at: "",
        email: "",
        email_verified_at: "",
        id: "",
        name: "",
        updated_at: ""
      }
    }
  );


  const navigate = useNavigate();

  const handleSubmit = (e:any) => {
    e.preventDefault();
    let nomeValido = nameValidator();
    let pwdValida = passwordValidator();
    if (pwdValida == "ok" && nomeValido == "ok") {
      //Registrazione utente
      let user = new FormData();
      user.append('name', name);
      user.append('email', email);
      user.append('password', password);
      user.append('role', role)
      fetch(`${urlApi}/user`,
        {
          method: "POST",
          headers: {
            "Accept": "application/json",
          },
          body: user,
        }
      ).then((res) =>
        res.json().then((ris) => {
          if (ris.token) {
            setResUser(ris)
            window.sessionStorage.setItem("role", ris.role)
            window.sessionStorage.setItem("user_id", ris.user.id);
          } else { setPwdError(ris.message) }
        })
      );
    }

    setPwdError(pwdValida);
    setNameError(nomeValido);
  };

  //Se la risposta contiene il token lo salvo e ricarico la pagina per renderizzare alla pagine Commerce
  useEffect(() => {
    if (resUser.token != "") {
      //setToken(resUser.token)
      window.sessionStorage.setItem("token", resUser.token);
      navigate('/commerce')
    }
  }, [{ resUser }]);

  //Controllo pwd
  const passwordValidator = () => {
    if (password.trim() == "") {
      return "Password is required";
    } else if (password.length < 8) {
      return "Password must have a minimum 8 characters";
    }
    return "ok";
  };

  //Controllo name
  const nameValidator = () => {
    if (name.trim() == "") {
      return "Name is required";
    }
    return "ok";
  };



  // Render error pwd
  const renderPwdError = () => {
    if (pwdError != "ok") {
      return (
        <input
          type="text"
          className="form-control mt-1 bg-danger"
          value={pwdError}
        />
      );
    } else {
      null;
    }
  };


  // Render error name
  const renderNameError = () => {
    if (nameError != "ok") {
      return (
        <input
          type="text"
          className="form-control mt-1 bg-danger"
          value={nameError}
        />
      );
    } else {
      null;
    }
  };

  return (
    <>
      <Container>
        <div className="Auth-form-container">
          <form className="Auth-form" onSubmit={handleSubmit}>

            <div className="Auth-form-content">
              <h3 className="Auth-form-title">Register</h3>
              <div className="form-group mt-3">
                <label>Name</label>
                <input
                  type="string"
                  className="form-control mt-1"
                  placeholder="Enter name"
                  onChange={(e) => setName(e.target.value)}
                />
                {renderNameError()}
              </div>
              <div className="form-group mt-3">
                <label>Email address</label>
                <input
                  type="email"
                  className="form-control mt-1"
                  placeholder="Enter email"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="form-group mt-3">
                <label>Password</label>
                <input
                  type="password"
                  className="form-control mt-1"
                  placeholder="Enter password"
                  onChange={(e) => setPassword(e.target.value)}
                />
                {renderPwdError()}
              </div>
              <div className="m-4">
                <label>Role</label>
                <Form.Select size="sm"
                  value={role}
                  onChange={e => {
                    setRole(e.target.value)
                  }}>
                  <option>Guest</option>
                  <option>Admin</option>
                </Form.Select>
              </div>
              <div className="d-grid gap-2 mt-3">
                <Button variant="primary" type="submit">
                  Invia
                </Button>
              </div>
            </div>
          </form>
        </div>
      </Container>
    </>
  );
}

export default Register;
