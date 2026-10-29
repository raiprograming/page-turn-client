import type { NewsListItem } from '../../api';

const META_PARAM = 'meta';

export async function shareNews(news: NewsListItem, newsId: string) {
    const shareUrl = new URL(window.location.href);
    shareUrl.search = '';
    shareUrl.searchParams.set(META_PARAM, newsId);

    const shareData: ShareData = {
        title: news.title,
        text: news.summary,
        url: shareUrl.toString(),
    };

    try {
        if (navigator.share && (!navigator.canShare || navigator.canShare(shareData))) {
            await navigator.share(shareData);
            return;
        }

        if (navigator.clipboard?.writeText) {
            await navigator.clipboard.writeText(shareData.url || "");
        }
    } catch (error: unknown) {
        if (error instanceof DOMException && error.name === 'AbortError') {
            return;
        }

        console.error('Failed to share news:', error);
    }
}
