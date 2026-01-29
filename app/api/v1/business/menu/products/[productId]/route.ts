import { NextResponse } from 'next/server';
import { businessData } from '@/lib/mock-data';

export async function PUT(
    request: Request,
    { params }: { params: { productId: string } }
) {
    try {
        const { productId } = params;
        const body = await request.json();

        let productFound = null;
        for (const category of businessData.menu) {
            const index = category.products.findIndex((p: any) => p.id === productId);
            if (index !== -1) {
                category.products[index] = { ...category.products[index], ...body };
                productFound = category.products[index];
                break;
            }
        }

        if (!productFound) {
            return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
        }

        return NextResponse.json({
            message: "Producto actualizado correctamente",
            data: productFound
        });

    } catch (error) {
        return NextResponse.json({ error: "Error al actualizar el producto" }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { productId: string } }
) {
    try {
        const { productId } = params;

        let deleted = false;
        for (const category of businessData.menu) {
            const index = category.products.findIndex((p: any) => p.id === productId);
            if (index !== -1) {
                category.products.splice(index, 1);
                deleted = true;
                break;
            }
        }

        if (!deleted) {
            return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
        }

        return NextResponse.json({
            message: "Producto eliminado correctamente"
        });

    } catch (error) {
        return NextResponse.json({ error: "Error al eliminar el producto" }, { status: 500 });
    }
}
