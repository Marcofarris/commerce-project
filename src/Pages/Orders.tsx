
import { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import Table from 'react-bootstrap/Table';

function Orders() {
  const [ordini, setOrdini] = useState([
    { id: 0, user_id: 0, cassa_id: 0, quantita: 0, price: 0 },
  ]);
  const URL = "http://localhost:8000/api";
  const [role, setRole] = useState(sessionStorage.getItem("role"));
 




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

  // {renderOrders} andrà inseriro in una colonna a destra
  return (
    <>
              <Container className="m-5">
                <Row><h2>Tabella ordini</h2></Row>
                <Row className="m-1">
                  {renderOrders()}
                </Row>
              </Container>
    </>
  );
}

export default Orders;