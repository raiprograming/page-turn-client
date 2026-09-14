import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import BoltOutlinedIcon from "@mui/icons-material/BoltOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import StarIcon from "@mui/icons-material/Star";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import MemoryOutlinedIcon from "@mui/icons-material/MemoryOutlined";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import AutoStoriesOutlinedIcon from "@mui/icons-material/AutoStoriesOutlined";
import GooglePlayIcon from "@mui/icons-material/Shop";
import AppleIcon from "@mui/icons-material/Apple";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import XIcon from "@mui/icons-material/X";
import FacebookIcon from "@mui/icons-material/Facebook";
import YouTubeIcon from "@mui/icons-material/YouTube";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import MailOutlineIcon from "@mui/icons-material/Mail";
import HeadsetMicIcon from "@mui/icons-material/HeadsetMic";
import LanguageIcon from "@mui/icons-material/Language";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import heroVisual from "../../assets/home/hero-visual.png";
import ctaMockup from "../../assets/home/cta/mockup.svg";
import qrCode from "../../assets/home/cta/qr.png";
import styles from "./home.module.css";

const features = ["Daily Intelligence", "Readers Room", "Books Marketplace"];

const platformLinks = ["Daily Intelligence", "Readers Room", "Books Marketplace", "Buy Books", "Sell Books", "Rent Books", "Donate Books", "Download App"];
const companyLinks = ["About Us", "Our Mission", "Careers", "Blogs", "Press Kit", "Contact Us", "FAQs"];
const legalLinks = ["Privacy Policy", "Terms & Conditions", "Refund Policy", "Community Guidelines", "Copyright Policy", "Help Center", "Support", "Report an Issue"];
const footerBottomLinks = ["Privacy Policy", "Terms & Conditions", "Cookie Policy", "Disclaimer"];

const footerColumns = [
    { title: "Platform", links: platformLinks },
    { title: "Company", links: companyLinks },
    { title: "Legal & Support", links: legalLinks },
];

const socialIcons = [InstagramIcon, LinkedInIcon, XIcon, FacebookIcon, YouTubeIcon, ChatBubbleOutlineIcon];

const contactDetails = [
    { icon: MailOutlineIcon, label: "Email", value: "contact@pageturn.in" },
    { icon: HeadsetMicIcon, label: "Support", value: "support@pageturn.in" },
    { icon: LanguageIcon, label: "Website", value: "www.pageturn.in" },
    { icon: PlaceOutlinedIcon, label: "Location", value: "Mumbai, Maharashtra, India" },
    { icon: AccessTimeIcon, label: "Working Hours", value: "Mon – Sat · 9 AM – 7 PM IST" },
];

const platformFeatures = [
    { icon: MemoryOutlinedIcon, label: "AI Powered" },
    { icon: PlaceOutlinedIcon, label: "Made in India" },
    { icon: ShieldOutlinedIcon, label: "Secure Platform" },
    { icon: GroupsOutlinedIcon, label: "Community Driven" },
    { icon: FavoriteBorderIcon, label: "Book Lovers" },
    { icon: AutoStoriesOutlinedIcon, label: "Knowledge First" },
];


