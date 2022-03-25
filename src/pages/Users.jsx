import { useState, useEffect } from "react";
import { db } from "../firebase-config";
import { collection, getDocs } from "firebase/firestore";

import "../App.css";

function App() {
  const usersCollectionRef = collection(db, "users");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const getUsers = async () => {
      const userData = await getDocs(usersCollectionRef);
      setUsers(userData.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getUsers();
  }, []);

  return (
    <div>
      <div className="content">
        <div id="users">
          <h1>Users</h1>
          {users.map((user) => {
            return (
              <div key={user.id}>
                <h2>Name: {user.name}</h2>
                <h2>Surname: {user.surname}</h2>
                <h3>Role: {user.role}</h3>
                <br></br>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
