import { NextResponse } from 'next/server';
import { businessData, updateBusinessData } from '@/lib/mock-data';

export const dynamic = 'force-dynamic';

export async function GET() {
    return NextResponse.json(businessData.toJSON());
}

export async function PUT(request: Request) {
    try {
        const newData = await request.json();
        const updated = updateBusinessData(newData);
        return NextResponse.json({
            message: "Perfil actualizado correctamente",
            data: updated
        });
    } catch (error) {
        return NextResponse.json({ error: "Error al procesar la solicitud" }, { status: 400 });
    }
}
