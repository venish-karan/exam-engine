import { useDispatch, useSelector } from 'react-redux';
import { setAuth } from '../store/slices/AuthSlice';

const useAuth = () => {
    const dispatch = useDispatch();
    const updateAuth = (authData) => {
        dispatch(setAuth(authData));
    }
    const auth = useSelector((state) => state.auth);

    return {auth, updateAuth}; 
}

export default useAuth;