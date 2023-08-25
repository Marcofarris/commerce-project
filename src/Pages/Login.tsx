import { Container } from "react-bootstrap";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
//import { useNavigate, useOutletContext } from "react-router-dom";
import { useState, useEffect } from "react";

import {urlApi} from '../Costanti';


function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const handleShowClick = () => setShowPassword(!showPassword);

  // Type 'unknown' must have a '[Symbol.iterator]()' method that returns an iterator
  //const [token, setToken] = useOutletContext();

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


  const handleSubmit = (e:any) => {
    e.preventDefault();
    let pwdValida = passwordValidator();
    if (pwdValida == "ok") {
      //Chiamata login se pwd è valida
      let user = new FormData();
      user.append('email', email);
      user.append('password', password);
      fetch(`${urlApi}/login`,
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


  //Se la risposta contiene il token lo salvo e ricarico la pagina per renderizzare alla pagine Commerce
  useEffect(() => {
    if (resUser.token != "") {
      //setToken(resUser.token)
      window.sessionStorage.setItem("token", resUser.token);
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
      {/* <Flex
      flexDirection="column"
      width="100wh"
      height="100vh"
      backgroundColor="gray.200"
      justifyContent="center"
      alignItems="center"
    >
      <Stack
        flexDir="column"
        mb="2"
        justifyContent="center"
        alignItems="center"
      >
        <Avatar bg="teal.500" />
        <Heading color="teal.400">Welcome</Heading>
        <Box minW={{ base: "90%", md: "468px" }}>
          <form>
            <Stack
              spacing={4}
              p="1rem"
              backgroundColor="whiteAlpha.900"
              boxShadow="md"
            >
              <FormControl>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    children={<CFaUserAlt color="gray.300" />}
                  />
                  <Input type="email" placeholder="email address" />
                </InputGroup>
              </FormControl>
              <FormControl>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    color="gray.300"
                    children={<CFaLock color="gray.300" />}
                  />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                  />
                  <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={handleShowClick}>
                      {showPassword ? "Hide" : "Show"}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <FormHelperText textAlign="right">
                  <Link>forgot password?</Link>
                </FormHelperText>
              </FormControl>
              <Button
                borderRadius={0}
                type="submit"
                variant="solid"
                colorScheme="teal"
                width="full"
              >
                Login
              </Button>
            </Stack>
          </form>
        </Box>
      </Stack>
      <Box>
        New to us?{" "}
        <Link color="teal.500" href="#">
          Sign Up
        </Link>
      </Box>
    </Flex> */}
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
