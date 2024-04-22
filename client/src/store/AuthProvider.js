import React from 'react';
import { Provider } from 'react-redux';
import Store from './Store';

const AuthProvider = ({children}) => {
    return (
        <Provider store={Store}>
            {children}
        </Provider>
    )
}

export default AuthProvider;