
import { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";


function Commerce() {
  const [carrello, setCarrello] = useState(0);

  const [queue, setQueue] = useState([
    { id: 0, count: 4 },
    { id: 1, count: 2 },
    { id: 2, count: 0 },
    { id: 3, count: 1 },
    { id: 4, count: 0 },
  ]);

  const handleSubmit = (event) => {
    event.preventDefault();

    const checkout = event.target[0].value;

    const minQueue = queue.reduce((prev, curr) =>
      prev.count < curr.count ? prev : curr
    );

    const newState = queue.map((element) => {
      if (element.id == minQueue.id) {
        element.count += parseInt(checkout);
      }
      return element;
    });
    setQueue(newState);
    setCarrello(0);
  };

  return (
    <>
      <Container>
        <form onSubmit={handleSubmit}>
          <Row>
            <Col>
              <InputGroup className="mb-3">
                <Form.Control
                  type="number"
                  aria-label="Amount"
                  value={carrello}
                  onChange={(e) => setCarrello(e.target.value)}
                />
                <InputGroup.Text>Prodotti</InputGroup.Text>
              </InputGroup>
            </Col>
            <Col>
              <Button variant="primary" type="submit">
                Invia
              </Button>
            </Col>
          </Row>
        </form>
        <Row>
          <Col>
            {queue.map((el) => (
              <input type="number" key={el.id} value={el.count} className="m-1" />
            ))}
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Commerce;