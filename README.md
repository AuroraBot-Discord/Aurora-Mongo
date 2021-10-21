# Aurora-Mongo
MongoDBをKeyvのように扱うことができるパッケージです。

# Install
```sh
npm i aurora-mongo
# yarn add aurora-mongo
```

# Usage

## TL;DR
```js
const mongo = require("aurora-mongo");

//change your mongodb uri
mongo.connect(`mongodb+srv://username:password@hoge.rhaqe.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`)
.then(async () => {

const db = new mongo.Database("test")
await db.set("foo", "bar");
console.log(await db.get("foo"));
// expected output: bar

console.log(await db.get("baz"));
// expected output: null

await db.set("fizz", 3);
await db.set("bazz", 5);
console.log(`fizzbazz: ${(await db.get("fizz")) * (await db.get("bazz"))}`);
// expected output: 15

await db.delete("foo");

console.log(await db.keys());
// expected output: ["fizz", "buzz"]

console.log(await db.values());
// expected output: [3, 5]

console.log(await db.entries());
// expected output: [["fizz", 3], ["buzz", 5]];

console.log(await db.has("fizz"));
// expected output: true

await db.clear()
console.log(await db.has("fizz"));
// expected output: false

})
```

## Convert keyv to aurora-mongo
### old code
```js
const discord = require("discord.js");
const client = new discord.Client({ intents: [discord.Intents.FLAGS.GUILDS, discord.Intents.FLAGS.GUILD_MESSAGES] })
const Keyv = require("keyv");
const levels = new Keyv("sqlite://db.sqlite", { table: "level" });
const xps = new Keyv("sqlite://db.sqlite", { table: "xp" });

client.on('messageCreate', async message => {
  if (message.author.bot) return;
  let nowLevel = await levels.get(message.author.id) || 1;
  let nowXP = await xps.get(message.author.id) || 0;
  nowXP++;
  if (nowXP >= 100) {
    nowXP = 0;
    nowLevel++
    message.reply("Level Up");
  }
  await levels.set(message.author.id, nowLevel);
  await xps.set(message.author.id, nowXP);
});

client.login(process.env.token);
```

## new code
```js
const discord = require("discord.js");
const client = new discord.Client({ intents: [discord.Intents.FLAGS.GUILDS, discord.Intents.FLAGS.GUILD_MESSAGES] })
const mongo = require("aurora-mongo");

mongo.connect("your mongodb url")
.then(() => {

const levels = new mongo.Database("level");
const xps = new mongo.Database("xp");

client.on('messageCreate', async message => {
  if (message.author.bot) return;
  let nowLevel = await levels.get(message.author.id) || 1;
  let nowXP = await xps.get(message.author.id) || 0;
  nowXP++;
  if (nowXP >= 100) {
    nowXP = 0;
    nowLevel++
    message.reply("Level Up");
  }
  await levels.set(message.author.id, nowLevel);
  await xps.set(message.author.id, nowXP);
});

client.login(process.env.token);

});
```