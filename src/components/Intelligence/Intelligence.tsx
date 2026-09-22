import { useRef } from 'react';
import TinderCard from 'react-tinder-card';
import { Box, Typography } from '@mui/material';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import useIntelligence from './use-intelligence';
import styles from './intelligence.module.css';

interface TinderCardApi {
    swipe: (dir?: 'left' | 'right' | 'up' | 'down') => Promise<void>;
    restoreCard: () => Promise<void>;
}

// Placeholder link for the "Click here" call to action inside the news content.
const DEMO_LINK_HREF = '#';
// Hardcoded insight shown in the bulb tip box for every news item.
const TIP_CONTENT = 'Every headline here can move markets, jobs, or your own money — we break down why it matters.';

function Intelligence() {
    const { currentNews, hasMoreNews, loading, errorMessage, goToNextNews, handleSave, handleShare, getCoverImageUrl } = useIntelligence();
    const cardRef = useRef<TinderCardApi | null>(null);

    const handleSwipeNext = () => {
        void cardRef.current?.swipe('left');
    };

    if (loading) {
        return (
            <Box className={styles.page}>
                <Typography className={styles.statusText}>Loading intelligence feed...</Typography>
            </Box>
        );
    }

    if (errorMessage) {
        return (
            <Box className={styles.page}>
                <Typography className={styles.statusText} color="error">
                    {errorMessage}
                </Typography>
            </Box>
        );
    }

    if (!hasMoreNews || !currentNews) {
        return (
            <Box className={styles.page}>
                <Typography className={styles.statusText}>You're all caught up. No more news for now.</Typography>
            </Box>
        );
    }

    return (
        <Box className={styles.page}>
            <TinderCard
                ref={cardRef}
                key={currentNews._id ?? currentNews.title}
                className={styles.tinderCard}
                onCardLeftScreen={goToNextNews}
                preventSwipe={['up', 'down']}
            >
                <Box className={styles.card}>
                    <Box className={styles.categoryRow}>
                        <Typography className={styles.category}>{currentNews.category}</Typography>
                        <span className={styles.liveDot} />
                    </Box>

                    <Typography className={styles.title}>{currentNews.title}</Typography>

                    <Typography className={styles.meta}>{currentNews.readDuration}</Typography>

                    <Box className={styles.coverImageWrapper}>
                        <img src={getCoverImageUrl(currentNews)} alt={currentNews.title} className={styles.coverImage} />
                    </Box>

                    <Typography className={styles.content}>
                        {currentNews.whyItMatters}{' '}
                        <a href={DEMO_LINK_HREF} className={styles.link}>
                            Click here
                        </a>
                    </Typography>

                    <Box className={styles.tipBox}>
                        <LightbulbOutlinedIcon className={styles.tipIcon} />
                        <Typography className={styles.tipText}>{TIP_CONTENT}</Typography>
                    </Box>

                    <Typography className={styles.audienceLabel}>For {currentNews.audience}</Typography>
                    {currentNews.audienceDescription && (
                        <Typography className={styles.audienceDescription}>{currentNews.audienceDescription}</Typography>
                    )}

                    <Box className={styles.footer}>
                        <button type="button" className={`${styles.footerAction} pressable`} onClick={handleSave}>
                            Save
                        </button>
                        <button type="button" className={`${styles.footerAction} pressable`} onClick={handleShare}>
                            Share
                        </button>
                        <button type="button" className={`${styles.swipeNextAction} pressable`} onClick={handleSwipeNext}>
                            Swipe for next news
                            <ArrowForwardIcon fontSize="small" />
                        </button>
                    </Box>
                </Box>
            </TinderCard>
        </Box>
    );
}

export default Intelligence;
