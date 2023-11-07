

export const subscribeToMailList = async (email: string) => {
    const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ email }),
    });

    return response.json();
}