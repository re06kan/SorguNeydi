import React from 'react';
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Paper,
  Button,
  IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { v4 as uuidv4 } from 'uuid';

const GroupingOptions = ({
  groupByColumns,
  setGroupByColumns,
  tables,
  tableColumns,
  updateQueryWithGroupBy
}) => {
  // Gruplama sütunu ekle
  const handleAddGroupBy = () => {
    const newGrouping = {
      id: uuidv4(),
      table: '',
      column: ''
    };

    setGroupByColumns([...groupByColumns, newGrouping]);
  };

  // Gruplama sütununu kaldır
  const handleRemoveGroupBy = (id) => {
    const updatedColumns = groupByColumns.filter(col => col.id !== id);
    setGroupByColumns(updatedColumns);
    updateQueryWithGroupBy(updatedColumns);
  };

  // Gruplama sütununu güncelle
  const handleGroupingChange = (id, field, value) => {
    const updatedColumns = groupByColumns.map(col => {
      if (col.id === id) {
        return { ...col, [field]: value };
      }
      return col;
    });

    setGroupByColumns(updatedColumns);

    // Tam değerlere sahipse sorguyu güncelle
    const isComplete = updatedColumns.every(col => col.table && col.column);
    if (isComplete) {
      updateQueryWithGroupBy(updatedColumns);
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">GROUP BY</Typography>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={handleAddGroupBy}
          size="small"
        >
          Sütun Ekle
        </Button>
      </Box>

      {groupByColumns.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          Henüz bir gruplama sütunu eklenmedi. "Sütun Ekle" butonuna tıklayarak başlayabilirsiniz.
        </Typography>
      ) : (
        groupByColumns.map(grouping => (
          <Paper key={grouping.id} elevation={1} sx={{ p: 2, mb: 2 }}>
            <Box display="flex" alignItems="center" gap={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Tablo</InputLabel>
                <Select
                  value={grouping.table}
                  onChange={(e) => handleGroupingChange(grouping.id, 'table', e.target.value)}
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
                  value={grouping.column}
                  onChange={(e) => handleGroupingChange(grouping.id, 'column', e.target.value)}
                  label="Sütun"
                  disabled={!grouping.table}
                >
                  {tableColumns[grouping.table]?.map(col => (
                    <MenuItem key={col.column_name} value={col.column_name}>
                      {col.column_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <IconButton color="error" onClick={() => handleRemoveGroupBy(grouping.id)}>
                <DeleteIcon />
              </IconButton>
            </Box>
          </Paper>
        ))
      )}
    </Box>
  );
};

export default GroupingOptions;
