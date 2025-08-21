// Script de test externe
document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ JavaScript externe chargé avec succès !');
    
    const testBtn = document.getElementById('testBtn');
    const testApiBtn = document.getElementById('testApiBtn');
    const result = document.getElementById('result');
    
    if (testBtn) {
        testBtn.addEventListener('click', () => {
            result.innerHTML = '✅ JavaScript externe fonctionne parfaitement !<br>Heure: ' + new Date().toLocaleTimeString();
        });
    }
    
    if (testApiBtn) {
        testApiBtn.addEventListener('click', async () => {
            result.innerHTML = '⏳ Test de l\'API en cours...';
            
            try {
                const response = await fetch('/api/users-permissions/roles');
                
                if (response.ok) {
                    result.innerHTML = '✅ API accessible !<br>Status: ' + response.status;
                } else {
                    result.innerHTML = '⚠️ API répond mais avec erreur:<br>Status: ' + response.status + ' ' + response.statusText;
                }
            } catch (error) {
                result.innerHTML = '❌ Erreur API:<br>' + error.message;
            }
        });
    }
});
