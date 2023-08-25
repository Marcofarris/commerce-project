
import { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import { Button, Textarea } from '@chakra-ui/react'
import {urlApi} from '../Costanti';

import {
    FormControl,
    FormLabel,
    Input,
} from '@chakra-ui/react'

function Sms() {
    const [number, setNumber] = useState("");
    const [body, setBody] = useState("");

    const handleSubmit = ()=> {
        let smsData = new FormData();
        smsData.append('number', number);
        smsData.append('body', body);

        fetch(`${urlApi}/send-sms`,
        {
          method: "POST",
          headers: {
            "Accept": "application/json",
          },
          body: smsData,
        }
      ).then((res) => {
        res.json().then((ris) => {
         alert(ris)
        })
      })
    }

    return (
        <>
            <Container className="m-5">
                <FormControl>
                    <FormLabel>Number</FormLabel>
                    <Input type='string' value={number}
                        onChange={(e) => { setNumber(e.target.value) }} />

                    <FormLabel>Content</FormLabel>
                    <Textarea value={body}
                        onChange={(e) => { setBody(e.target.value) }} />

                   
                </FormControl>
                <Button m={5} onClick={() => {
                        handleSubmit()
                    }
                    }
                   >Invia</Button>
            </Container>
        </>
    )
}

export default Sms;