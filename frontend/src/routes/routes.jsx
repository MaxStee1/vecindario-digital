import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage'; 
import RegisterPage from '../pages/RegisterPage';
import AdminPage from '../pages/AdminPage';
import LocatarioPage from '../pages/LocatarioPage';
import CompradorPage from '../pages/CompradorPage';
import PrivateRoute from './PrivateRoute'; // Importa el componente de ruta privada

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path='/' element={<HomePage />} />
                <Route path='/login' element={<LoginPage />} />
                <Route path='/register' element={<RegisterPage />} />
                
                <Route
                    path='/admin'
                    element={<PrivateRoute element={<AdminPage />} />}
                />

                <Route
                    path='/comprador'
                    element={<PrivateRoute element={<CompradorPage />} />}
                />

                <Route
                    path='/locatario'
                    element={<PrivateRoute element={<LocatarioPage />} />}  
                />

            </Routes>
        </Router>
    );
};

export default AppRoutes;