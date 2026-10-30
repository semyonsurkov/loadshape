const DELAY_MS = 1200;
const POSTS = [
  {
    id: '1',
    title: 'Reuse the same component',
    summary: 'Render real cards with representative placeholder data.',
  },
  {
    id: '2',
    title: 'Keep content while refreshing',
    summary: 'Show the previous response until a refresh finishes.',
  },
];

export async function GET(request: Request) {
  const scenario = new URL(request.url).searchParams.get('scenario');
  if (scenario !== 'success' && scenario !== 'empty' && scenario !== 'error') {
    return Response.json({ message: 'Unknown response scenario.' }, { status: 400 });
  }
  await new Promise((resolve) => setTimeout(resolve, DELAY_MS));
  if (scenario === 'error')
    return Response.json({ message: 'The example request failed.' }, { status: 503 });
  return Response.json(scenario === 'empty' ? [] : POSTS);
}
