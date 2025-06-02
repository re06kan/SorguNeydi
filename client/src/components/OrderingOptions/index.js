import React from 'react';
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Button,
  IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { v4 as uuidv4 } from 'uuid';

const OrderingOptions = ({
  orderByColumns,
  setOrderByColumns,
  tables,
  tableColumns,
  updateQueryWithOrderBy
}) => {
  // Sıralama sütunu ekle
  const handleAddOrderBy = () => {
    const newOrdering = {
      id: uuidv4(),
      table: '',
      column: '',
      direction: 'ASC'
    };

    setOrderByColumns([...orderByColumns, newOrdering]);
  };

  // Sıralama sütununu kaldır
  const handleRemoveOrderBy = (id) => {
    const updatedColumns = orderByColumns.filter(col => col.id !== id);
    setOrderByColumns(updatedColumns);
    updateQueryWithOrderBy(updatedColumns);
  };

  // Sıralama sütununu güncelle
  const handleOrderingChange = (id, field, value) => {
    const updatedColumns = orderByColumns.map(col => {
      if (col.id === id) {
        return { ...col, [field]: value };
      }
      return col;
    });

    setOrderByColumns(updatedColumns);

    // Tam değerlere sahipse sorguyu güncelle
    const isComplete = updatedColumns.every(col => col.table && col.column);
    if (isComplete) {
      updateQueryWithOrderBy(updatedColumns);
    }
  };

  // Sıralama yönünü değiştir
  const toggleDirection = (id) => {
    const updatedColumns = orderByColumns.map(col => {
      if (col.id === id) {
        return {
          ...col,
          direction: col.direction === 'ASC' ? 'DESC' : 'ASC'
        };
      }
      return col;
    });

    setOrderByColumns(updatedColumns);
    updateQueryWithOrderBy(updatedColumns);
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">ORDER BY</Typography>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={handleAddOrderBy}
          size="small"
        >
          Sıralama Ekle
        </Button>
      </Box>

      {orderByColumns.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          Henüz bir sıralama kriteri eklenmedi. "Sıralama Ekle" butonuna tıklayarak başlayabilirsiniz.
        </Typography>
      ) : (
        orderByColumns.map(ordering => (
          <Paper key={ordering.id} elevation={1} sx={{ p: 2, mb: 2 }}>
            <Box display="flex" alignItems="center" gap={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Tablo</InputLabel>
                <Select
                  value={ordering.table}
                  onChange={(e) => handleOrderingChange(ordering.id, 'table', e.target.value)}
                  label="Tablo"
                >
                  {tables.map(table => (
                    <MenuItem key={table} value={table}>{table}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth size="small">
                <InputLabel>Sütun</InputLabel>
                <Select
                  value={ordering.column}
                  onChange={(e) => handleOrderingChange(ordering.id, 'column', e.target.value)}
                  label="Sütun"
                  disabled={!ordering.table}
                >
                  {tableColumns[ordering.table]?.map(col => (
                    <MenuItem key={col.column_name} value={col.column_name}>
                      {col.column_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <IconButton
                color="primary"
                onClick={() => toggleDirection(ordering.id)}
                disabled={!ordering.table || !ordering.column}
              >
                {ordering.direction === 'ASC' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
              </IconButton>

              <IconButton color="error" onClick={() => handleRemoveOrderBy(ordering.id)}>
                <DeleteIcon />
              </IconButton>
            </Box>
          </Paper>
        ))
      )}
    </Box>
  );
};

export default OrderingOptions;
