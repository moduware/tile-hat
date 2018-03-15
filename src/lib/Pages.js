export let currentPage = 'main';

export function showMainPage() {
    currentPage = 'main';
    document.getElementById('snapshot-screen').classList.add('hidden');
    document.getElementById('settings-screen').classList.add('hidden');
    document.getElementById('result-screen').classList.remove('hidden');
}

export function showSnapshotPage() {
    currentPage = 'snapshot';
    document.getElementById('snapshot-screen').classList.remove('hidden');
    document.getElementById('settings-screen').classList.add('hidden');
    document.getElementById('result-screen').classList.add('hidden');
}

export function showSettingsPage(settings) {
    currentPage = 'settings';
    document.getElementById('snapshot-screen').classList.add('hidden');
    document.getElementById('settings-screen').classList.remove('hidden');
    document.getElementById('result-screen').classList.add('hidden');
}