import { NextResponse } from 'next/server';
import { getMenu, saveMenu } from '@/lib/mock-data';

export async function POST(
    request: Request,
    { params }: { params: Promise<{ categoryId: string }> }
) {
    try {
        const { categoryId } = await params;
        const body = await request.json();
        const { name, description, price, image } = body;

        if (!name || !price) {
            return NextResponse.json({ error: "Nombre y precio son obligatorios" }, { status: 400 });
        }

        const menu = getMenu();
        const categoryIndex = menu.findIndex((c: any) => c.id === categoryId);

        if (categoryIndex === -1) {
            return NextResponse.json({ error: "Categoría no encontrada" }, { status: 404 });
        }

        const newProduct = {
            id: `prod_${Date.now()}`,
            name,
            description: description || "",
            price,
            image: image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=200&auto=format&fit=crop",
            available: true
        };

        if (!menu[categoryIndex].products) {
            menu[categoryIndex].products = [];
        }

        menu[categoryIndex].products.push(newProduct);
        saveMenu(menu);

        return NextResponse.json({
            message: "Producto agregado correctamente",
            data: newProduct
        }, { status: 201 });

    } catch (error) {
        console.error("Error adding product:", error);
        return NextResponse.json({ error: "Error al agregar el producto" }, { status: 500 });
    }
}

export async function GET(
    request: Request,
    { params }: { params: Promise<{ categoryId: string }> }
) {
    try {
        const { categoryId } = await params;
        const menu = getMenu();
        const category = menu.find((c: any) => c.id === categoryId);

        if (!category) {
            return NextResponse.json({ error: "Categoría no encontrada" }, { status: 404 });
        }

        return NextResponse.json({
            data: category.products || []
        });

    } catch (error) {
        return NextResponse.json({ error: "Error al obtener productos" }, { status: 500 });
    }
}
