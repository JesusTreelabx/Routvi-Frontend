import fs from 'fs';
import path from 'path';

// Define the path to the JSON file for persistence
const dataFilePath = path.join(process.cwd(), 'data', 'menu.json');

const DEFAULT_BUSINESS_DATA = {
    menu: [],
    name: "Tu Negocio",
    category: "Pizzería",
    priceRange: "$$",
    description: "Una breve descripción de tu negocio...",
    social: {
        instagram: "@tunegocio",
        facebook: "/tunegocio"
    },
    contact: {
        phone: "555-0000",
        email: "hola@tunegocio.com",
        address: "Calle Principal #123"
    },
    legal: {
        razonSocial: "Tu Razón Social S.A. de C.V.",
        rfc: "XAXX010101000",
        regimen: "Persona Moral",
        businessType: "Restaurante"
    },
    admin: {
        representative: "Juan Pérez",
        position: "Gerente"
    },
    hours: {
        Lunes: { open: "09:00", close: "22:00" },
        Martes: { open: "09:00", close: "22:00" },
        Miércoles: { open: "09:00", close: "22:00" },
        Jueves: { open: "09:00", close: "23:00" },
        Viernes: { open: "09:00", close: "23:59" },
        Sábado: { open: "10:00", close: "23:59" },
        Domingo: { open: "10:00", close: "22:00" }
    },
    vibes: ["Familiar"],
    amenities: ["WiFi Gratis", "Pet Friendly"],
    promotions: []
};

// Helper function to read data from the JSON file
function readData() {
    if (!fs.existsSync(dataFilePath)) {
        // Initialize with default data if the file doesn't exist
        // Ensure the directory exists
        const dir = path.dirname(dataFilePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(dataFilePath, JSON.stringify(DEFAULT_BUSINESS_DATA, null, 2), 'utf-8');
        return DEFAULT_BUSINESS_DATA;
    }
    const fileContent = fs.readFileSync(dataFilePath, 'utf-8');
    try {
        const parsedData = JSON.parse(fileContent);
        // Merge with default data to ensure all fields exist even if file is partial
        return { ...DEFAULT_BUSINESS_DATA, ...parsedData };
    } catch (e) {
        // If file is corrupt, return default
        return DEFAULT_BUSINESS_DATA;
    }
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
    get topPromos() { return readData().topPromos || []; },

    // Setter for full update
    toJSON() { return readData(); }
};

export function updateBusinessData(updates: any) {
    const current = readData();
    const newData = { ...current, ...updates };
    writeData(newData);
    return newData;
}

// Helper to update the topPromos snapshot based on active promotions
export function updateTopPromosSnapshot() {
    const current = readData();
    const allPromos = current.promotions || [];
    // Filter active promotions
    const activePromos = allPromos.filter((p: any) => p.active);

    // Validate expiry dates to ensure we don't snapshot expired ones
    const now = new Date();
    const validPromos = activePromos.filter((p: any) => {
        if (!p.expiryDate) return true;
        const expiry = new Date(p.expiryDate);
        return expiry >= now;
    });

    // Take top 5 and update snapshot
    const top5 = validPromos.slice(0, 5);
    const newData = { ...current, topPromos: top5 };
    writeData(newData);
    return top5;
}

// Export helper functions for direct access in API routes
export function getMenu() {
    return readData().menu;
}

export function saveMenu(menu: any[]) {
    writeData({ ...readData(), menu });
}
