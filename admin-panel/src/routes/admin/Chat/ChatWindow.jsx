import React, { useEffect, useState } from "react";
import { ListGroup, Form, Button, Card, InputGroup, Image } from "react-bootstrap";
import '../../../assets/css/admin/chat.css'
const ChatWindow = ({ user, selectedUser, messages, setMessages, socket }) => {
    const [message, setMessage] = useState("");

    useEffect(() => {
        const receiveMessageHandler = (msg) => {
            if (msg.sender === selectedUser._id || msg.receiver === selectedUser._id) {
                setMessages((prev) => [...prev, msg]);
            }
        };

        socket.on("receive_message", receiveMessageHandler);

        return () => {
            socket.off("receive_message", receiveMessageHandler);
        };
    }, [selectedUser, setMessages, socket]);

    const sendMessage = () => {
        if (message.trim() && selectedUser) {
            const chatData = { sender: user._id, receiver: selectedUser._id, message };
            socket.emit("send_message", chatData);
            setMessages((prev) => [...prev, chatData]);
            setMessage("");
        }
    };

    return (
        <Card className="chat-window shadow-lg">
            <Card.Header className="chat-header">
                <div className="d-flex align-items-center">
                    <Image src={selectedUser.profile} roundedCircle width="40" height="40" className="me-2" />
                    <h5 className="mb-0">{selectedUser.name}</h5>
                </div>
            </Card.Header>
            <Card.Body className="chat-body">
                <ListGroup className="message-list">
                    {messages.map((msg, index) => {
                        const isSent = msg.sender === user._id;
                        return (
                            <ListGroup.Item
                                key={index}
                                className={`message ${isSent ? "sent" : "received"}`}
                            >
                                {!isSent && (
                                    <Image src={selectedUser.image} roundedCircle width="30" height="30" className="me-2" />
                                )}
                                <div className="message-text">
                                    {msg.message}
                                </div>
                            </ListGroup.Item>
                        );
                    })}
                </ListGroup>
            </Card.Body>
            <Card.Footer className="chat-footer">
                <InputGroup>
                    <Form.Control
                        type="text"
                        placeholder="Type a message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                    />
                    <Button variant="primary" onClick={sendMessage}>Send</Button>
                </InputGroup>
            </Card.Footer>
        </Card>
    );
};

export default ChatWindow;
