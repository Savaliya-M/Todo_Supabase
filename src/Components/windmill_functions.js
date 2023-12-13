export async function triggerJob(event) {
    try {
        const body = JSON.stringify({
            "eventdata": event,
            "auth": "$res:u/mitulsavaliya120/jolly_supabase"
        });
        const endpoint = `https://app.windmill.dev/api/w/demo/jobs/run/p/u/mitulsavaliya120/add_event_data`;

        const result = await fetch(endpoint, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.REACT_APP_WINDMILL_TOKEN}`
            },
            body
        });
        return result;
    } catch (e) {
        console.log(e);
    }
}