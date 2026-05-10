import axios from './axios';

export const dashboardService = {
    getEstadisticasGenerales: async () => {
        const response = await axios.get('/dashboard/stats/generales');
        return response.data;
    },
    getEstudiantesPorGrado: async () => {
        const response = await axios.get('/dashboard/stats/estudiantes-por-grado');
        return response.data;
    },
    getEstudiantesPorNivel: async () => {
        const response = await axios.get('/dashboard/stats/estudiantes-por-nivel');
        return response.data;
    },
    getPromedioNotas: async (idPeriodoAcademico, bimestre) => {
        const response = await axios.get(`/dashboard/stats/promedio-notas?idPeriodoAcademico=${idPeriodoAcademico}&bimestre=${bimestre}`);
        return response.data;
    },
    getAsistencia: async (idGradoSeccion, fecha) => {
        const response = await axios.get(`/dashboard/stats/asistencia?idGradoSeccion=${idGradoSeccion}&fecha=${fecha}`);
        return response.data;
    },
    getIngresosPorPeriodo: async (idPeriodoAcademico) => {
        const response = await axios.get(`/dashboard/stats/ingresos/periodo/${idPeriodoAcademico}`);
        return response.data;
    },
    getTotalDeudas: async () => {
        const response = await axios.get('/dashboard/stats/deudas/total');
        return response.data;
    },
    getIngresosPorMes: async (anio) => {
        const response = await axios.get(`/dashboard/stats/ingresos-por-mes/${anio}`);
        return response.data;
    },
    getTopDeudores: async (limite = 10) => {
        const response = await axios.get(`/dashboard/stats/top-deudores?limite=${limite}`);
        return response.data;
    },
    getReporteNotas: async (idEstudiante, idPeriodoAcademico) => {
        const response = await axios.get(`/dashboard/reportes/notas/estudiante/${idEstudiante}?idPeriodoAcademico=${idPeriodoAcademico}`);
        return response.data;
    },
    getReportePagos: async (idEstudiante, idPeriodoAcademico) => {
        const response = await axios.get(`/dashboard/reportes/pagos/estudiante/${idEstudiante}?idPeriodoAcademico=${idPeriodoAcademico}`);
        return response.data;
    },
    getReporteAsistencia: async (idGradoSeccion, fechaInicio, fechaFin) => {
        const response = await axios.get(`/dashboard/reportes/asistencia/grado/${idGradoSeccion}?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`);
        return response.data;
    }
};