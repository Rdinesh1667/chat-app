import { Button, Card, Col, Form, Row, OverlayTrigger, Tooltip, Dropdown } from 'react-bootstrap';
import io from 'socket.io-client';
import React, { useEffect, useState, useRef } from 'react';

const socket = io("http://192.168.29.196:3005", {
    autoConnect: true
});
socket.connect();

function ChatBox(props) {
    const [message, setMessage] = useState("");
    const [profileInfo, setProfileInfo] = useState(props?.profileInfo);
    const [receivedMsg, setReceivedMsg] = useState([]);
    const [clients, setClients] = useState({});
    const [selectedClient, setSelectedClient] = useState("");
    const chatRef = useRef(null);

    const sendMessage = () => {
        if (!selectedClient) {
            alert("Please select a client to send the message to.");
            return;
        }
        setMessage('');
        setReceivedMsg(prevState => [...prevState, { message, send: true, ...profileInfo, to: selectedClient }]);
        socket.emit("send_message", { message, send: true, ...profileInfo, to: selectedClient });
        handelScroll();
    };

    const handelScroll = () => {
        chatRef?.current?.lastChild?.scrollIntoView({
            behavior: 'smooth',
        });
    };

    useEffect(() => {
        socket.emit("set_profile", profileInfo);

        return () => {
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
        socket.on("receive_message", (data) => {
            setReceivedMsg(prevState => [...prevState, data]);
            handelScroll();
        });

        socket.on("clients_list", (clients) => {
            setClients(clients);
        });
    }, []);

    const handelEnter = (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    };

    const handleClientSelect = (clientId) => {
        setSelectedClient(clientId);
    };

    return (
        <div>
            <div className='d-flex align-items-center'>
                <Col md={11} className='text-danger'><h1 className='ms-5'>SELUKA</h1></Col>
                <Col md={1}>
                    <OverlayTrigger placement='auto' overlay={<Tooltip>{profileInfo.name}</Tooltip>}>
                        <h2 className='text-center m-0 bg-transparent me-2 border rounded-circle' style={{ color: profileInfo.color, width: '2.5rem', cursor: 'pointer' }}>{profileInfo.logo}</h2>
                    </OverlayTrigger>
                </Col>
            </div>
            <Card className="m-5 mt-0 p-5">
                <h2 className='mt-2 text-center text-warning'>Chats</h2>
                <Card className='p-3 pb-5' ref={chatRef} style={{ height: '50vh', overflow: 'auto' }}>
                    {receivedMsg.length > 0 && receivedMsg.map((data, index) => (
                        <ChatMessage key={index} data={data} />
                    ))}
                </Card>
                <Row className='mt-3'>
                    <Col>
                        <Form.Control value={message} placeholder="send message.." onKeyDown={(e) => handelEnter(e)} onChange={(e) => {
                            setMessage(e.target.value);
                        }} />
                    </Col>
                    <Col>
                        <Button variant="primary" onClick={() => sendMessage()}>
                            send message
                        </Button>
                    </Col>
                    <Col>
                        <Dropdown>
                            <Dropdown.Toggle variant="success" id="dropdown-basic">
                                {selectedClient ? clients[selectedClient]?.name : "Select Client"}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                {Object.entries(clients).filter(([clientId]) => clientId !== socket.id).map(([clientId, clientInfo]) => (
                                    <Dropdown.Item key={clientId} onClick={() => handleClientSelect(clientId)}>
                                        {clientInfo.name}
                                    </Dropdown.Item>
                                ))}
                            </Dropdown.Menu>
                        </Dropdown>
                    </Col>
                </Row>
            </Card>
        </div>
    );
}

export default ChatBox;

const ChatMessage = ({ data }) => (
    <div className={`d-flex align-items-center m-1 ${data.send && 'flex-row-reverse text-start'}`}>
        <OverlayTrigger overlay={<Tooltip>{data.name}</Tooltip>}>
            <h2 className='text-center m-0 bg-transparent mx-2 border rounded-circle' style={{ color: data.color, width: '2.5rem', cursor: 'pointer' }}>{data.logo}</h2>
        </OverlayTrigger>
        <div className='p-2' style={{ maxWidth: '50vw' }}>
            <p className={'text-secondary m-0'}>{data.message}</p>
        </div>
    </div>
);
