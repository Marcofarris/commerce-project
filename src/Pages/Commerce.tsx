
import { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import Table from 'react-bootstrap/Table';
import Charts from "./Charts";


function Commerce() {
  const [carrello, setCarrello] = useState();
  const [input, setInput] = useState("");
  const [category, setCategory] = useState("all");
  const [articoli, setArticoli] = useState([]);
  const [ordini, setOrdini] = useState([
    { id: 0, user_id: 0, cassa_id: 0, quantita: 0, price: 0 },
  ]);
  const URL = "http://localhost:8000/api";
  const [role, setRole] = useState(sessionStorage.getItem("role"));
  const [queue, setQueue] = useState([
    { id: 1, totale: 0 },
    { id: 2, totale: 0 },
    { id: 3, totale: 0 },
    { id: 4, totale: 0 },
    { id: 5, totale: 0 },
  ]);

  // Recupero casse
  useEffect(() => {
    getCarts();
  }, []);

  // useEffect(() => {
  //   getArticlesByCategory();
  // }, [category]);


  useEffect(() => {
    getArticles();
  }, []);

  const getArticles = () => {
    fetch(`http://127.0.0.1:8000/api/articles`,
      {
        method: "GET",
        headers: {
          "Accept": "application/json",
          'Authorization': 'Bearer ' + sessionStorage.getItem('token')
        },
      }
    ).then((res) => {
      res.json().then((ris) => {
        setArticoli(ris)
        articoli.map((el) => {
          el.quantita = 0;
        })
      })
    })
  }

  const getArticlesByCategory = (e_categoria) => {
    if (e_categoria == "all") {
      getArticles()
    } else {
      let categoria = new FormData();
      categoria.append('category', e_categoria);

      fetch(`http://127.0.0.1:8000/api/categoryFilter`,
        {
          method: "POST",
          headers: {
            "Accept": "application/json",
          },
          body: categoria,
        }
      ).then((res) => {
        res.json().then((ris) => {
          setArticoli(ris)
          articoli.map((el) => {
            el.quantita = 0;
          })
        })
      })
    }
  }

  // // Ricerca articolo
  // const findArticles = (e_input) => {
  //   setInput(e_input)
  //   let digit = new FormData();
  //   digit.append('input', e_input);
  //   digit.append('category', category);

  //   fetch(`http://127.0.0.1:8000/api/findArticles`,
  //     {
  //       method: "POST",
  //       headers: {
  //         "Accept": "application/json",
  //       },
  //       body: digit,
  //     }
  //   ).then((res) => {
  //     res.json().then((ris) => {
  //       setArticoli(ris)
  //       articoli.map((el) => {
  //         el.quantita = 0;
  //       })
  //     })
  //   })
  // }

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      let digit = new FormData();
      digit.append('input', input);
      digit.append('category', category);
  
      fetch(`http://127.0.0.1:8000/api/findArticles`,
        {
          method: "POST",
          headers: {
            "Accept": "application/json",
          },
          body: digit,
        }
      ).then((res) => {
        res.json().then((ris) => {
          setArticoli(ris)
          articoli.map((el) => {
            el.quantita = 0;
          })
        })
      })
    }, 2000)

    return () => clearTimeout(delayDebounceFn)
  }, [input])

  const getCarts = () => {
    fetch(`${URL}/casse`,
      {
        method: "GET",
        headers: {
          "Accept": "application/json",
          'Authorization': 'Bearer ' + sessionStorage.getItem('token')
        },
      }
    ).then((res) => {
      res.json().then((ris) => {
        setQueue(ris)
      })
    }
    );
  }

  const handleSubmit = (price, qt) => {
    //event.preventDefault();
    //onst checkout = event.target[0].value;
    const minQueue = queue.reduce((prev, curr) =>
      prev.totale < curr.totale ? prev : curr
    );

    // const newState = queue.map((element) => {
    //   if (element.id == minQueue.id) {
    //     element.totale += parseInt(checkout);
    //   }
    //   return element;
    // });

    //Inviare user_id, cassa_id, quantita(ovvero carrello)
    if (qt > 0) {
      let ordine = new FormData();
      ordine.append('user_id', String(sessionStorage.getItem('user_id')));
      ordine.append('cassa_id', String(minQueue.id));
      ordine.append('quantita', String(qt));
      ordine.append('price', String(price));

      fetch(`${URL}/ordine`,
        {
          method: "POST",
          headers: {
            "Accept": "application/json",
            'Authorization': 'Bearer ' + sessionStorage.getItem('token')
          },
          body: ordine,
        }
      ).then((res) => {
        res.json().then((ris) => {
          getCarts();
          getOrders();
        })
      }
      );
      //setQueue(newState);
      getCarts();
      setCarrello(0);
    } else {
      alert("Devi inserire una quantità positiva")
    }

  };

  const buy = (id, cassa_id) => {
    // 
    let acquisto = new FormData();
    acquisto.append('order_id', String(id));
    acquisto.append('cassa_id', String(cassa_id));
    acquisto.append('user_id', String(sessionStorage.getItem("user_id")));

    fetch(`${URL}/acquista`,
      {
        method: "POST",
        headers: {
          "Accept": "application/json",
          'Authorization': 'Bearer ' + sessionStorage.getItem('token')
        },
        body: acquisto,
      }
    ).then((res) => {
      res.json().then((ris) => {
        // Richiama fetch get orders
        getOrders();
        getCarts();
      })
    }
    );
  }

  const getOrders = () => {
    // Recupero ordini
    if (role == "Admin") { // Diverso per prova
      fetch(`${URL}/ordine`,
        {
          method: "GET",
          headers: {
            "Accept": "application/json",
            'Authorization': 'Bearer ' + sessionStorage.getItem('token')
          }
        }
      ).then((res) => {
        res.json().then((ris) => {
          if (ris != "Non autorizzato") { setOrdini(ris); }
        })
      }
      );
    }
  }
  useEffect(() => {
    getOrders();
  }, []);

  const renderOrders = () => {
    //Attenzione, ho invertito per prova
    if (role == "Admin") {
      return <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Cassa</th>
            <th>Quantità</th>
            <th>Prezzo</th>
          </tr>
        </thead>
        <tbody>
          {ordini.map((el) => ([
            <tr>
              <td >{el.user_id}</td>
              <td >{el.cassa_id}</td>
              <td >{el.quantita}</td>
              <td >{el.price} $</td>
              <td><Button onClick={() => buy(el.id, el.cassa_id)} key={el.id} className="btn btn-dark m-1">Buy</Button></td>
            </tr>
          ]
          ))}

        </tbody>
      </Table>
    }
  }


  return (
    <>
      <Container className="m-5">
        <Row>
          {queue.map((el) => ([
            <Col className="border m-1 bg-success">
              <input type="number" key={'Input' + el.id} value={el.totale} readOnly className="m-1" />
            </Col>
          ]
          ))}
        </Row>
        <Row>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Title: <InputGroup className="mb-3">
                  <Form.Control
                    type="string"
                    value={input}
                    onChange={(e) => {
                      //findArticles(e.target.value)
                     setInput(e.target.value)
                    }
                    }
                  />
                </InputGroup></th>
                <th>Category:  <Form.Select size="sm"
                  //value={category}
                  onChange={e => {
                    setCategory(e.target.value)
                    getArticlesByCategory(e.target.value)
                    setInput("")
                  }}>
                  <option>all</option>
                  <option>elettrodomestici</option>
                  <option>musica</option>
                  <option>videogiochi</option>
                </Form.Select></th>
                <th>Quantità</th>
                <th>Prezzo</th>
              </tr>
            </thead>
            <tbody>
              {articoli.map((el) => ([
                <tr>
                  <td >{el.title}</td>
                  <th>{el.category}</th>
                  <td > <InputGroup className="mb-3">
                    <Form.Control
                      type="number"
                      aria-label="Amount"
                      value={el.quantita}
                      onChange={(e) => {
                        // Inserisco la quantita come proprietà nell'oggetto articoli
                        const newState = articoli.map((element) => {
                          if (element.id == el.id) {
                            element.quantita = e.target.value;
                          }
                          return element;
                        });
                        setArticoli(newState)
                      }
                      }
                    />
                  </InputGroup> </td>
                  <td >{el.price} $</td>
                  <td>
                    <Button onClick={() => {
                      handleSubmit(el.price, el.quantita)
                      el.quantita = '';
                    }
                    }
                      key={el.id} className="btn btn-dark m-1">Add</Button></td>
                </tr>
              ]
              ))}

            </tbody>
          </Table>
        </Row>
        <Row className="m-5">
          {renderOrders()}
        </Row>
      </Container>
    </>
  );
}

export default Commerce;