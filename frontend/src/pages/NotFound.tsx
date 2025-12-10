import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>404</h1>
      <p>Page non trouvée</p>
      <button onClick={() => navigate('/')}>
        Retour à l'accueil
      </button>
    </div>
  );
};

export default NotFound;
