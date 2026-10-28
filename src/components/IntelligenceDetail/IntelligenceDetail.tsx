import { Alert, Box, Snackbar, Typography } from '@mui/material';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import useIntelligenceDetail from './use-intelligence-detail';
import styles from './IntelligenceDetails.module.css';

function IntelligenceDetail() {
    const { news, loading, errorMessage, getCoverImageUrl, handleSave, handleShare, isToastOpen, toastMessage, closeToast } = useIntelligenceDetail();

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
                <Typography className={styles.statusText}>Loading news...</Typography>
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

    if (!news) {
        return (
            <Box className={styles.page}>
                <Typography className={styles.statusText}>News not found.</Typography>
            </Box>
        );
    }

    return (
        <Box className={styles.page}>
            <Box className={styles.card}>
                <Box className={styles.categoryRow}>
                    <Typography className={styles.category}>{news.category}</Typography>
                    <span className={styles.liveDot} />
                </Box>

                <Box className={styles.titleRow}>
                    <Typography className={styles.title}>{news.title}</Typography>
                    <Typography className={styles.meta}>{news.readDuration}</Typography>
                </Box>

                <Box className={styles.coverImageWrapper}>
                    <img src={getCoverImageUrl(news)} alt={news.title} className={styles.coverImage} />
                </Box>

                <Box className={styles.contentWrapper}>
                    <p className={styles.content}>{news.audienceDescription}</p>
                </Box>

                <Box className={styles.tipBox}>
                    <LightbulbOutlinedIcon className={styles.tipIcon} />
                    <Typography className={styles.tipText}>{news.whyItMatters}</Typography>
                </Box>

                <Box className={styles.footer}>
                    <button type="button" aria-label="Save" className={`${styles.footerAction} pressable`} onClick={handleSave}>
                        <BookmarkBorderIcon fontSize="small" />
                    </button>
                    <button type="button" aria-label="Share" className={`${styles.footerAction} pressable`} onClick={handleShare}>
                        <ShareOutlinedIcon fontSize="small" />
                    </button>
                </Box>
            </Box>
            {renderToast()}
        </Box>
    );
}

export default IntelligenceDetail;
