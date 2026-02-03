import { NextResponse } from 'next/server';
import { businessData, updateBusinessData, updateTopPromosSnapshot } from '@/lib/mock-data';

export const dynamic = 'force-dynamic';

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ promoId: string }> }
) {
    try {
        const { promoId } = await params;
        const body = await request.json();
        const { title, description, code, expiryDate, discount, active } = body;

        const currentPromos = businessData.promotions;
        const index = currentPromos.findIndex((p: any) => p.id === promoId);

        if (index === -1) {
            return NextResponse.json({ error: "Promoción no encontrada" }, { status: 404 });
        }

        const updatedPromo = { ...currentPromos[index], ...body };
        currentPromos[index] = updatedPromo;

        updateBusinessData({ promotions: currentPromos });
        updateTopPromosSnapshot();

        return NextResponse.json({
            message: "Promoción actualizada correctamente",
            data: updatedPromo
        });

    } catch (error) {
        return NextResponse.json({ error: "Error al actualizar la promoción" }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ promoId: string }> }
) {
    try {
        const { promoId } = await params;

        const currentPromos = businessData.promotions;
        const newPromos = currentPromos.filter((p: any) => p.id !== promoId);

        if (currentPromos.length === newPromos.length) {
            return NextResponse.json({ error: "Promoción no encontrada" }, { status: 404 });
        }

        updateBusinessData({ promotions: newPromos });
        updateTopPromosSnapshot();

        return NextResponse.json({
            message: "Promoción eliminada correctamente"
        });

    } catch (error) {
        return NextResponse.json({ error: "Error al eliminar la promoción" }, { status: 500 });
    }
}