function Home() {
    const downloadAppContent = (
        <>
            <p className={styles.footerDownloadTitle}>Download the App</p>
            <Box className={styles.footerDownloadRow}>
                <Box className={styles.footerQr}>
                    <img src={qrCode} alt="Scan to download the PageTurn app" />
                </Box>
                <Box className={styles.footerStoreButtons}>
                    <Button className={styles.footerStoreButtonDark} disableElevation>
                        <GooglePlayIcon fontSize="small" />
                        <span className={styles.storeButtonLabel}>Google Play</span>
                    </Button>
                    <Button className={styles.footerStoreButtonLight} disableElevation>
                        <AppleIcon fontSize="small" />
                        <span className={styles.storeButtonLabel}>iOS — Soon</span>
                    </Button>
                </Box>
            </Box>
        </>
    );

    return (
        <>
        <Box  className={styles.hero}>
            <Box>
                <Box className={styles.badge}>
                    <span className={styles.dot} />
                    The New Way to Buy · Sell · Learn · Earn
                </Box>

                <h1 className={styles.title}>
                    PageTurn
                </h1>

                <p className={styles.subtitle}>
                    India's First AI-Powered Knowledge Marketplace
                </p>

                <p className={styles.description}>
                    Read Less. Understand More. Make Better Decisions.
                </p>

                <Box className={styles.actions}>
                    <Button className={styles.primaryButton} variant="contained" disableElevation>
                        Download App
                    </Button>
                    <Button className={styles.secondaryButton} variant="outlined">
                        Explore Platform
                    </Button>
                </Box>

                <Box component="ul" className={styles.features}>
                    {features.map((feature) => (
                        <li key={feature}>
                            <span className={styles.dot} />
                            {feature}
                        </li>
                    ))}
                </Box>
            </Box>

            <Box className={styles.visualWrapper}>
                <img src={heroVisual} alt="PageTurn platform preview across web and mobile" className={styles.visual} />
            </Box>
        </Box>

        <Box component="section" className={styles.section}>
            <p className={styles.eyebrow}>Our Products</p>
            <p className={styles.productsTitle}>
                Everything You Need to Learn Better
            </p>
            <p className={styles.productsSubtitle}>
                Three products. One ecosystem. Built for how India actually learns today.
            </p>

            <Box className={styles.cardsGrid}>
                <Card className={styles.card} elevation={0}>
                    <CardContent>
                        <Box className={styles.cardIcon}>
                            <BoltOutlinedIcon fontSize="medium" />
                        </Box>
                        <Typography className={styles.cardTitle}>Daily Intelligence</Typography>
                        <Typography className={styles.cardDescription}>
                            Read India's most important news in under 60 seconds.
                        </Typography>

                        <Box className={styles.cardPreview}>
                            <Box className={styles.chipRow}>
                                <span className={styles.chipActive}>Finance</span>
                                <span className={styles.chip}>Business</span>
                                <span className={styles.chip}>Startup</span>
                            </Box>
                            <Box className={styles.chipRow}>
                                <span className={styles.chip}>Economy</span>
                                <span className={styles.chip}>Global</span>
                                <span className={styles.chip}>Sports</span>
                            </Box>

                            <Box className={styles.miniRow}>
                                <Box className={styles.miniSquare} />
                                <Box className={styles.miniLines}>
                                    <Box className={styles.miniLine} style={{ width: "80%" }} />
                                    <Box className={styles.miniLine} style={{ width: "40%" }} />
                                    <span className={styles.miniCaption}>58 sec read</span>
                                </Box>
                            </Box>
                            <Box className={styles.miniRow}>
                                <Box className={`${styles.miniSquare} ${styles.muted}`} />
                                <Box className={styles.miniLines}>
                                    <Box className={styles.miniLine} style={{ width: "70%" }} />
                                    <Box className={styles.miniLine} style={{ width: "30%" }} />
                                    <span className={styles.miniCaption}>42 sec read</span>
                                </Box>
                            </Box>
                        </Box>

                        <a href="#" className={styles.cardLink}>
                            Explore Daily Intelligence <ArrowForwardIcon fontSize="inherit" />
                        </a>
                    </CardContent>
                </Card>

                <Card className={styles.card} elevation={0}>
                    <CardContent>
                        <Box className={styles.cardIcon}>
                            <MenuBookOutlinedIcon fontSize="medium" />
                        </Box>
                        <Typography className={styles.cardTitle}>Readers Room</Typography>
                        <Typography className={styles.cardDescription}>
                            Understand bestselling books in minutes, not days.
                        </Typography>

                        <Box className={styles.cardPreview}>
                            <Box className={styles.bookRow}>
                                <Box className={styles.bookIcon} />
                                <Box className={`${styles.bookIcon} ${styles.active}`} />
                                <Box className={styles.bookIcon} />
                                <Box component="ul" className={styles.checklist}>
                                    <li className={styles.checkItem}>
                                        <CheckCircleOutlineIcon /> AI Summary
                                    </li>
                                    <li className={styles.checkItem}>
                                        <CheckCircleOutlineIcon /> Highlights &amp; Notes
                                    </li>
                                    <li className={styles.checkItem}>
                                        <CheckCircleOutlineIcon /> Audio Edition
                                    </li>
                                </Box>
                            </Box>

                            <Box className={styles.progressRow}>
                                <span>Progress tracker</span>
                                <span>62%</span>
                            </Box>
                            <Box className={styles.progressBar}>
                                <Box className={styles.progressFill} style={{ width: "62%" }} />
                            </Box>
                        </Box>

                        <a href="#" className={styles.cardLink}>
                            Explore Readers Room <ArrowForwardIcon fontSize="inherit" />
                        </a>
                    </CardContent>
                </Card>

                <Card className={styles.card} elevation={0}>
                    <CardContent>
                        <Box className={styles.cardIcon}>
                            <ShoppingBagOutlinedIcon fontSize="medium" />
                        </Box>
                        <Typography className={styles.cardTitle}>Books Marketplace</Typography>
                        <Typography className={styles.cardDescription}>
                            The smarter way to Buy, Sell, Rent and Earn from books.
                        </Typography>

                        <Box className={styles.cardPreview}>
                            <Box className={styles.productsRow}>
                                <Box className={styles.productCard}>
                                    <Box className={styles.miniSquare} />
                                    <Box className={styles.priceRow}>₹249</Box>
                                    <Box className={styles.rating}>
                                        <StarIcon /> 4.8 · Like New
                                    </Box>
                                </Box>
                                <Box className={styles.productCard}>
                                    <Box className={styles.miniSquare} />
                                    <Box className={styles.priceRow}>₹399</Box>
                                    <Box className={styles.rating}>
                                        <StarIcon /> 4.8 · Good
                                    </Box>
                                </Box>
                            </Box>

                            <Box className={styles.cardActions}>
                                <Button className={styles.cardButtonPrimary} variant="contained" disableElevation>
                                    Buy
                                </Button>
                                <Button className={styles.cardButtonSecondary} variant="outlined">
                                    Sell
                                </Button>
                                <Button className={styles.cardButtonSecondary} variant="outlined">
                                    Rent
                                </Button>
                            </Box>
                        </Box>

                        <a href="#" className={styles.cardLink}>
                            Visit Marketplace <ArrowForwardIcon fontSize="inherit" />
                        </a>
                    </CardContent>
                </Card>
            </Box>
        </Box>

        <Box component="section" className={styles.section}>
            <p className={styles.eyebrow}>About PageTurn</p>
            <h2 className={styles.productsTitle}>We fixed learning.</h2>
            <p className={styles.productsSubtitle}>Well… at least the frustrating parts.</p>

            <Box className={styles.cardsGrid}>
                <Card className={styles.card} elevation={0}>
                    <CardContent>
                        <span className={styles.cardBadge}>Daily Intelligence</span>
                        <h3 className={styles.cardQuestion}>Reading six newspapers before breakfast?</h3>
                        <hr className={styles.cardDivider} />
                        <p className={styles.cardAnswer}>We'll handle it.</p>
                    </CardContent>
                </Card>

                <Card className={styles.card} elevation={0}>
                    <CardContent>
                        <span className={styles.cardBadge}>Reader's Room</span>
                        <h3 className={styles.cardQuestion}>Spending weeks finishing one business book?</h3>
                        <hr className={styles.cardDivider} />
                        <p className={styles.cardAnswer}>We'll get you the key ideas faster.</p>
                    </CardContent>
                </Card>

                <Card className={styles.card} elevation={0}>
                    <CardContent>
                        <span className={styles.cardBadge}>Books Marketplace</span>
                        <h3 className={styles.cardQuestion}>Buying books only to watch them collect dust?</h3>
                        <hr className={styles.cardDivider} />
                        <p className={styles.cardAnswer}>Let's give them another chapter.</p>
                    </CardContent>
                </Card>
            </Box>

            <hr className={styles.closingDivider} />

            <h3 className={styles.closingTitle}>Most books don't change lives.</h3>
            <p className={styles.closingSubtitle}>Mostly because we never finish them.</p>

            <p className={styles.closingLead}>
                PageTurn brings together Daily Intelligence, Reader's Room, and a Books
                Marketplace into one seamless platform — helping you stay informed,
                learn smarter, and keep knowledge moving.
            </p>

            <p className={styles.cardTitle}>Less information overload.</p>
            <p className={styles.cardTitle}>More meaningful learning.</p>

            <div>
                <p className={styles.closingHeadline}>
                    One platform.
                </p>
                <p className={styles.closingHeadline}>
                    <span className={styles.accentColor}>Infinite learning.</span>
                </p>
            </div>
        </Box>

        <Box component="section" className={styles.section}>
            <p className={styles.eyebrow}>Get Started</p>
            <h2 className={styles.productsTitle}>Start Your Learning Journey Today</h2>
            <p className={styles.productsSubtitle}>
                Join students, professionals and lifelong learners who read smarter every single day.
            </p>

            <Box className={styles.ctaGrid}>
                <Box className={styles.ctaMockup}>
                    <img src={ctaMockup} alt="PageTurn web and mobile app preview" />
                </Box>

                <Box className={styles.downloadPanel}>
                    <Box className={styles.qrCode}>
                        <img src={qrCode} alt="Scan to download the PageTurn app" />
                    </Box>
                    <Box>
                        <p className={styles.downloadTitle}>Download the App</p>
                        <Button className={styles.storeButtonDark} disableElevation>
                            <GooglePlayIcon fontSize="small" />
                            <span className={styles.storeButtonText}>
                                <span className={styles.storeButtonCaption}>Get it on</span>
                                <span className={styles.storeButtonLabel}>Google Play</span>
                            </span>
                        </Button>
                        <Button className={styles.storeButtonLight} disableElevation>
                            <AppleIcon fontSize="small" />
                            <span className={styles.storeButtonText}>
                                <span className={styles.storeButtonCaption}>Coming soon on</span>
                                <span className={styles.storeButtonLabel}>App Store</span>
                            </span>
                        </Button>
                        <a href="https://www.pageturn.in" className={styles.cardLink}>
                            www.pageturn.in
                        </a>
                    </Box>
                </Box>
            </Box>

            <Box className={styles.featuresStrip}>
                <h3 className={styles.closingTitle}>Built for Modern Learners</h3>
                <p className={styles.featuresStripSubtitle}>
                    Business, finance, startups, technology and books — all in one place.
                </p>
                <Box className={styles.featuresStripGrid}>
                    {platformFeatures.map(({ icon: Icon, label }) => (
                        <Box key={label} className={styles.featuresStripItem}>
                            <Icon /> {label}
                        </Box>
                    ))}
                </Box>
            </Box>
        </Box>
        <Box component="footer" className={styles.footer}>
            <Box className={styles.footerGrid}>
                <Box>
                    <p className={styles.footerLogo}>
                        <AutoStoriesIcon className={styles.accentColor} /> PageTurn
                    </p>
                    <p className={styles.footerTagline}>India's First AI-Powered Knowledge Marketplace</p>
                    <p className={styles.footerDescription}>
                        PageTurn helps students, professionals and lifelong learners stay informed through
                        AI-powered Daily Intelligence, Readers Room and India's smartest Books Marketplace.
                    </p>
                    <p className={styles.footerQuote}>
                        "Read Less. Understand More. Make Better Decisions."
                    </p>
                    <Box className={styles.footerSocials}>
                        {socialIcons.map((Icon, index) => (
                            <Box key={index} component="a" href="#" className={styles.footerSocialIcon}>
                                <Icon />
                            </Box>
                        ))}
                    </Box>
                </Box>

                {footerColumns.map((column) => (
                    <Box key={column.title}>
                        <p className={styles.footerColumnTitle}>{column.title}</p>
                        <hr className={styles.footerColumnUnderline} />
                        <Box component="ul" className={styles.footerLinks}>
                            {column.links.map((link) => (
                                <li key={link}>
                                    <a href="#">{link}</a>
                                </li>
                            ))}
                        </Box>
                    </Box>
                ))}

                <Box>
                    <p className={styles.footerColumnTitle}>Get in Touch</p>
                    <hr className={styles.footerColumnUnderline} />
                    <Box component="ul" className={styles.footerContactList}>
                        {contactDetails.map(({ icon: Icon, label, value }) => (
                            <li key={label} className={styles.footerContactItem}>
                                <Icon />
                                <span>
                                    <span className={styles.footerContactLabel}>{label}</span>
                                    <span className={styles.footerContactValue}>{value}</span>
                                </span>
                            </li>
                        ))}
                    </Box>

                    <Box className={styles.footerDownloadDesktopOnly}>
                        {downloadAppContent}
                    </Box>
                </Box>
            </Box>

            <Box className={styles.footerDownloadMobileOnly}>
                {downloadAppContent}
            </Box>

            <Box className={styles.footerBottom}>
                <p>© 2026 PageTurn Digital Private Limited. All Rights Reserved.</p>
                <Box className={styles.footerBottomLinks}>
                    {footerBottomLinks.map((link) => (
                        <a key={link} href="#">{link}</a>
                    ))}
                </Box>
                <p className={styles.footerMadeWith}>
                    Made with <FavoriteBorderIcon fontSize="inherit" /> in Mumbai, India.
                </p>
            </Box>
        </Box>
        </>
    )
}

export default Home;