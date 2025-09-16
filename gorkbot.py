import discord
from discord.ext import commands
import random
import os

# Bot setup with intents
intents = discord.Intents.default()
intents.message_content = True

bot = commands.Bot(command_prefix='!', intents=intents)

# The two responses to randomly choose from
RESPONSES = [
    "Yeh, nah",
    "Nah, yeh"
]

@bot.event
async def on_ready():
    print(f'{bot.user} has connected to Discord!')
    print(f'Bot is ready to respond to mentions!')

@bot.event
async def on_message(message):
    # Don't respond to the bot's own messages
    if message.author == bot.user:
        return
    
    # Parse message content for user ID mentions and role mentions
    bot_mentioned = False
    
    # Check for <@BOT_ID> format (regular mention)
    if f"<@{bot.user.id}>" in message.content:
        bot_mentioned = True
    
    # Check for <@!BOT_ID> format (nickname mention)
    if f"<@!{bot.user.id}>" in message.content:
        bot_mentioned = True
    
    # Check for role mentions if the message is in a guild (server)
    if message.guild and not bot_mentioned:
        # Get the bot's member object in this guild
        bot_member = message.guild.get_member(bot.user.id)
        if bot_member:
            # Check each of the bot's roles
            for role in bot_member.roles:
                # Check for <@&ROLE_ID> format (role mention)
                if f"<@&{role.id}>" in message.content:
                    bot_mentioned = True
                    break
    
    
    if bot_mentioned:
        # Randomly pick one of the two responses
        response = random.choice(RESPONSES)
        print(f"Sending response: {response}")
        await message.channel.send(response)
    



# Run the bot
if __name__ == "__main__":
    # Get token from environment variable for security
    TOKEN = os.getenv('DISCORD_BOT_TOKEN')
    
    if not TOKEN:
        print("Please set the DISCORD_BOT_TOKEN environment variable")
        print("You can get a token from https://discord.com/developers/applications")
    else:
        bot.run(TOKEN)
