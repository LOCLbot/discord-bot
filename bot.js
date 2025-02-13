require('dotenv').config();

const { 
    Client, 
    GatewayIntentBits, 
    Partials, 
    EmbedBuilder, 
    ActionRowBuilder, 
    ButtonBuilder, 
    ButtonStyle, 
    PermissionsBitField 
} = require('discord.js');

const TOKEN = process.env.DISCORD_TOKEN; // Load token from environment variables

if (!TOKEN) {
    console.error("❌ Missing Discord bot token. Set DISCORD_TOKEN in Railway Variables.");
    process.exit(1); // Stop bot if token is missing
}

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMembers
    ],
    partials: [Partials.Message, Partials.Reaction, Partials.User]
});

// IDs (Replace these with actual values)
const RULES_CHANNEL_ID = '1336949785885937685'; // Rules channel
const GET_RANK_CHANNEL_ID = '1336961344682856508';
const INTRODUCTIONS_CHANNEL_ID = '1336949957080514620';
const TOURNAMENT_INFO_CHANNEL_ID = '1336950103830695997';
const LOOKING_FOR_TEAM_CHANNEL_ID = '1336950651996864603';
const ADMIN_ROLE_ID = '1337908806142660678'; // Replace with the Admin role ID
const ROLE_ID = '1337646502012780616'; // Role assigned on ✅ reaction
const CHECKMARK_EMOJI = '✅'; // Reaction emoji
const TICKET_CATEGORY_ID = '1337654371076411473'; // Category for tickets
const SUPPORT_ROLE_ID = '1337654453477576754'; // Support role

client.once('ready', () => {
    console.log(`✅ Bot is online as ${client.user.tag}`);
});

// ✅ Send Rules Embed
client.on('messageCreate', async (message) => {
    if (message.content === '!sendrules' && message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
        const embed = new EmbedBuilder()
            .setColor(0x2ecc71) // Green
            .setTitle('🎯 **RULES & REGULATIONS** 🚨')
            .setDescription('**Welcome to the LOCL Tournament!**\n\n**Click ✅ below to accept the rules!**⬇️');

        const msg = await message.channel.send({ embeds: [embed] });
        await msg.react(CHECKMARK_EMOJI);
    }

    // 🎟️ Ticket System Embed
    if (message.content === '!sendticket' && message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
        const embed = new EmbedBuilder()
            .setColor(0xed4245)
            .setTitle('Need to get ranked?')
            .setDescription(`Click the button below to schedule a time with a <@&${SUPPORT_ROLE_ID}>.`);

        const button = new ButtonBuilder()
            .setCustomId('create_ticket')
            .setLabel('Get Ranked')
            .setStyle(ButtonStyle.Danger)
            .setEmoji('🗒️');

        const row = new ActionRowBuilder().addComponents(button);
        await message.channel.send({ embeds: [embed], components: [row] });
    }

    // ✅ Send Welcome Steps Embed (Updated)
    if (message.content === '!sendwelcome' && message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
        const embed = new EmbedBuilder()
            .setColor(0x2ecc71) // Green
            .setTitle("**Welcome to LOCL – Legends of COD League!**")
            .setDescription(
                "Compete. Dominate. Rise to the Top!\n" +
                "You've just joined one of the most intense Call of Duty competitive communities!\n\n" +
                
                "### **Next Steps for New Members**\n" +
                "✅ **Step 1:** Read the **📜 [Rules](<#" + RULES_CHANNEL_ID + ">)** to understand our guidelines.\n" +
                "✅ **Step 2:** Select Get Ranked in **🎖 [Get-Rank](<#" + GET_RANK_CHANNEL_ID + ">)** and wait for a ranker to respond.\n" +
                "✅ **Step 3:** Introduce yourself in **👋 [Introductions](<#" + INTRODUCTIONS_CHANNEL_ID + ">)**.\n" +
                "✅ **Step 4:** Check out upcoming games in **📆 [Tournament Info](<#" + TOURNAMENT_INFO_CHANNEL_ID + ">)**.\n" +
                "✅ **Step 5:** Join the fight! Connect with players in **🎯 [Looking for a Team](<#" + LOOKING_FOR_TEAM_CHANNEL_ID + ">)**.\n\n" +

                "### **📞 Contact Staff**\n" +
                "*If you need help, message a* <@&" + ADMIN_ROLE_ID + ">.\n\n" + // Admin Role Mention
                "**Welcome to LOCL – Legends of COD League!** | *Good Luck & Have Fun!*"
            )
            .setFooter({ text: "Welcome to the community!", iconURL: message.guild.iconURL() });

        await message.channel.send({ embeds: [embed] });
    }
});

// ✅ Assign Role on Reaction
client.on('messageReactionAdd', async (reaction, user) => {
    if (reaction.message.channel.id !== RULES_CHANNEL_ID) return;
    if (reaction.emoji.name !== CHECKMARK_EMOJI) return;
    if (user.bot) return;

    const member = await reaction.message.guild.members.fetch(user.id).catch(() => null);
    if (member) await member.roles.add(ROLE_ID).catch(console.error);
});

// ❌ Remove Role on Reaction Removal
client.on('messageReactionRemove', async (reaction, user) => {
    if (reaction.message.channel.id !== RULES_CHANNEL_ID) return;
    if (reaction.emoji.name !== CHECKMARK_EMOJI) return;
    if (user.bot) return;

    const member = await reaction.message.guild.members.fetch(user.id).catch(() => null);
    if (member) await member.roles.remove(ROLE_ID).catch(console.error);
});

console.log("Loaded token:", process.env.DISCORD_TOKEN ? "✅ Token detected" : "❌ No token found");

client.login(TOKEN);




