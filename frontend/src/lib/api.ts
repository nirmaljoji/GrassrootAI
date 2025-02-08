// API service for backend communication

const API_BASE_URL = 'http://localhost:5001';

export async function fetchMessage() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/hello`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching message:', error);
        throw error;
    }
}