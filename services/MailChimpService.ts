"use server"

import client from "@mailchimp/mailchimp_marketing";
import { QuizIdType } from "@root/@types/shared.types";
import { track } from "@vercel/analytics/server";

client.setConfig({
    apiKey: process.env.MAILCHIMP_API_KEY,
    server: process.env.MAILCHIMP_SERVER_PREFIX,
});

export const subscribeToMailList = async (quizId: QuizIdType, email: string) => {
    await client.lists.setListMember("48d8315922", email, { email_address: email, status: "subscribed" });
    await client.lists.updateListMemberTags("48d8315922", email, { tags: [{name: `${quizId}-report`, status: "active"}] });
    track("Subscribe To Mailing List");
}