import { NextResponse } from 'next/server';
import { updateBusinessData, businessData } from '@/lib/mock-data';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { productId, date, isDefault, dayOfWeek } = body;

        // Validation
        if (!productId) {
            return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
        }
        if (!dayOfWeek) {
            return NextResponse.json({ error: "Day of week is required" }, { status: 400 });
        }

        // Persist to mock data
        const currentSpecials = businessData.dailySpecials || {};
        const newSpecials = { ...currentSpecials, [dayOfWeek]: productId };

        updateBusinessData({ dailySpecials: newSpecials });

        console.log(`[API] Setting Daily Special: Product ${productId} for ${dayOfWeek}`);

        return NextResponse.json({
            success: true,
            message: "Daily special updated successfully",
            data: {
                productId,
                dayOfWeek,
                isDefault: !!isDefault
            }
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
