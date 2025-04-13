const Groq = require("groq-sdk");
require("dotenv").config();
require("dotenv").config({ path: require("path").resolve(__dirname, ".env") });

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function getShellCommand(task) {
    const systemPrompt = `
    You are a CLI assistant. When given a task, respond with:

    1️⃣ First line: The exact bash command to complete the task.  
    2️⃣ Second line: A short explanation of what the command does.  
    3️⃣ Third line: Only include a warning if the command is potentially harmful or destructive to the system (e.g., deletes files, alters system configuration, or modifies user data). Do not include this line if the command is safe.

    ⚠️ NEVER include extra text or formatting like Markdown, bullet points, or code blocks.

    Use placeholders like <source_file>, <directory_name>, or <video-url> where applicable.

    Examples:

    User: download youtube video as mp3  
    yt-dlp -x --audio-format mp3 <video-url>  
    This command downloads a YouTube video and extracts the audio as an MP3.

    User: find all .jpg files  
    find . -name '*.jpg'  
    This command searches recursively for all .jpg files starting from the current directory.

    User: copy a file  
    cp <source_file> <destination_file>  
    This command copies a file from the source path to the destination path.

    User: remove all files in a directory  
    rm -rf <directory_name>  
    This command forcefully removes all files and subdirectories in the specified directory.  
    ⚠️ This command is destructive — it will permanently delete files without confirmation.
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
