import { NextResponse } from 'next/server';
import { businessData } from '@/lib/mock-data';

export async function PUT(
    request: Request,
    { params }: { params: { categoryId: string } }
) {
    try {
        const { categoryId } = params;
        const { name } = await request.json();

        const categoryIndex = businessData.menu.findIndex((c: any) => c.id === categoryId);

        if (categoryIndex === -1) {
            return NextResponse.json({ error: "Categoría no encontrada" }, { status: 404 });
        }

        businessData.menu[categoryIndex].category = name;

        return NextResponse.json({
            message: "Categoría actualizada correctamente",
            data: businessData.menu[categoryIndex]
        });

    } catch (error) {
        return NextResponse.json({ error: "Error al actualizar la categoría" }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { categoryId: string } }
) {
    try {
        const { categoryId } = params;

        const categoryIndex = businessData.menu.findIndex((c: any) => c.id === categoryId);

        if (categoryIndex === -1) {
            return NextResponse.json({ error: "Categoría no encontrada" }, { status: 404 });
        }

        businessData.menu.splice(categoryIndex, 1);

        return NextResponse.json({
            message: "Categoría eliminada correctamente"
        });

    } catch (error) {
        return NextResponse.json({ error: "Error al eliminar la categoría" }, { status: 500 });
    }
}
