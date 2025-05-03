// app/category/android/games/page.jsx
export default async function Page({ searchParams }) {
    const page = searchParams.page || 1;

    const res = await fetch(`https://api.example.com/games?page=${page}`, {
        cache: 'no-store',
    });
    const data = await res.json();

    return (
        <div>
            <h1>Games</h1>
            {data.map(game => (
                <div key={game.id}>{game.title}</div>
            ))}
        </div>
    );
}