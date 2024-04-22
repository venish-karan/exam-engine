import { useState, useEffect } from 'react';
// import axios from '../api/axios';
// import useRefreshToken from '../hooks/useRefreshToken';
import useAxiosPrivate from '../client/src/hooks/useAxiosPrivate';
import { useNavigate, useLocation } from 'react-router-dom';

const USERS = '/users';

const Users = () => {
    const [ users, setUsers ] = useState();
    // const refresh = useRefreshToken();
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();
    
    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getUsers = async () => {
            try {
                const response = await axiosPrivate.get(USERS, {
                    signal: controller.signal
                });
                console.log(response.data);
                isMounted && setUsers(response.data);
            } catch(err) {
                console.log(err);
                navigate('/login', { state: {from:location}, replace: true });
            }
        }
        getUsers();

        return () => {
            isMounted = false;
            controller.abort();
        }
    }, [])
    return (
        <article>
            <h2>Users List</h2>
            {users?.length
                ? (
                    <ul>
                        {users.map((user, i) => <li key={i}>{user?.username}</li>)}
                    </ul>

                ) : (
                    <p>No users to display</p>
                )
            }
            {/* <button onClick={() => refresh()}>Refresh</button> */}
            <br />
        </article>
    )
}

export default Users;