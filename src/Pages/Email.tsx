
import { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import { Button, Textarea } from '@chakra-ui/react'

import {
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
    Input,
} from '@chakra-ui/react'

function Email() {
    const [email, setEmail] = useState("");
    const [content, setContent] = useState("");

    const handleSubmit = ()=> {
        let emailData = new FormData();
        emailData.append('email', email);
        emailData.append('content', content);

        fetch(`http://127.0.0.1:8000/api/send-email`,
        {
          method: "POST",
          headers: {
            "Accept": "application/json",
          },
          body: emailData,
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
                    <FormLabel>Email address</FormLabel>
                    <Input type='email' value={email}
                        onChange={(e) => { setEmail(e.target.value) }} />

                    <FormLabel>Content</FormLabel>
                    <Textarea value={content}
                        onChange={(e) => { setContent(e.target.value) }} />

                   
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

export default Email;