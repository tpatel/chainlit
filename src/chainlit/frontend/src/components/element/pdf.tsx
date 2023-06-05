import { IPdfElement } from 'state/element';

interface Props {
  element: IPdfElement;
}

export default function PDFElement({ element }: Props) {
  if (!element.url && !element.content) {
    return null;
  }
  const className = `${element.display}-pdf`;
  return (
    <iframe
      className={className}
      src={element.url || `data:application/pdf;base64,${element.content}`}
      style={{ border: 'none' }}
      width="100%"
      height="400px"
    ></iframe>
  );
}
