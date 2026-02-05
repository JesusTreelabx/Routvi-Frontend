export const dynamic = "force-static";
import { NextResponse } from 'next/server';
import { getMenu, saveMenu } from '@/lib/mock-data';

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ productId: string }> }
) {
    try {
        const { productId } = await params;
        const body = await request.json();

        const menu = getMenu();
        let productFound = null;
        let changesMade = false;

        for (const category of menu) {
            const index = category.products.findIndex((p: any) => p.id === productId);
            if (index !== -1) {
                category.products[index] = { ...category.products[index], ...body };
                productFound = category.products[index];
                changesMade = true;
                break;
            }
        }

        if (!productFound) {
            return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
        }

        if (changesMade) {
            saveMenu(menu);
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
    { params }: { params: Promise<{ productId: string }> }
) {
    try {
        const { productId } = await params;

        console.log(`[API] Attempting to delete product: ${productId}`);
        const menu = getMenu();
        let deleted = false;

        for (const category of menu) {
            const index = category.products.findIndex((p: any) => p.id === productId);
            if (index !== -1) {
                console.log(`[API] Found product in category ${category.id} at index ${index}`);
                category.products.splice(index, 1);
                deleted = true;
                break;
            }
        }

        if (!deleted) {
            console.log(`[API] Product ${productId} not found in any category`);
            return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
        }

        saveMenu(menu);
        console.log(`[API] Product ${productId} deleted and menu saved`);

        return NextResponse.json({
            message: "Producto eliminado correctamente"
        });

    } catch (error) {
        return NextResponse.json({ error: "Error al eliminar el producto" }, { status: 500 });
    }
}
