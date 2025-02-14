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

// ✅ Send Rules Embed with Tournament Rules
client.on('messageCreate', async (message) => {
    if (message.content === '!sendrules' && message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
        const embed = new EmbedBuilder()
            .setColor(0xff0000) // 🔴 Change the embed color to RED (you can choose any hex color)
            .setTitle('🎯 **RULES & REGULATIONS** 🚨') // Title in bold with emojis
            .setDescription(
                '**⚔️ Welcome to the LOCL Tournament! ⚔️**\n\n'
            )
            .addFields(
                { name: '📌 **1. General Rules**', value: 
                    `- **Respect all players** – No toxicity, harassment, or discrimination.\n` +
                    `- **Follow Discord & Game ToS** – No cheating, hacking, or exploiting.\n` +
                    `- **Admins & Moderators have final say** – Their decisions are final.\n` +
                    `- **No match-fixing or collusion** – Bribing, throwing, or win-trading will lead to disqualification.\n` +
                    `- **Check-in Required** – Players must check in **15 minutes before match time** or forfeit.\n` +
                    `- **Glitches/Exploits:** – Any use of banned glitches = automatic disqualification.`
                },
                { name: '📅 **2. Tournament Format**', value: 
                    `- **Game Mode** – Search & Destroy, Hardpoint, or Control.\n` +
                    `- **Map Type** – Randomized.\n` +
                    `- **Seeding** – Based on previous tournament performance.\n` +
                    `- **Play Times** – When players are available.\n` +
                    `- **Finals Format** – Best of 5.`
                },
                { name: '🎮 **3. Player & Team Requirements**', value:
                    `- **Minimum Age** – 13+ (or per game’s competitive rules).\n` +
                    `- **Team Size** – 4v4.\n` +
                    `- **Substitutions:**\n` +
                    `  - Each team is allowed **one registered substitute**.\n` +
                    `  - Subs must be Warrior or Elite ranked.\n` +
                    `  - Subs must be confirmed before the tournament begins.\n` +
                    `  - No mid-series roster changes unless an emergency occurs.\n`+
                    `  - Your team must consist of:\n` +
                    `    - One **Warrior** 🛡️\n` +
                    `    - One **Elite** ⚔️\n` +
                    `    - One **Champion** 🏆\n` +
                    `    - One **Legend** 👑\n` +
                    `- **Roster Lock** – No roster changes after check-in.`
                },
                { name: '⏳ **4. Match Rules**', value:
                    `- **Time to play** – Players must be ready **10 minutes before the match starts**.\n` +
                    `  - Teams that fail to start within 10 minutes will forfeit Game 1.\n` +
                    `  - A full team must be present for Game 2, or the series is forfeited.\n\n` +
                    `- **Disconnects & Technical Issues**\n` +
                    `  - If a player **disconnects within the first 30 seconds**, the round will be restarted.\n` +
                    `  - **Each team gets 1 restart per match.**\n` +
                    `  - If a player disconnects mid-game, the match continues unless the server crashes.\n` +
                    `  - If a player **cannot reconnect within 5 minutes**, the team must continue shorthanded or forfeit.\n\n` +
                    `- **Tiebreakers**\n` +
                    `  - If a match ends in a tie, a **sudden-death overtime round** will be played.`
                },
                { name: '⚖️ **5. CL Rules & Banned Items**', value:
                    `- **Weapon Restrictions** – Follow CL rules for banned weapons/perks/attachments.\n` +
                    `- **Killstreaks** – Follow CL rules for killstreaks.\n`
                },
                { name: '🚨 **6. Code of Conduct & Fair Play**', value:
                    `- **No Cheating** – Any use of third-party software (aimbot, wallhacks, macros) = **permanent tournament ban.**\n` +
                    `- **No Unsportsmanlike Conduct** – Trash talk is allowed, but excessive BM (bad manners), racism, threats, or harassment = **instant disqualification.**\n` +
                    `- **No Multi-Accounting** – Players must use their **main account**; smurfing = **team disqualification.**\n` +
                    `- **Streaming Requirements:**\n` +
                    `  - Players may be required to **monitor cam** if called out for cheating.\n` +
                    `  - **Tournament staff may spectate and record matches.**`
                },
                { name: '📢 **7. Reporting & Communication**', value:
                    `- **LOCL Discord** – All players must be in the LOCL Discord server.\n` +
                    `- **Match results** – All match results must be reported within **10 minutes** after the match ends.\n` +
                    `- **Disputes & Violations** – Should be reported immediately with proof (screenshots/videos).`
                },
                { name: '🏅 **8. Prizing & Rewards**', value:
                    `- **Prize Distribution** – Winners will receive **cash prizes, tournament points, or special Discord roles.**\n` +
                    `- **Payout Timeframe** – Prizes will be distributed **within 30 days** of the tournament’s conclusion.\n` +
                    `- **Payment** – Winners must provide **valid payment information** (e.g., PayPal, Venmo, etc.).`
                },
                { name: '🚫 **9. Rule Enforcement & Penalties**', value:
                    `- **First Violation** – Warning.\n` +
                    `- **Second Violation** – Match Forfeit.\n` +
                    `- **Severe Offenses** – (Cheating, Harassment, Match Fixing) **Permanent Ban from all LOCL tournaments.**\n`
                },
                { name: '🚀 **10. Summary**', value:
                    `- ✅ **Randomized maps & fair seeding**\n` +
                    `- ✅ **Structured team compositions**\n` +
                    `- ✅ **Strict rules for cheating & conduct**\n` +
                    `- ✅ **Clear penalties & prize distribution**`
                }
            );

        const msg = await message.channel.send({ embeds: [embed] });

        // React with the checkmark emoji automatically
        await msg.react(CHECKMARK_EMOJI);
    }
});

    // ✅ Send Welcome Steps Embed
    client.on('messageCreate', async (message) => {
        if (message.content === '!sendwelcome' && message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            const embed = new EmbedBuilder()
                .setColor(0x2ecc71) // Green
                .setTitle("**Welcome to LOCL – Legends of COD League!**")
                .setDescription(
                    "**Compete. Dominate. Rise to the Top!**\n\n" +

                    "You've just joined one of the most intense Call of Duty competitive communities!\n" +
                    "Get ready to team up, compete, and prove your skills.\n\n" +

                    "**Next Steps for New Members**\n\n" +
                    
                    "✅ **Step 1:** Read the (<#" + RULES_CHANNEL_ID + ">) to understand our guidelines.\n" +
                    "✅ **Step 2:** Select Get Ranked in (<#" + GET_RANK_CHANNEL_ID + ">) and wait for a ranker to respond.\n" +
                    "✅ **Step 3:** Introduce yourself in (<#" + INTRODUCTIONS_CHANNEL_ID + ">).\n" +
                    "✅ **Step 4:** Check out upcoming games in (<#" + TOURNAMENT_INFO_CHANNEL_ID + ">).\n" +
                    "✅ **Step 5:** Join the fight! Connect with players in (<#" + LOOKING_FOR_TEAM_CHANNEL_ID + ">).\n\n" +

                    "📞 **Contact Staff**\n" +
                    "*If you need help, message a* <@&" + ADMIN_ROLE_ID + ">.\n\n" // Mention the Admin role
                )
                .setFooter({ text: "Welcome to LOCL - Legends of COD League | Good Luck & Have Fun!", iconURL: message.guild.iconURL() });
    
            await message.channel.send({ embeds: [embed] });
        }
    });
    
