import { NextResponse } from 'next/server';
import { businessData } from '@/lib/mock-data';

export async function POST(request: Request) {
    try {
        const { categoryId, name } = await request.json();

        if (!categoryId || !name) {
            return NextResponse.json({ error: "Categoría y nombre son obligatorios" }, { status: 400 });
        }

        const category = businessData.menu.find((c: any) => c.id === categoryId);

        if (!category) {
            return NextResponse.json({ error: "Categoría no encontrada" }, { status: 404 });
        }

        const newProduct = {
            id: Date.now().toString(),
            name,
            description: "",
            price: "$0",
            image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=200&auto=format&fit=crop",
            available: true
        };

        category.products.push(newProduct);

        return NextResponse.json({
            message: "Producto creado correctamente",
            data: newProduct
        }, { status: 201 });

    } catch (error) {
        return NextResponse.json({ error: "Error al crear el producto" }, { status: 500 });
    }
}
