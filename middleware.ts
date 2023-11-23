import { geolocation } from '@vercel/edge';
import { NextResponse } from 'next/server';
 
const BLOCKED_COUNTRY = 'US';
 
export const config = {
    // Only run the middleware on the home route
    matcher: '/',
};
 
export default function middleware(request: Request) {
    const { city, country, flag, countryRegion, region, latitude, longitude } = geolocation(request);
    console.log({ middleware: { city, country, flag, countryRegion, region, latitude, longitude } });
    
    return NextResponse.next();
}