import React, { useState } from 'react';
import { Card, Row, Col, Form, Button } from 'react-bootstrap';

export default function Profile({ setShowChat, setProfileInfo }) {

    const [name, setName] = useState('');

    const handleLogin = () => {
        if (name && name.length > 3) {
            setShowChat(true);
            setProfileInfo({ name: name, logo: name.charAt(0).toUpperCase(), color: generateRandomColor() });
        } else {
            alert('Enter a valid name...');
        }
    };

    return (
        <Card className='m-5 p-3 text-center w-50'>
            <h3 className='text-danger'>Enter Your Name </h3>
            <Row>
                <Col md={9}>
                    <Form.Control value={name} onChange={(e) => setName(e.target.value)} placeholder='your name..' />
                </Col>
                <Col md={3}>
                    <Button onClick={() => handleLogin()}>Login</Button>
                </Col>
            </Row>
        </Card>
    )
}

const generateRandomColor = () => {
    const red = Math.floor(Math.random() * 256);
    const green = Math.floor(Math.random() * 256);
    const blue = Math.floor(Math.random() * 256);

    const colorCode = '#' + red.toString(16).padStart(2, '0') +
        green.toString(16).padStart(2, '0') +
        blue.toString(16).padStart(2, '0');

    return colorCode;
}
