import { NextResponse } from 'next/server';
import { businessData, updateBusinessData } from '@/lib/mock-data';

export const dynamic = 'force-dynamic';

export async function GET() {
    return NextResponse.json({
        data: businessData.promotions
    });
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { title, description, code, expiryDate, discount } = body;

        if (!title || !description || !code) {
            return NextResponse.json({ error: "Título, descripción y código son obligatorios" }, { status: 400 });
        }

        const newPromo = {
            id: `promo_${Date.now()}`,
            title,
            description,
            code,
            discount: discount || "10%",
            expiryDate: expiryDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // +7 days
            active: true
        };

        const currentPromos = businessData.promotions;
        updateBusinessData({ promotions: [...currentPromos, newPromo] });

        return NextResponse.json({
            message: "Promoción creada correctamente",
            data: newPromo
        }, { status: 201 });

    } catch (error) {
        console.error("Error creating promotion:", error);
        return NextResponse.json({ error: "Error al crear la promoción" }, { status: 500 });
    }
}
