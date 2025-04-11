#!/usr/bin/env node
const { Command } = require("commander");
const { getShellCommand } = require("./grokai");
const chalk = require("chalk");

const program = new Command();

program
  .name("bashmate")
  .description("Generate bash commands from natural language prompts")
  .argument("<task...>", "What do you want to do?") // capture multiple words as one array
  .action(async (taskWords) => {
    const task = taskWords.join(" "); // join words into a single string
    console.log(chalk.cyan(`🧠 Generating command for: "${task}"\n`));
    const cmd = await getShellCommand(task);
    console.log(chalk.green(`💻 Bash Command:\n${cmd}`));
  });

program.parse();
