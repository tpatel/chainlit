import { useState, useCallback, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import type {
  CustomTextRenderer,
  OnDocumentLoadSuccess
} from 'react-pdf/src/shared/types';
import type { TextItem } from 'pdfjs-dist/types/src/display/api';
import { IPdfElement } from 'state/element';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import './pdf/style.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.js`;

interface Props {
  element: IPdfElement;
  page?: number;
  search?: string;
}

function highlightPattern(text: string, pattern: string) {
  return text.replace(pattern, (value) => `<mark>${value}</mark>`);
}

export default function PDFElement({ element, page = 1, search = '' }: Props) {
  const className = `${element.display}-pdf`;
  const url = element.url || `data:application/pdf;base64,${element.content}`;

  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pdf, setPdf] = useState<pdfjs.PDFDocumentProxy | null>(null);

  page = 3;
  search = 'Ouyang et al';

  const onDocumentLoadSuccess: OnDocumentLoadSuccess =
    function onDocumentLoadSuccess(pdf) {
      setNumPages(pdf.numPages);
      setPageNumber(page);
      setPdf(pdf);
    };

  function changePage(offset: number) {
    setPageNumber((prevPageNumber) => prevPageNumber + offset);
  }

  function previousPage() {
    changePage(-1);
  }

  function nextPage() {
    changePage(1);
  }

  useEffect(() => {
    if (search) {
      // In case we're searching, we don't want to change the page
      return;
    }
    setPageNumber(page);
  }, [page, search]);

  useEffect(() => {
    async function searchForText() {
      if (!numPages || !pdf || !search) {
        return;
      }
      console.log(
        'searching',
        search,
        'in',
        numPages,
        'pages',
        'starting at',
        page,
        '...'
      );
      // Start from page to allow users to specify both page and search
      for (let i = page; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        // Because we don't query for MarkedContent, we can cast to TextItem
        const str = textContent.items
          .map((item) => (item as TextItem).str)
          .join(' ');
        console.log(i, str);
        if (str.includes(search)) {
          console.log('found', i);
          setPageNumber(i);
          break;
        }
      }
    }
    searchForText();
  }, [numPages, page, search, pdf]);

  const textRenderer = useCallback<CustomTextRenderer>(
    (textItem) =>
      search ? highlightPattern(textItem.str, search) : textItem.str,
    [search]
  );

  if (!element.url && !element.content) {
    return null;
  }

  return (
    <div className={`${className} pdf-element`}>
      <Document
        file={url}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={(error) => {
          console.error(error);
        }}
        externalLinkTarget="_blank"
      >
        <Page
          pageNumber={pageNumber}
          customTextRenderer={textRenderer}
          height={600}
        />
        <div className="page-controls">
          <button
            type="button"
            disabled={pageNumber <= 1}
            onClick={previousPage}
          >
            ‹
          </button>
          <span>
            {pageNumber} of {numPages}
          </span>
          <button
            type="button"
            disabled={numPages !== null && pageNumber >= numPages}
            onClick={nextPage}
          >
            ›
          </button>
        </div>
      </Document>
    </div>
  );
}
