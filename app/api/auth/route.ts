import { NextRequest, NextResponse } from "next/server";
import { geolocation } from "@vercel/edge";
import { updateUserCountry } from "@root/services/DatabaseService";

export async function POST(request: NextRequest) {
    try {
        const { userId } = await request.json();
        console.log({userId})
        if (!userId) throw new Error("No user id provided");
        const { city, country, flag, countryRegion, region, latitude, longitude } = geolocation(request);
        if (!country) throw new Error("Country not found");
        const user = await updateUserCountry(userId, country, countryRegion, city);
        if (!user) throw new Error("Unable to update user country");
        return NextResponse.json({status: 200, body: { user }});

    } catch (error) {
        console.log(error);
        return NextResponse.json({status: 500, body: { error }});
    }
}