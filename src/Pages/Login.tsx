import { Container } from "react-bootstrap";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { useState, useEffect } from "react";

function Login() {

  const [token, setToken] = useOutletContext();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pwdError, setPwdError] = useState("ok");
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
  const URL = "http://localhost:8000/api";

  // const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    let pwdValida = passwordValidator();
    if (pwdValida == "ok") {
      //login utente

      let user = new FormData();
      user.append('email', email);
      user.append('password', password);
      fetch(`${URL}/login`,
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
            window.sessionStorage.setItem("user_id", ris.user.id);
            window.sessionStorage.setItem("role", ris.role);
          } else {
            setPwdError(ris.message)
          }

        })
      );
    }
    setPwdError(pwdValida);
  };


  useEffect(() => {
    if (resUser.token != "") {
      setToken(resUser.token)
      window.sessionStorage.setItem("token", resUser.token);
      //navigate('/commerce')
      window.location.reload();
    }
  }, [{ resUser }]
  );
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
              <h3 className="Auth-form-title">Sign In</h3>
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
              <div className="d-grid gap-2 mt-3">
                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
              </div>
              <p className="forgot-password text-right mt-2">
                Not a member? <Link to="/register">Register</Link>
              </p>
            </div>
          </form>
        </div>
      </Container>
    </>
  );
}

export default Login;
