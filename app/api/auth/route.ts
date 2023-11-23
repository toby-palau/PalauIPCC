import { NextRequest, NextResponse } from "next/server";
import { geolocation } from "@vercel/edge";
import { updateUserCountry } from "@root/services/DatabaseService";

export async function GET(request: NextRequest) {
    try {
        const userId = request.cookies.get("userId")?.value;
        if (!userId) throw new Error("No user ID found");
        const { city, country, flag, countryRegion, region, latitude, longitude } = geolocation(request);
        if (!country) throw new Error("Country not found");
        console.log(country)
        const user = await updateUserCountry(userId, country);
        if (!user) throw new Error("Unable to update user country");
        return NextResponse.json({status: 200, body: { user }});

    } catch (error) {
        console.log(error);
        return NextResponse.json({status: 500, body: { error }});
    }
}