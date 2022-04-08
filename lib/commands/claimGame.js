import fs from "fs-extra";

export async function claimGame(msg) {
  // query would be something like tt8008135

  let query = msg.content.replace("!game claim", "").trim().replace(/ +/, "+");

  const json = await fs.readFile("games.json", "utf8");
  let games = JSON.parse(json);

  const gameToClaim = games.find((m) => m.game === query);
  if (gameToClaim) {
    games = games.filter((m) => m.link !== query);

    msg.author.send("Would you like to claim:  " + gameToClaim.game + "?");

    //await fs.writeFile("games.json", JSON.stringify(movies, null, " "));
    //msg.channel.send(
    // `**${movieToDelete.title} has been removed from the suggestion list.**`
    // );
  } else {
    msg.channel.send("No such game found.");
  }
}
