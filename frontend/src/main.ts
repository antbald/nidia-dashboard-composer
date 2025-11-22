import './components/App';

// Register the panel
customElements.whenDefined('nidia-dashboard-composer-panel').then(() => {
    console.log('Nidia Dashboard Composer panel loaded');
});
