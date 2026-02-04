import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { productId, date, isDefault } = body;

        // Validation
        if (!productId) {
            return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
        }

        // In a real app, we would update the DB here.
        // For now, we'll simulate success.
        console.log(`[API] Setting Daily Special: Product ${productId} on ${date} (Default: ${isDefault})`);

        return NextResponse.json({
            success: true,
            message: "Daily special updated successfully",
            data: {
                productId,
                date: date || new Date().toISOString().split('T')[0],
                isDefault: !!isDefault
            }
        });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
