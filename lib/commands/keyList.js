import fs from "fs-extra";
import { MessageActionRow, MessageEmbed } from "discord.js";

export async function keyList(msg, type = "game") {
  const keyData = await fs.readFile("games.json", "utf8");
  let keys = JSON.parse(keyData).filter((m) => m.type === type);

  if (keys.length < 1) {
    msg.channel.send("**There are no keys on the list.**");
  } else {
    const actionRow = new MessageActionRow({
      components: [
        {
          customId: "prev",
          type: "BUTTON",
          label: "Previous",
          style: "PRIMARY",
        },
        {
          customId: "next",
          type: "BUTTON",
          label: "Next",
          style: "PRIMARY",
        },
      ],
    });

    let page = 0;
    let keysPerPage = 15;

    /**
     * Generates the embed containing the paged movies.
     * @return {MessageEmbed}
     */
    const generateEmbed = () => {
      const pagedKeys = keys.slice(
        page * keysPerPage,
        (page + 1) * keysPerPage
      );
      const embed = new MessageEmbed({}).setTitle("Current Steam keys");
      embed.addFields(
        {
          name: "#",
          value: pagedKeys.map((m, i) => page * keysPerPage + i + 1).join("\n"),
          inline: true,
        },
        {
          name: "Title",
          value: pagedKeys.map((m) => m.game).join("\n"),
          inline: true,
        },
        {
          name: "Link",
          value: pagedKeys.map((m) => m.key).join("\n"),
          inline: true,
        }
      );
      return embed;
    };

    /**
     * Updates the button states based on the page and number of results
     */
    const updateComponents = () => {
      actionRow.components
        .find((c) => c.customId === "prev")
        .setDisabled(page <= 0);

      actionRow.components
        .find((c) => c.customId === "next")
        .setDisabled((page + 1) * keysPerPage >= keys.length);
    };

    updateComponents();

    const message = await msg.channel.send({
      components: [actionRow],
      embeds: [generateEmbed()],
    });

    while (true) {
      try {
        const interaction = await message.awaitMessageComponent({
          componentType: "BUTTON",
          time: 30000,
        });

        if (interaction.customId === "next") page++;
        else if (interaction.customId === "prev") page--;
        updateComponents();

        await interaction.update({
          components: [actionRow],
          embeds: [generateEmbed()],
        });
      } catch (e) {
        // No response, stop the looperino and get rid of the components
        await message.edit({
          components: [],
        });
        break;
      }
    }
  }
}
