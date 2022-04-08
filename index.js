import { Client, Intents } from "discord.js";
import { config } from "dotenv";
import { keyList } from "./lib/commands/keyList.js";
import { claimGame } from "./lib/commands/claimGame.js";
config();

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

client.login(process.env.CLIENT_TOKEN); //bot login using token

client.on("ready", async () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("messageCreate", async (msg) => {
  // Movie Search Command
  if (msg.content.toLowerCase === "!test") {
    msg.channel.send("**Hi daddy!**");
  }

  //Key List Command
  if (msg.content.toLowerCase() === "!game list") {
    await keyList(msg, "game");
  }

  if (msg.content.toLowerCase().startsWith("!game claim")) {
    if (!msg.author.bot) await claimGame(msg);
  }
});
