// Shared mock database for persistence across API routes
export let businessData: any = {
    name: "Chicago Deep Pizza",
    description: "Las mejores pizzas estilo Chicago en Zacatecas, con bordes altos, mucho queso y los ingredientes más frescos.",
    category: "Pizzería",
    priceRange: "$$",
    social: {
        instagram: "@chicagodeeppizza",
        facebook: "Chicago Deep Pizza"
    },
    contact: {
        phone: "492 123 4567",
        email: "contacto@chicagodeeppizza.com",
        address: "Av. Hidalgo #123, Centro Histórico, Zacatecas"
    },
    legal: {
        razonSocial: "Operadora de Alimentos Chicago S.A. de C.V.",
        rfc: "OAC1234567A8",
        regimen: "Persona Moral - Régimen de Ley",
        businessType: "Restaurante / Establecimiento Fijo"
    },
    admin: {
        representative: "Juan Pérez García",
        position: "Gerente General",
        curp: "PEGJ800101HZSXXXXX",
        directPhone: "492 987 6543"
    },
    vibes: ["Familiar", "Con Amigos"],
    amenities: ["WiFi Gratis", "Música en vivo"],
    hours: {
        Lunes: { open: "09:00", close: "22:00" },
        Martes: { open: "09:00", close: "22:00" },
        Miércoles: { open: "09:00", close: "22:00" },
        Jueves: { open: "09:00", close: "22:00" },
        Viernes: { open: "09:00", close: "23:00" },
        Sábado: { open: "10:00", close: "23:59" },
        Domingo: { open: "10:00", close: "21:00" }
    },
    menu: [
        {
            id: "1",
            category: "Pizzas Deep Dish",
            products: [
                {
                    id: "101",
                    name: "Deep Dish Classic",
                    description: "Salsa de tomate casera, mucho queso mozzarella y pepperoni.",
                    price: "$249",
                    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=200&auto=format&fit=crop",
                    available: true
                },
                {
                    id: "102",
                    name: "Super Queso Especial",
                    description: "Mezcla de 5 quesos premium con borde relleno de queso crema.",
                    price: "$289",
                    image: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?q=80&w=200&auto=format&fit=crop",
                    available: true
                }
            ]
        }
    ]
};

// Helper to update the shared state
export const updateBusinessData = (newData: any) => {
    businessData = { ...businessData, ...newData };
    return businessData;
};
