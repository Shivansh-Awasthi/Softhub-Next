import SingleApp from '@/app/download/[platform]/[title]/[id]/SingleApp';

export async function generateMetadata({ params }) {
    try {
        const { platform, title, id } = params;
        const appData = await fetchAppData(id);

        return {
            title: `${appData.title || title} - Download for ${appData.platform || platform}`,
            description: appData.description ?
                appData.description.substring(0, 160) :
                `Download ${title} for ${platform} - Free and safe download`,
            openGraph: {
                title: `${appData.title || title} - Download for ${appData.platform || platform}`,
                description: appData.description ?
                    appData.description.substring(0, 160) :
                    `Download ${title} for ${platform} - Free and safe download`,
                images: appData.thumbnail && appData.thumbnail.length > 0 ?
                    [{ url: appData.thumbnail[0] }] :
                    [],
            },
        };
    } catch (error) {
        console.error('Error generating metadata:', error);
        return {
            title: `Download ${params.title} for ${params.platform}`,
            description: 'Download games and software for various platforms',
        };
    }
}

async function fetchAppData(id) {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/apps/get/${id}`,
            {
                headers: {
                    'X-Auth-Token': 'my-secret-token-123',
                },
                cache: 'no-store',
            }
        );

        if (!res.ok) {
            throw new Error(`API error: ${res.status}`);
        }

        const data = await res.json();
        return data.app || {};
    } catch (error) {
        console.error('Error fetching app data:', error);
        return {};
    }
}

export default async function DownloadPage({ params }) {
    const { id } = params;
    const appData = await fetchAppData(id);

    return (
        <div className="min-h-screen text-white">
            <SingleApp appData={appData} />
        </div>
    );
}
