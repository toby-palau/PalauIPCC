declare module "@mailchimp/mailchimp_marketing" {
    type Config = {
        apiKey?: string,
        accessToken?: string,
        server?: string
    }
  
    type AddListMemberOptions = {
        email_address: string;
        tags: string[];
        status: "subscribed" | "unsubscribed" | "cleaned" | "pending" | "transactional";
    }
    
    type SetListMemberBody = {
        email_address: string;
        status?: "subscribed" | "unsubscribed" | "cleaned" | "pending" | "transactional";
        status_if_new?: "subscribed" | "unsubscribed" | "cleaned" | "pending" | "transactional";
        merge_fields?: {[key: string]: any};
    }
    
    type UpdateListMemberBody = {
        tags: Array<{name: string, status: "active" | "inactive"}>
    }
  
    export default {
        setConfig: (config: Config) => {},
        lists: {
            addListMember: (listId: string, opts?: AddListMemberOptions): Promise<void> => {},
            setListMember: (listId: string, subscriberHash: string, body: SetListMemberBody): Promise<void> => {},
            updateListMemberTags: (listId: string, subscriberHash: string, body: UpdateListMemberBody): Promise<void> => {},
        }
    }
}
  