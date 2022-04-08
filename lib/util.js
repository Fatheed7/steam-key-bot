import axios from "axios";
import { MessageEmbed } from "discord.js";

export async function listDetails(msg) {
  const embed = new MessageEmbed().setTitle("Suggestion Commands").addFields(
    {
      name: "Command",
      value: "!seek <query>\n!movie list\n!tv list",
      inline: true,
    },
    {
      name: "Result",
      value:
        "Search for a movie or TV Show!\nShow suggested Movies!\nShow suggested TV Shows!",
      inline: true,
    }
  );
  await msg.channel.send({ embeds: [embed] });
}
