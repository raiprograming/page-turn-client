import BooksListSection from './BooksListSection';
import BooksOfTheDay from './BooksOfTheDay';
import ExploreLibrary from './ExploreLibrary';
import SearchBox from './SearchBox';
import styles from './read.module.css';
import useBook from './use-book';

function Read() {
    const {
        searchValue,
        searchInput,
        handleSearchInputChange,
        handleSearchSubmit,
        handleSearchKeyDown,
        booksOfTheDay,
        activeIndex,
        handleCarouselScroll,
        searchResults,
        hasMore,
        loadMoreRef,
        library,
        loadMoreLibraryRef,
    } = useBook();

    return (
        <div className={styles.page}>
            {/* <Link to="/" className={styles.backLink}>
                <ArrowBackIcon fontSize="inherit" /> PageTurn Home
            </Link> */}

            <header>
                <h1 className={styles.pageTitle}>Readers Room</h1>
                <p className={styles.pageSubtitle}>Great books. Less time. More understanding.</p>
            </header>

            <SearchBox
                value={searchInput}
                onChange={handleSearchInputChange}
                onSubmit={handleSearchSubmit}
                onKeyDown={handleSearchKeyDown}
            />

            {searchValue ? (
                <BooksListSection
                    books={searchResults.books}
                    searchValue={searchValue}
                    hasMore={hasMore}
                    loadMoreRef={loadMoreRef}
                    loading={searchResults.loading}
                    errorMessage={searchResults.errorMessage}
                />
            ) : (
                <>
                    <BooksOfTheDay
                        books={booksOfTheDay.books}
                        loading={booksOfTheDay.loading}
                        errorMessage={booksOfTheDay.errorMessage}
                        activeIndex={activeIndex}
                        onScroll={handleCarouselScroll}
                    />
                    <ExploreLibrary
                        books={library.books}
                        hasMore={library.hasMore}
                        loadMoreRef={loadMoreLibraryRef}
                        loading={library.loading}
                        errorMessage={library.errorMessage}
                    />
                </>
            )}
        </div>
    );
}

export default Read;
