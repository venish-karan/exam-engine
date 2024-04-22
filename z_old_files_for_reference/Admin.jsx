import { Link } from 'react-router-dom';
import Users from './Users';

const Admin = () => {
    return (
        <section>
            <h1>Admin's Page</h1>
            <br />
            <Users />
            <br />
            <div className="flexGrow">
                <Link to="/">Home</Link>
            </div>
        </section>
    )
}