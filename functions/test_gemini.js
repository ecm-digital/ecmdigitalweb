const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI("AIzaSyBv52W9jlS79q4OXA0ifXnmR1_bBnwIMpg");
async function run() {
  try {
    const list = await fetch("https://generativelanguage.googleapis.com/v1beta/models?key=AIzaSyBv52W9jlS79q4OXA0ifXnmR1_bBnwIMpg").then(res => res.json());
    console.log("AVAILABLE MODELS:", list.models.map(m => m.name));
  } catch (e) {
    console.error(e);
  }
}
run();
