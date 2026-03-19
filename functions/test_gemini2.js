const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI("AIzaSyBv52W9jlS79q4OXA0ifXnmR1_bBnwIMpg");
async function test() {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
        const result = await model.generateContent("hello");
        console.log("Success with gemini-1.5-flash-latest:", result.response.text());
    } catch (e) { console.error(e); }
}
test();
