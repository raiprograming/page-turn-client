import { useRef } from 'react';
import TinderCard from 'react-tinder-card';
import { Link } from 'react-router';
import { Alert, Box, Snackbar, Typography } from '@mui/material';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import useIntelligence from './use-intelligence';
import styles from './intelligence.module.css';

interface TinderCardApi {
    swipe: (dir?: 'left' | 'right' | 'up' | 'down') => Promise<void>;
    restoreCard: () => Promise<void>;
}

function Intelligence() {
    const {
        currentNews,
        hasMoreNews,
        isAtFirstItem,
        isSpecificView,
        loading,
        errorMessage,
        handleCardLeftScreen,
        handleScroll,
        handleSave,
        handleShare,
        getCoverImageUrl,
        reloadFromStart,
        exitSpecificView,
        isToastOpen,
        toastMessage,
        closeToast,
    } = useIntelligence();
    const cardRef = useRef<TinderCardApi | null>(null);

    const handleSwipeNext = () => {
        void cardRef.current?.swipe('left');
    };

    const handleFooterAction = () => {
        if (isSpecificView) {
            exitSpecificView();
            return;
        }

        handleSwipeNext();
    };

    const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
        handleScroll(event.deltaX);
    };

    const renderToast = () => (
        <Snackbar
            open={isToastOpen}
            autoHideDuration={4000}
            onClose={closeToast}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
            <Alert onClose={closeToast} severity="success" variant="filled" sx={{ width: '100%' }}>
                {toastMessage}
            </Alert>
        </Snackbar>
    );

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
                        <p className={styles.content}>{currentNews.summary}</p>
                    </Box>

                    <Box className={styles.readMore}>
                        <Link to={`/intelligence/${currentNews._id}`} className={`${styles.link} ${styles.readMoreLink}`}>
                            Click here
                        </Link>
                    </Box>

                    <Box className={styles.tipBox}>
                        <LightbulbOutlinedIcon className={styles.tipIcon} />
                        <Typography className={styles.tipText}>{currentNews.whyItMatters}</Typography>
                    </Box>

                    <Box className={styles.footer}>
                        <button type="button" aria-label="Save" className={`${styles.footerAction} pressable`} onClick={handleSave}>
                            <BookmarkBorderIcon fontSize="small" />
                        </button>
                        <button type="button" aria-label="Share" className={`${styles.footerAction} pressable`} onClick={handleShare}>
                            <ShareOutlinedIcon fontSize="small" />
                        </button>
                        <button type="button" className={`${styles.swipeNextAction} pressable`} onClick={handleFooterAction}>
                            {isSpecificView ? 'Read more' : 'Swipe for next news'}
                            <ArrowForwardIcon fontSize="small" />
                        </button>
                    </Box>
                </Box>
            </TinderCard>
            {renderToast()}
        </Box>
    );
}

export default Intelligence;
