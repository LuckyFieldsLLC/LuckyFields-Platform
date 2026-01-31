export default function Home() {
    return (
        <main style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            textAlign: 'center'
        }}>
            <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '1rem' }}>
                Coming Soon: Interactive Experience
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.6)' }}>
                Stay tuned for the next evolution of LuckyFields.Lab
            </p>
        </main>
    );
}
