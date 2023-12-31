
import { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

import { Select, Stack, Table, TableCaption, TableContainer, Tbody, Td, Tfoot, Th, Thead, Tr } from '@chakra-ui/react'
import {
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from '@chakra-ui/react'
import {Text, SimpleGrid, Input, Button} from '@chakra-ui/react'
import { urlApi } from "../Costanti";


function Commerce() {
  const [carrello, setCarrello] = useState(0);
  const [input, setInput] = useState("");
  const [category, setCategory] = useState("all");
  const [articoli, setArticoli] = useState([
    {id:0, quantita:0, title:"", description:"", price:0, category:""}
  ]);
  const [ordini, setOrdini] = useState([
    { id: 0, user_id: 0, cassa_id: 0, quantita: 0, price: 0 },
  ]);

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

  useEffect(() => {
    getArticles();
  }, []);

  const getArticles = () => {
    fetch(`${urlApi}/articles`,
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

  const getArticlesByCategory = (e_categoria:string) => {
    if (e_categoria == "all") {
      getArticles()
    } else {
      let categoria = new FormData();
      categoria.append('category', e_categoria);

      fetch(`${urlApi}/categoryFilter`,
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

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      let digit = new FormData();
      digit.append('input', input);
      digit.append('category', category);

      fetch(`${urlApi}/findArticles`,
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
    fetch(`${urlApi}/casse`,
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

  const handleSubmit = (price:number, qt:number) => {
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

      fetch(`${urlApi}/ordine`,
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



  const getOrders = () => {
    // Recupero ordini
    if (role == "Admin") {
      fetch(`${urlApi}/ordine`,
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


  return (
    <>
      <SimpleGrid columns={5} spacing={10}>
        {queue.map((el) => ([
          <Container>
            <Row >
              <Text className="d-flex justify-content-center" as='b'>Cassa numero {el.id}</Text>
            </Row>
            <Row className="d-flex justify-content-center">
              <NumberInput size='lg' isReadOnly maxW={32} defaultValue={15} min={10} key={'Input' + el.id} value={el.totale} >
                <NumberInputField />
                <NumberInputStepper >
                </NumberInputStepper>
              </NumberInput>
            </Row>
          </Container>
        ]
        ))}
      </SimpleGrid>

      <TableContainer p={10}>
        <Table variant="striped" colorScheme="teal">
          <TableCaption></TableCaption>
          <Thead>
            <Tr>
              <Th>Titolo : <Input value={input}
                onChange={(e) => {
                  //findArticles(e.target.value)
                  setInput(e.target.value)
                }
                } placeholder='ricerca...' size='sm' width='auto' m={5} /></Th>
              <Th><Select m={1} onChange={e => {
                setCategory(e.target.value)
                getArticlesByCategory(e.target.value)
                setInput("")
              }}>
                <option>all</option>
                <option>elettrodomestici</option>
                <option>musica</option>
                <option>videogiochi</option>
              </Select></Th>
              <Th textAlign="center">Quantità</Th>
              <Th>Prezzo</Th>
            </Tr>
          </Thead>
          <Tbody>
            {articoli.map((el) => ([
              <Tr>
                <Td >{el.title}</Td>
                <Td>{el.category}</Td>
                <Td >
                  <Stack shouldWrapChildren direction='row'>
                    <NumberInput size='lg' value={el.quantita} onChange={(e) => {if(e == ""){el.quantita=0}}}>
                      <NumberInputField  border='10px' boxShadow='md' placeholder="inserisci quantità..."  onChange={(e) => {
                        // Inserisco la quantita come proprietà nell'oggetto articoli
                        const newState = articoli.map((element) => {
                          if (element.id == el.id) {
                            element.quantita = parseInt(e.target.value);
                          }
                          return element;
                        });
                        setArticoli(newState)
                      }
                      } />
                      <NumberInputStepper >
                      </NumberInputStepper>
                    </NumberInput></Stack>

                </Td>
                <Td >{el.price} $</Td>
                <Td>
                  <Button onClick={() => {
                    handleSubmit(el.price, el.quantita)
                    el.quantita = 0;
                  }
                  }
                    key={el.id} colorScheme='red'>Add</Button></Td>
              </Tr>
            ]
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
}

export default Commerce;