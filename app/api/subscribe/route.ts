import { NextRequest, NextResponse } from "next/server";
import client from "@mailchimp/mailchimp_marketing";


client.setConfig({
    apiKey: process.env.MAILCHIMP_API_KEY,
    server: process.env.MAILCHIMP_SERVER_PREFIX,
});

const subscribe = async (email: string) => {
    await client.lists.setListMember("48d8315922", email, { email_address: email, status: "subscribed" });
    await client.lists.updateListMemberTags("48d8315922", email, { tags: [{name: "ipcc-report", status: "active"}] });
};


export async function POST(req: NextRequest) {
    const { email } = await req.json();
    subscribe(email);
    return NextResponse.json({ data: { email, status: "subscribed", tags: ["ipcc-report"] }, status: 200 });
}


