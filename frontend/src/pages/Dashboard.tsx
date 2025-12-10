import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
    const { logout } = useAuth();

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>Dashboard</h1>
                <button onClick={logout}>Déconnexion</button>
            </div>
            <p>Bienvenue sur Track Go</p>
            <div>
                <h3>Fonctionnalités</h3>
                <ul>
                    <li>Gestion de la flotte</li>
                    <li>Création de trajets</li>
                    <li>Rapports</li>
                </ul>
            </div>
        </div>
    );
};

export default Dashboard;