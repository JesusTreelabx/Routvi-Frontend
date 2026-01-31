import fs from 'fs';
import path from 'path';

// Define the path to the JSON file for persistence
const dataFilePath = path.join(process.cwd(), 'data', 'menu.json');

// Helper function to read data from the JSON file
function readData() {
    if (!fs.existsSync(dataFilePath)) {
        // Initialize with an empty menu if the file doesn't exist
        const initialData = { menu: [] };
        // Ensure the directory exists
        const dir = path.dirname(dataFilePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(dataFilePath, JSON.stringify(initialData, null, 2), 'utf-8');
        return initialData;
    }
    const fileContent = fs.readFileSync(dataFilePath, 'utf-8');
    return JSON.parse(fileContent);
}

// Helper function to write data to the JSON file
function writeData(data: any) {
    const dir = path.dirname(dataFilePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf-8');
}

// Exported object that mimics the previous structure but reads from file
// Exported object that mimics the previous structure but reads from file
export const businessData = {
    // Dynamic getters for all properties usually accessed
    get menu() { return readData().menu; },
    get name() { return readData().name; },
    get category() { return readData().category; },
    get priceRange() { return readData().priceRange; },
    get description() { return readData().description; },
    get social() { return readData().social; },
    get contact() { return readData().contact; },
    get legal() { return readData().legal; },
    get admin() { return readData().admin; },
    get hours() { return readData().hours; },
    get vibes() { return readData().vibes; },
    get amenities() { return readData().amenities; },
    get promotions() { return readData().promotions || []; },

    // Setter for full update
    toJSON() { return readData(); }
};

export function updateBusinessData(updates: any) {
    const current = readData();
    const newData = { ...current, ...updates };
    writeData(newData);
    return newData;
}

// Export helper functions for direct access in API routes
export function getMenu() {
    return readData().menu;
}

export function saveMenu(menu: any[]) {
    writeData({ menu });
}


