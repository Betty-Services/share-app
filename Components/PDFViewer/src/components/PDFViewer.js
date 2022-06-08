(() => ({
	name: 'PDFViewer',
	type: 'CONTENT_COMPONENT',
	allowedTypes: [],
	orientation: 'HORIZONTAL',
	jsx: (() => {
		const { Page, Document } = window.PDF;
		const pdfjs = window.pdfjs;
		const {
			pdf,
			showPagination,
			labelNumberOfPages,
			verticalPaginationPosition,
			showAllPages,
		} = options;
		const { env, useText } = B;
		const isDev = env === 'dev';
		const [numberOfPages, setNumberOfPages] = useState(0);
		const [pageNumber, setPageNumber] = useState(1);
		const file = useText(pdf);
		const pagination = showPagination && !showAllPages;
		const parsedLabel = useText(labelNumberOfPages) + ' ';
		const paginationLabel = parsedLabel
			.replace(' x ', ` ${pageNumber} `)
			.replace(' y ', ` ${numberOfPages} `);

		B.defineFunction('Go to previous page', () => changePage(-1));
		B.defineFunction('Go to next page', () => changePage(1));

		useEffect(() => {
			if (!isDev) {
				if (pageNumber <= 1) {
					B.triggerEvent('onNoPreviousPagePresent');
				} else {
					B.triggerEvent('onPreviousPagePresent');
				}
				if (pageNumber >= numberOfPages) {
					B.triggerEvent('onNoNextPagePresent');
				} else {
					B.triggerEvent('onNextPagePresent');
				}
			}
		}, [pageNumber, numberOfPages]);

		const onDocumentLoadSuccess = ({ numPages }) => {
			setNumberOfPages(numPages);
			B.triggerEvent('onSuccess');
		};

		const changePage = (offset) => {
			setPageNumber((prevPageNumber) => prevPageNumber + offset);
		};

		const PDFViewerComponent = (
			<div className={classes.pdfWrapper}>
				{pagination && verticalPaginationPosition === 'top' && (
					<div className={classes.paginationWrapper}>
						<p>{paginationLabel}</p>
					</div>
				)}
				<Document
					file={`data:application/pdf;base64,${file}`}
					options={{
						cMapUrl: `//cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/cmaps/`,
						cMapPacked: true,
					}}
					externalLinkTarget='_blank'
					loading=''
					onLoadSuccess={onDocumentLoadSuccess}
					onSourceError={(error) => B.triggerEvent('onError', error)}
					onLoadError={(error) => B.triggerEvent('onError', error)}
				>
					{showAllPages ? (
						Array.from(new Array(numberOfPages), (el, index) => (
							<Page key={`page_${index + 1}`} pageNumber={index + 1} />
						))
					) : (
						<Page pageNumber={pageNumber} />
					)}
				</Document>

				{pagination && verticalPaginationPosition === 'bottom' && (
					<div className={classes.paginationWrapper}>
						<p>{paginationLabel}</p>
					</div>
				)}
			</div>
		);

		return isDev ? (
			<div className={classes.root}>PDF Viewer</div>
		) : (
			PDFViewerComponent
		);
	})(),
	styles: (B) => (t) => {
		const style = new B.Styling(t);
		return {
			root: {
				borderWidth: '0.0625rem',
				borderColor: '#AFB5C8',
				borderStyle: 'dashed',
				backgroundColor: '#F0F1F5',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				minHeight: '2rem',
				width: '100%',
				fontSize: '0.75rem',
				color: '#262A3A',
				textTransform: 'uppercase',
				boxSizing: 'border-box',
				textAlign: 'center',
			},
			pdfWrapper: {
				width: 'fit-content',
			},
			paginationWrapper: {
				textAlign: ({ options: { horizontalPaginationPosition } }) =>
					horizontalPaginationPosition,
			},
		};
	},
}))();
