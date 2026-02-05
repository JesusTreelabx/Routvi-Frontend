export const dynamic = "force-static";
import { NextResponse } from 'next/server';
import { getMenu, saveMenu } from '@/lib/mock-data';

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ categoryId: string }> }
) {
    try {
        const { categoryId } = await params;
        const { name } = await request.json();

        const menu = getMenu();
        const categoryIndex = menu.findIndex((c: any) => c.id === categoryId);

        if (categoryIndex === -1) {
            return NextResponse.json({ error: "Categoría no encontrada" }, { status: 404 });
        }

        menu[categoryIndex].category = name;
        saveMenu(menu);

        return NextResponse.json({
            message: "Categoría actualizada correctamente",
            data: menu[categoryIndex]
        });

    } catch (error) {
        return NextResponse.json({ error: "Error al actualizar la categoría" }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ categoryId: string }> }
) {
    try {
        const { categoryId } = await params;

        console.log(`Deleting category with ID: ${categoryId}`);
        const menu = getMenu();
        const categoryIndex = menu.findIndex((c: any) => c.id === categoryId);

        if (categoryIndex === -1) {
            console.log("Category not found");
            return NextResponse.json({ error: "Categoría no encontrada" }, { status: 404 });
        }

        console.log(`Found category at index ${categoryIndex}, deleting...`);
        menu.splice(categoryIndex, 1);
        saveMenu(menu);
        console.log("Category deleted and saved.");

        return NextResponse.json({
            message: "Categoría eliminada correctamente"
        });

    } catch (error) {
        return NextResponse.json({ error: "Error al eliminar la categoría" }, { status: 500 });
    }
}
