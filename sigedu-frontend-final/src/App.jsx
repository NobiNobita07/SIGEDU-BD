import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Estudiantes from './pages/Estudiantes';
import Apoderados from './pages/Apoderados';
import Docentes from './pages/Docentes';
import Cursos from './pages/Cursos';
import Grados from './pages/Grados';
import Matriculas from './pages/Matriculas';
import Notas from './pages/Notas';
import Asistencias from './pages/Asistencias';
import Pagos from './pages/Pagos';
import Reportes from './pages/Reportes';
import HorariosDocentes from './pages/HorariosDocentes';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route element={<ProtectedRoute />}>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/apoderados" element={<Apoderados />} />
                        <Route path="/estudiantes" element={<Estudiantes />} />
                        <Route path="/docentes" element={<Docentes />} />
                        <Route path="/cursos" element={<Cursos />} />
                        <Route path="/grados" element={<Grados />} />
                        <Route path="/matriculas" element={<Matriculas />} />
                        <Route path="/notas" element={<Notas />} />
                        <Route path="/asistencias" element={<Asistencias />} />
                        <Route path="/pagos" element={<Pagos />} />
                        <Route path="/reportes" element={<Reportes />} />
                        <Route path="/horarios" element={<HorariosDocentes />} />
                    </Route>
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
