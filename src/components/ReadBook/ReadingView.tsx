import TinderCard from 'react-tinder-card';
import { Typography } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import type { BookPage } from '../../api';
import { buildAssetUrl } from '../Admin/Books/use-books';
import readStyles from '../Read/read.module.css';
import styles from './ReadingView.module.css';
import useReadingView from './use-reading-view';

interface ReadingViewProps {
    pages: BookPage[];
}

function ReadingView({ pages }: ReadingViewProps) {
    const {
        cardRef,
        bodyRef,
        currentPage,
        isLastPage,
        progressPercent,
        pageLabel,
        preventSwipe,
        handleCardLeftScreen,
        handleTurnPage,
        handleWheel,
        handleExit,
    } = useReadingView(pages);

    const imageName = currentPage?.image?.[0]?.name;

    return (
        <div className={styles.root} onWheel={handleWheel}>
            <div className={styles.progressSection}>
                <div className={styles.progressTrack}>
                    <div className={styles.progressFill} style={{ width: `${progressPercent}%` }} />
                </div>
                <div className={styles.progressMeta}>
                    <span className={styles.pageLabel}>{pageLabel}</span>
                    <span className={styles.percent}>{progressPercent}% complete</span>
                </div>
            </div>

            {currentPage ? (
                <TinderCard
                    ref={cardRef}
                    key={currentPage._id}
                    className={styles.tinderCard}
                    onCardLeftScreen={handleCardLeftScreen}
                    swipeRequirementType="position"
                    swipeThreshold={100}
                    preventSwipe={preventSwipe}
                >
                    <div className={styles.card}>
                        <div ref={bodyRef} className={`${styles.cardBody} pressable`}>
                            {imageName && (
                                <img
                                    src={buildAssetUrl(imageName)}
                                    alt={currentPage.title}
                                    className={`${styles.pageImage} pressable`}
                                    draggable={false}
                                />
                            )}
                            <h2 className={`${styles.pageTitle} pressable`}>{currentPage.title}</h2>
                            <p className={`${styles.summary} pressable`}>{currentPage.summary}</p>
                            {currentPage.highlight && (
                                <p className={`${styles.highlight} pressable`}>{currentPage.highlight}</p>
                            )}
                        </div>
                    </div>
                </TinderCard>
            ) : (
                <Typography className={readStyles.pageSubtitle}>This book has no pages yet.</Typography>
            )}

            <div className={styles.footer}>
                <button type="button" className={styles.exitButton} onClick={handleExit}>
                    Exit Reading View
                </button>
                {!isLastPage && (
                    <button type="button" className={styles.turnButton} onClick={handleTurnPage}>
                        Turn the page <ArrowForwardIcon fontSize="small" />
                    </button>
                )}
            </div>
        </div>
    );
}

export default ReadingView;
