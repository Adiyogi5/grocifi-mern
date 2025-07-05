import React, { useState, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';
import { Container, Row, Col } from 'react-bootstrap';
import AxiosHelper from '../../../helper/AxiosHelper';
import { fetchUsersWithUnreadMessge } from '../../../helper/ApiService';
import UserList from './UserList';
import ChatWindow from './ChatWindow';
import { useSelector } from 'react-redux';
import ChatSearch from './ChatSearch';

const socket = io('http://localhost:9000', { autoConnect: false }); // Avoid auto-connect

const ChatApp = () => {
    const user = useSelector(store => store.admin);

    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        if (!user) return;

        socket.connect(); // Manually connect

        // Emit user connected event
        socket.emit('user_connected', user._id);

        // Fetch user list
        fetchUserList();

        // Listen for updated user list
        const updateUsersHandler = (users) => setUsers(users);
        socket.on('update_users', updateUsersHandler);

        // Cleanup on unmount
        return () => {
            socket.off('update_users', updateUsersHandler);
            socket.disconnect(); // Disconnect on unmount
        };
    }, [user]); // Re-run when user changes

    // Fetch user list with useCallback to prevent unnecessary renders
    const fetchUserList = useCallback(async () => {
        try {
            const data = await fetchUsersWithUnreadMessge();
            setUsers(data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    }, []);

    // Load chat messages when a user is selected
    const loadChat = useCallback(async (receiver) => {
        try {
            const { data } = await AxiosHelper.getData(`messages/${user._id}/${receiver._id}`);
            setMessages(data.data);
            setSelectedUser(receiver);
        } catch (error) {
            console.error("Error loading chat:", error);
        }
    }, [user]);

    return (
        <Container className="mt-4">
            <div className='card'>
                <Row>
                    <Col md={4}>
                        <ChatSearch />
                        <UserList users={users} onSelectUser={loadChat} />
                    </Col>
                    <Col md={8}>
                        {selectedUser && <ChatWindow 
                            user={user} 
                            selectedUser={selectedUser} 
                            messages={messages} 
                            setMessages={setMessages} 
                            socket={socket} 
                        />}
                    </Col>
                </Row>
            </div>
        </Container>
    );
};

export default ChatApp;
