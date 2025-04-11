const Groq = require("groq-sdk");
require("dotenv").config();
require("dotenv").config({ path: require("path").resolve(__dirname, ".env") });

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function getShellCommand(task) {
    const systemPrompt = `
    You are a CLI assistant. When given a task, respond ONLY with the appropriate bash command.
    
    ⚠️ Do not add any text, explanation, or prefix. Just the command line itself.
    
    Use placeholders like <source_file> or <directory_name> where applicable.
    
    Examples:
    User: download youtube video as mp3  
    yt-dlp -x --audio-format mp3 <video-url>
    
    User: find all .jpg files  
    find . -name '*.jpg'
    
    User: copy a file  
    cp <source_file> <destination_file>
    
    User: make a new directory  
    mkdir <directory_name>
    
    User: list all files  
    ls -a
    `;    
  

  const completion = await groq.chat.completions.create({
    model: "llama3-8b-8192",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: task },
    ],
    temperature: 0.2,
  });

  return completion.choices[0].message.content.trim();
}

module.exports = { getShellCommand };
