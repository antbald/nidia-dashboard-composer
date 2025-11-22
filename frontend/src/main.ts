import './components/App';

// Version-based cache invalidation
const CURRENT_VERSION = '0.5.0'; // This will be manually updated with each release
const VERSION_KEY = 'nidia_dashboard_composer_version';

const storedVersion = localStorage.getItem(VERSION_KEY);
if (storedVersion !== CURRENT_VERSION) {
    console.log(`Nidia Dashboard Composer: Version changed from ${storedVersion} to ${CURRENT_VERSION}, clearing cache...`);
    localStorage.setItem(VERSION_KEY, CURRENT_VERSION);

    // Clear service worker cache if available
    if ('caches' in window) {
        caches.keys().then(names => {
            names.forEach(name => {
                if (name.includes('nidia') || name.includes('dashboard-composer')) {
                    caches.delete(name);
                }
            });
        });
    }

    // Force reload without cache on first load after version change
    if (storedVersion !== null) {
        console.log('Nidia Dashboard Composer: Forcing hard reload...');
        window.location.reload();
    }
}

// Register the panel
customElements.whenDefined('nidia-dashboard-composer-panel').then(() => {
    console.log(`Nidia Dashboard Composer v${CURRENT_VERSION} panel loaded`);
});
