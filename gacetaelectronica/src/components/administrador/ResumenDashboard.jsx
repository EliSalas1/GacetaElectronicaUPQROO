import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaUser, FaFileAlt, FaCogs, FaUserPlus } from 'react-icons/fa';

const API_URL = '/api';

export default function ResumenDashboard() {
  const [usuarios, setUsuarios] = useState([]);
  const [articulos, setArticulos] = useState([]);
  const [errorUsuarios, setErrorUsuarios] = useState(null);
  const [errorArticulos, setErrorArticulos] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usuariosRes = await axios.get(`${API_URL}/usuarios`);
        if (Array.isArray(usuariosRes.data)) {
          setUsuarios(usuariosRes.data);
          console.log('Usuarios cargados:', usuariosRes.data);
        } else {
          throw new Error('usuarios no es un arreglo');
        }
      } catch (error) {
        setErrorUsuarios('Error al cargar usuarios');
        console.error(error);
      }

      try {
        const articulosRes = await axios.get(`${API_URL}/articulos`);
        if (Array.isArray(articulosRes.data)) {
          setArticulos(articulosRes.data);
          console.log('Artículos cargados:', articulosRes.data);
        } else {
          throw new Error('artículos no es un arreglo');
        }
      } catch (error) {
        setErrorArticulos('Error al cargar artículos');
        console.error(error);
      }
    };

    fetchData();
  }, []);
const totalUsuarios = usuarios?.length ?? 0;

const totalArticulos = articulos?.filter(
  a => a.estatus?.toLowerCase() === 'aprobado'
).length ?? 0;

const articulosEnRevision = articulos?.filter(
  a => a.estatus?.toLowerCase() === 'pending' || a.estatus?.toLowerCase() === 'en revisión'
).length ?? 0;

const redactoresActivos = usuarios?.filter(
  u => u.rol?.toLowerCase() === 'autor' && u.estado?.toLowerCase() === 'activo'
).length ?? 0;


  const Card = ({ title, icon, value, error }) => (
    <div className="bg-white rounded-lg shadow p-6 w-full sm:w-auto">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-md font-semibold">{title}</h3>
        {icon}
      </div>
      {error ? (
        <p className="text-red-500 text-sm">{error}</p>
      ) : (
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      )}
    </div>
  );

  return (
    <div className="flex flex-wrap gap-4 mt-5">
      <Card
        title="Total Usuarios"
        icon={<FaUser className="text-gray-400" />}
        value={totalUsuarios}
        error={errorUsuarios}
      />
      <Card
        title="Artículos Publicados"
        icon={<FaFileAlt className="text-gray-400" />}
        value={totalArticulos}
        error={errorArticulos}
      />
      <Card
        title="En Revisión"
        icon={<FaCogs className="text-gray-400" />}
        value={articulosEnRevision}
        error={errorArticulos}
      />
      <Card
        title="Redactores Activos"
        icon={<FaUserPlus className="text-gray-400" />}
        value={redactoresActivos}
        error={errorUsuarios}
      />
    </div>
  );
}
