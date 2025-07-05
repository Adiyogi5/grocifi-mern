import React from 'react'
import { RouterProvider } from "react-router-dom";
import router from './router';
import Loader from './components/Website/Loader';
import { store } from './store'
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import CommonProvider from './layouts/CommonProvider';
import ErrorBoundary from './routes/Errors/ErrorBoundary';

const App = () => {

    return (
        <ErrorBoundary>
            <Provider store={store}>
                <CommonProvider>
                    <RouterProvider router={router} fallbackElement={<Loader />} />
                    <ToastContainer />
                </CommonProvider>
            </Provider>
        </ErrorBoundary>
    )
}

export default App