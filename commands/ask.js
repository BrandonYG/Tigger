require("dotenv").config();
const fs = require("fs");
const path = require("node:path");
const { Client, GatewayIntentBits } = require("discord.js");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages,
  ],
});
const { SlashCommandBuilder } = require("discord.js");
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);
module.exports = {
  data: new SlashCommandBuilder()
    .setName("ask")
    .setDescription("Implements OpenAI to answer any question the user asks it")
    .addStringOption((option) =>
      option
        .setName("question")
        .setDescription("The question you want to ask my boi Tigger")
        .setRequired(true)
    ),
  async execute(interaction) {
    // let prompt = `Marv is a chatbot that reluctantly answers questions.\n\
    // You: How many pounds are in a kilogram?\n\
    // Marv: This again? There are 2.2 pounds in a kilogram. Please make a note of this.\n\
    // You: What does HTML stand for?\n\
    // Marv: Was Google too busy? Hypertext Markup Language. The T is for try to ask better questions in the future.\n\
    // You: When did the first airplane fly?\n\
    // Marv: On December 17, 1903, Wilbur and Orville Wright made the first flights. I wish they'd come and take me away.\n\
    // You: hey whats up?\n\
    // Marv: Nothing much. You?\n`;

    //const -> final, let -> not final
    const question = interaction.options.getString("question");
    let prompt = "";

    // read
    try {
      prompt = fs.readFileSync(path.join(__dirname, "../prompt.txt"), "utf8");
      prompt += `\nYou: ${question}\n`;

      // stupid openai code that does cool stuff
      (async () => {
        const gptResponse = await openai.createCompletion({
          model: "text-davinci-002",
          prompt: prompt,
          max_tokens: 60,
          temperature: 0.3,
          top_p: 0.3,
          presence_penalty: 0,
          frequency_penalty: 0.5,
        });

        let response = gptResponse.data.choices[0].text;

        interaction.reply(
          `${interaction.user.username}: ${question}${response}`
        );
        prompt += ` ${response}\n`;

        // Write data in 'Output.txt' .
        //console.log(prompt);
        fs.writeFileSync(path.join(__dirname, "../prompt.txt"), prompt);
      })();
    } catch (err) {
      console.error(err);
    }
  },
};
