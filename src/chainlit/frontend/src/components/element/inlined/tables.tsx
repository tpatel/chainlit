import { Stack } from '@mui/material';
import TableElement from 'components/element/table';
import { ITableElement } from 'state/element';

interface Props {
  items: ITableElement[];
}

export default function InlinedTableList({ items }: Props) {
  return (
    <Stack spacing={1}>
      {items.map((element, i) => {
        return (
          <div
            key={i}
            style={{
              maxWidth: '600px',
              height: '400px'
            }}
          >
            <TableElement element={element} />
          </div>
        );
      })}
    </Stack>
  );
}
