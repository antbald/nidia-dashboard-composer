console.log('Nidia Dashboard Composer: Module script executing...');
import './components/App';

// Register the panel
customElements.whenDefined('nidia-dashboard-composer-panel').then(() => {
    console.log('Nidia Dashboard Composer panel loaded');
});
