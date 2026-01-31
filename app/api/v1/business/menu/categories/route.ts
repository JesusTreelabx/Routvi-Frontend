import { NextResponse } from 'next/server';
import { getMenu, saveMenu } from '@/lib/mock-data';

export async function POST(request: Request) {
    try {
        const { name } = await request.json();

        if (!name) {
            return NextResponse.json({ error: "El nombre es obligatorio" }, { status: 400 });
        }

        const menu = getMenu();
        const newCategory = {
            id: Date.now().toString(),
            category: name,
            products: []
        };

        menu.push(newCategory);
        saveMenu(menu);

        return NextResponse.json({
            message: "Categoría creada correctamente",
            data: newCategory
        }, { status: 201 });

    } catch (error) {
        return NextResponse.json({ error: "Error al crear la categoría" }, { status: 500 });
    }
}
