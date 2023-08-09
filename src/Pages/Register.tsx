import { Container } from "react-bootstrap";
import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pwdError, setPwdError] = useState("ok");
  const URL = "http://localhost:8000/api";

  //   useEffect(() => {
  //     fetch(`${URL}/test/`)
  //       .then((res) => res.json())
  //       .then((data) => {
  //         console.log(data);
  //       })
  //       .catch((err) => console.log(err));
  //   }, []);
  //useEffect(() => {}, []);
  const handleSubmit = (e) => {
    e.preventDefault();

    let pwdValida = passwordValidator();
    if (pwdValida == "ok") {
      //Registrazione utente
      const user = { email, password };
      const requestOptions = {
        method: "POST",
        headers: { "Accept": "application/json" },
        body: JSON.stringify({user}),
      };

      fetch(`${URL}/user`, requestOptions).then((res) =>
        console.log(res.json())
      );
    }
    setPwdError(pwdValida);
  };

  //Controllo pwd
  const passwordValidator = () => {
    if (password.trim() == "") {
      return "Password is required";
    } else if (password.length < 8) {
      return "Password must have a minimum 8 characters";
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

  return (
    <>
      <Container>
        <div className="Auth-form-container">
          <form className="Auth-form" onSubmit={handleSubmit}>
            <div className="Auth-form-content">
              <h3 className="Auth-form-title">Register</h3>
              <div className="form-group mt-3">
                <label>Email address</label>
                <input
                  type="email"
                  className="form-control mt-1"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="form-group mt-3">
                <label>Password</label>
                <input
                  type="password"
                  className="form-control mt-1"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {renderPwdError()}
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
