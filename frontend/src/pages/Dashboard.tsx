import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
    const { logout, user } = useAuth();

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1>Dashboard</h1>
                    <p>Bienvenue, <strong>{user?.nom}</strong> ({user?.role})</p>
                </div>
                <button onClick={logout} style={{ padding: '10px 20px', cursor: 'pointer' }}>
                    Déconnexion
                </button>
            </div>
            
            {/* Contenu Admin */}
            {user?.role === 'admin' && (
                <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#ffe6e6', borderRadius: '8px' }}>
                    <h3>🔧 Panneau Admin</h3>
                    <ul>
                        <li>Gérer les chauffeurs</li>
                        <li>Gérer la flotte</li>
                        <li>Voir les rapports</li>
                    </ul>
                </div>
            )}
            
            {/* Contenu Chauffeur */}
            {user?.role === 'chauffeur' && (
                <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e6ffe6', borderRadius: '8px' }}>
                    <h3>🚚 Espace Chauffeur</h3>
                    <ul>
                        <li>Mes trajets</li>
                        <li>Mon véhicule</li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Dashboard;