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

    // ✅ Send Welcome Steps Embed
    if (message.content === '!sendwelcome' && message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
        const embed = new EmbedBuilder()
            .setColor(0x2ecc71) // Green
            .setTitle("✅ **Next Steps for New Members**")
            .setDescription(
                "You've just joined one of the most intense Call of Duty competitive communities!\n" +
                "Get ready to team up, compete, and prove your skills.\n\n" +
                
                "✅ **Step 1:** Read the <#" + RULES_CHANNEL_ID + "> to understand our guidelines.\n" +
                "✅ **Step 2:** Select Get Ranked in <#" + GET_RANK_CHANNEL_ID + "> and wait for a ranker to respond.\n" +
                "✅ **Step 3:** Introduce yourself in <#" + INTRODUCTIONS_CHANNEL_ID + ">.\n" +
                "✅ **Step 4:** Check out upcoming games in <#" + TOURNAMENT_INFO_CHANNEL_ID + ">.\n" +
                "✅ **Step 5:** Join the fight! Connect with players in <#" + LOOKING_FOR_TEAM_CHANNEL_ID + ">."
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

// 🎟️ Handle Ticket Creation
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isButton()) return;

    if (interaction.customId === 'create_ticket') {
        const { guild, user } = interaction;
        const safeName = user.username.toLowerCase().replace(/[^a-zA-Z0-9]/g, '');

        // Check for existing ticket
        const existingChannel = guild.channels.cache.find((channel) => channel.name === safeName);
        if (existingChannel) {
            return interaction.reply({ content: '❌ You already have an open ticket!', ephemeral: true });
        }

        // Create ticket channel
        const ticketChannel = await guild.channels.create({
            name: `ticket-${safeName}`,
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
            .setTitle(`🗒️ ${user.username}'s Ticket`)
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
        await interaction.reply({ content: '✅ Closing ticket in 5 seconds...', ephemeral: true });
        setTimeout(() => ticketChannel.delete(), 5000);
    }
});

console.log("Loaded token:", process.env.DISCORD_TOKEN ? "✅ Token detected" : "❌ No token found");

client.login(TOKEN);





