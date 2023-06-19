import { ITableElement } from 'state/element';
import { DataGrid } from '@mui/x-data-grid';

interface Props {
  element: ITableElement;
}

export default function TableElement({ element }: Props) {
  const className = `${element.display}-table`;
  const idColumn = element.columns.findIndex((column) => column === 'id');
  console.log(element.columns, element.rows, idColumn, element.rows[0]);
  return (
    // <pre className={className}>
    //   {`columns: ${JSON.stringify(
    //     element.columns,
    //     null,
    //     2
    //   )}\n\nrows: ${JSON.stringify(element.rows, null, 2)}`}
    // </pre>
    <DataGrid
      className={className}
      rows={element.rows}
      columns={element.columns.map((column) => ({ field: column }))}
      // getRowId={(row) => row.id || row[idColumn]}
    />
  );
}
