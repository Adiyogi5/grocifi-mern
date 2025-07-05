import React from "react";
import { ListGroup, Image, Badge } from "react-bootstrap";

const UserList = ({ users, onSelectUser }) => {
 
  return (
    <div style={{height:"500px", overflow:"auto", }}>
      <ListGroup>
        {users.map((user) => (
            
          <ListGroup.Item
            key={user._id}
            onClick={() => onSelectUser(user)}
            className="d-flex align-items-center justify-content-between"
            style={{ cursor: "pointer", }}
          >
            <div className="d-flex align-items-center">
                <Image
                src={user.profile}
                roundedCircle
                width={40}
                height={40}
                className="me-3 position-relative"
              />
                <div className="">
                    <div className="fw-bold">{user.name}</div>
                    <span className="text-muted text-small">
                    {user?.lastMessage?.length > 20 
                        ? `${user.lastMessage.slice(0, 20)}...` 
                        : user?.lastMessage || "No message available"}
                    </span>
                </div>
                <small className="text-muted position-absolute top-3 start-3">
                    {user.online ? (
                    <span className="text-success">
                        <i className="fa-solid fa-circle"></i>
                    </span>
                    ) : (
                    <span className="text-danger">
                        <i className="fa-solid fa-circle"></i>
                    </span>
                    )}
                </small>
            </div>
            {user.unreadMessages > 0 && (
                <Badge pill bg="danger">
                    {user.unreadMessages}
                </Badge>
            )} 
           
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default UserList;