// ✅ Send Ticket Embed
client.on('messageCreate', async (message) => {
    if (message.content === '!sendticket' && message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
        const embed = new EmbedBuilder()
            .setColor(0xed4245)
            .setTitle('Need to get ranked?')
            .setDescription(
                `**Ranks**\n\n` +
                `1. **Warrior** 🛡️\n` +
                `– Entry-level rank for beginners and casual players.\n\n` +

                `2. **Elite** ⚔️\n` +
                `– Intermediate players with solid skills and game sense.\n\n` +

                `3. **Champion** 🏆\n` +
                `– Top-tier competitors, highly skilled in mechanics and strategy.\n\n` +

                `4. **Legend** 👑\n` +
                `– The absolute best, representing mastery and dominance.\n\n` +

                `**Click the button below to schedule a time with a <@&${SUPPORT_ROLE_ID}>.**\n`
            
            
            );

        const button = new ButtonBuilder()
            .setCustomId('create_ticket')
            .setLabel('Get Ranked')
            .setStyle(ButtonStyle.Danger)
            .setEmoji('🗒️');

        const row = new ActionRowBuilder().addComponents(button);
        await message.channel.send({ embeds: [embed], components: [row] });
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

// 🎟️ Handle Ticket Creation
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isButton()) return;

    if (interaction.customId === 'create_ticket') {
        const { guild, user } = interaction;
        const safeName = user.displayName.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();

        const existingChannel = guild.channels.cache.find((channel) => channel.name === `${safeName}`);
        if (existingChannel) {
            return interaction.reply({ content: '❌ You already have an open ticket!', ephemeral: true });
        }

        const ticketChannel = await guild.channels.create({
            name: `${safeName}`,
            type: 0, // Text channel
            parent: TICKET_CATEGORY_ID,
            permissionOverwrites: [
                { id: guild.roles.everyone, deny: [PermissionsBitField.Flags.ViewChannel] },
                { id: user.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] },
                { id: SUPPORT_ROLE_ID, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] }
            ]
        });

        const embed = new EmbedBuilder()
            .setColor(0xed4245)
            .setTitle(`🗒️ Need to get Ranked?`)
            .setDescription(`A <@&${SUPPORT_ROLE_ID}> will assist you shortly. Click ❌ to close.`);

        const closeButton = new ButtonBuilder()
            .setCustomId('close_ticket')
            .setLabel('Close')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('❌');

        const row = new ActionRowBuilder().addComponents(closeButton);
        await ticketChannel.send({ content: `<@${user.id}>`, embeds: [embed], components: [row] });

        await interaction.reply({ content: `✅ Your ticket has been created: ${ticketChannel}`, ephemeral: true });
    }

    // 🔒 Handle Ticket Closing
    if (interaction.customId === 'close_ticket') {
        const ticketChannel = interaction.channel;
        await interaction.reply({ content: '✅ This ticket will be deleted in 5 seconds...', ephemeral: true });
        setTimeout(() => ticketChannel.delete(), 5000);
    }
});

console.log("Loaded token:", process.env.DISCORD_TOKEN ? "✅ Token detected" : "❌ No token found");

client.login(TOKEN);


  