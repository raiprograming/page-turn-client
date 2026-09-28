import { useRef } from 'react';
import TinderCard from 'react-tinder-card';
import { Link } from 'react-router';
import { Box, Typography } from '@mui/material';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import useIntelligence from './use-intelligence';
import styles from './intelligence.module.css';

interface TinderCardApi {
    swipe: (dir?: 'left' | 'right' | 'up' | 'down') => Promise<void>;
    restoreCard: () => Promise<void>;
}

// Hardcoded insight shown in the bulb tip box for every news item.
const TIP_CONTENT = 'Every headline here can move markets, jobs, or your own money — we break down why it matters.';

function Intelligence() {
    const {
        currentNews,
        hasMoreNews,
        isAtFirstItem,
        loading,
        errorMessage,
        handleCardLeftScreen,
        handleScroll,
        handleSave,
        handleShare,
        getCoverImageUrl,
        reloadFromStart,
    } = useIntelligence();
    const cardRef = useRef<TinderCardApi | null>(null);

    const handleSwipeNext = () => {
        void cardRef.current?.swipe('left');
    };

    const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
        handleScroll(event.deltaX);
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
            <Box className={styles.page} onWheel={handleWheel}>
                <Typography className={styles.statusText}>You're all caught up. No more news for now.</Typography>
                <button type="button" className={`${styles.link} ${styles.startFreshAction}`} onClick={reloadFromStart}>
                    Start fresh
                </button>
            </Box>
        );
    }

    return (
        <Box className={styles.page} onWheel={handleWheel}>
            <TinderCard
                ref={cardRef}
                key={currentNews._id ?? currentNews.title}
                className={styles.tinderCard}
                onCardLeftScreen={handleCardLeftScreen}
                swipeRequirementType='position'
                swipeThreshold={100}
                preventSwipe={isAtFirstItem ? ['up', 'down', 'right'] : ['up', 'down']}
            >
                <Box className={styles.card}>
                    <Box className={styles.categoryRow}>
                        <Typography className={styles.category}>{currentNews.category}</Typography>
                        <span className={styles.liveDot} />
                    </Box>

                    <Box className={styles.titleRow}>
                        <Typography className={styles.title}>{currentNews.title}</Typography>
                        <Typography className={styles.meta}>{currentNews.readDuration}</Typography>
                    </Box>


                    <Box className={styles.coverImageWrapper}>
                        <img src={getCoverImageUrl(currentNews)} alt={currentNews.title} className={styles.coverImage} />
                    </Box>

                    <Box className={styles.contentWrapper}>
                        <div className={styles.content}>{currentNews.summary}</div>
                        <Link to={`/read?newsId=${currentNews._id}`} className={`${styles.link} ${styles.readMoreLink}`}>
                            Click here
                        </Link>
                    </Box>

                    <Box className={styles.tipBox}>
                        <LightbulbOutlinedIcon className={styles.tipIcon} />
                        <Typography className={styles.tipText}>{TIP_CONTENT}</Typography>
                    </Box>

                    {/* <Box className={styles.audienceRow}>
                        <Typography className={styles.audienceLabel}>For {currentNews.audience}</Typography>
                        {currentNews.audienceDescription && (
                            <Typography className={styles.audienceDescription}>{currentNews.audienceDescription}</Typography>
                        )}
                    </Box> */}

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
