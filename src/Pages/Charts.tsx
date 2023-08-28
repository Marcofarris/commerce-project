
import { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { Button } from "react-bootstrap";
import {urlApi} from '../Costanti';


function Charts() {
    const [dati, setDati] = useState();



    // Recuperare dati da api storico
    useEffect(() => {
        fetch(`${urlApi}/storico`,
            {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token')
                },
            }
        ).then((res) => {
            res.json().then((ris) => {
                //Per un solo oggetto per ogni cassa
                setDati(ris);
            })
        })
    }, []);

    const downloadExcel = ()=> {

    // Recuperare dati da api storico
 
        fetch(`${urlApi}/export/`+sessionStorage.getItem("user_id"),
            {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token')
                },
            }
        ).then(res => res.blob())
            .then(blob => {
                console.log(blob) // Blob{size: 6568, type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}
                //console.log(json) => "is not a valid json"
                let file = window.URL.createObjectURL(blob);
                window.location.assign(file);
            });

    }

    return (
        <>
            <Container className="m-5">
                <Row className="m-5">
                    <LineChart width={500} height={300} data={dati}>
                        <XAxis label={{ value: 'Numero cassa', angle: 0, position: 'central' }} dataKey="cassa_id" />
                        <YAxis label={{ value: 'Prezzo in euro', angle: -90, position: 'insideLeft' }} />
                        <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                        <Line type="monotone" dataKey="totale" stroke="#8884d8" />
                    </LineChart>
                </Row>
                <Row className="m-5">
                    <Col> <Button onClick={downloadExcel} className="btn btn-dark m-1">Download excel</Button>  </Col>
                </Row>
            </Container>
        </>
    )
}

export default Charts;