export async function fetchPrice(){
    const url = `https://api.coincap.io/v2/assets`;
    try {
        const res = await fetch(url);
        const data = await res.json();
        return data.data
    } catch (error) {
        console.error(`could not fetch coins' data`, error);
    }
}