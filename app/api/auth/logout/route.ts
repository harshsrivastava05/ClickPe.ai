export async function POST() {
  return new Response('Logged out', {
    headers: {
      'Set-Cookie': 'token=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0',
    },
  });
}
