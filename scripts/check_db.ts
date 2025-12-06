import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('--- Checking Users ---')
  const users = await prisma.user.findMany({
    orderBy: { id: 'desc' },
    take: 5
  })

  users.forEach((u: any) => {
    console.log("Keys:", Object.keys(u));
    console.log(JSON.stringify({ 
      email: u.email, 
      passwordSample: u.password ? u.password.substring(0, 10) + '...' : 'NULL', 
      passwordLength: u.password?.length 
    }, null, 2))
  })

  console.log('\n--- Checking Chat Messages ---')
  const chats = await prisma.chatMessage.findMany({
    orderBy: { created_at: 'desc' },
    take: 5
  })
  
  if (chats.length === 0) {
      console.log("No chat messages found.")
  } else {
      chats.forEach(c => {
        console.log(`Chat: [${c.role}] ${c.content.substring(0, 50)}... (User: ${c.user_id})`)
      })
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())
