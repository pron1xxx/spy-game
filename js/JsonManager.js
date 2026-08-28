class JsonManager {
    async readJson(file_path) {
        try {
            const response = await fetch(file_path);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return data; 
            
        } catch (error) {
            console.error('Ошибка:', error);
            throw error;
        }
    }
}