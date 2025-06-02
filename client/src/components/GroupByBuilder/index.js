import React from 'react';
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Button,
  IconButton,
  Paper,
  Chip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { v4 as uuidv4 } from 'uuid';

const GroupByClause = ({
  clause,
  tables,
  tableColumns,
  onUpdate,
  onRemove,
  fetchTableColumns
}) => {
  const handleTableChange = (value) => {
    // Tablo değiştiğinde, bu tablonun sütunlarını getir
    if (value && !tableColumns[value]) {
      fetchTableColumns(value);
    }

    // State'i güncelle
    onUpdate({
      ...clause,
      table: value,
      column: ''
    });
  };

  const handleColumnChange = (value) => {
    onUpdate({
      ...clause,
      column: value
    });
  };

  // Seçilen tabloya ait sütunları al
  const selectedTableColumns = tableColumns[clause.table] || [];

  return (
    <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={5}>
          <FormControl fullWidth size="small">
            <InputLabel id={`group-table-label-${clause.id}`}>Tablo</InputLabel>
            <Select
              labelId={`group-table-label-${clause.id}`}
              id={`group-table-${clause.id}`}
              value={clause.table || ''}
              onChange={(e) => handleTableChange(e.target.value)}
              label="Tablo"
            >
              {tables.map((table) => (
                <MenuItem key={table} value={table}>{table}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={5}>
          <FormControl fullWidth size="small">
            <InputLabel id={`group-column-label-${clause.id}`}>Sütun</InputLabel>
            <Select
              labelId={`group-column-label-${clause.id}`}
              id={`group-column-${clause.id}`}
              value={clause.column || ''}
              onChange={(e) => handleColumnChange(e.target.value)}
              label="Sütun"
              disabled={!clause.table || selectedTableColumns.length === 0}
            >
              {selectedTableColumns.map((column) => (
                <MenuItem key={column.column_name} value={column.column_name}>
                  {column.column_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={2}>
          <IconButton color="error" onClick={() => onRemove(clause.id)}>
            <DeleteIcon />
          </IconButton>
        </Grid>
      </Grid>
    </Paper>
  );
};

const GroupByBuilder = ({
  groupByColumns,
  onGroupByChange,
  tables,
  tableColumns,
  fetchTableColumns,
  updateQueryWithGroupBy
}) => {
  // Yeni gruplama kriteri ekle
  const handleAddGroupBy = () => {
    const newClause = {
      id: uuidv4(),
      table: '',
      column: ''
    };

    const updatedClauses = [...groupByColumns, newClause];
    onGroupByChange(updatedClauses);
  };

  // Grup güncelle
  const handleUpdateGroupBy = (updatedClause) => {
    const updatedClauses = groupByColumns.map(clause =>
      clause.id === updatedClause.id ? updatedClause : clause
    );
    onGroupByChange(updatedClauses);
  };

  // Grup sil
  const handleRemoveGroupBy = (clauseId) => {
    const updatedClauses = groupByColumns.filter(clause => clause.id !== clauseId);
    onGroupByChange(updatedClauses);
  };

  // Sorguyu güncelle
  const handleApplyGroupBy = () => {
    const validClauses = groupByColumns.filter(clause =>
      clause.table && clause.column
    );

    if (validClauses.length > 0) {
      console.log("Applying GROUP BY clauses:", validClauses);
      updateQueryWithGroupBy(validClauses);
    }
  };

  // Aktif grup kriterlerini göster
  const activeGroupByColumns = groupByColumns.filter(clause => clause.table && clause.column);

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Gruplama Kriterleri</Typography>
        <Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddGroupBy}
            size="small"
            sx={{ mr: 1 }}
          >
            Kriter Ekle
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleApplyGroupBy}
            size="small"
          >
            GROUP BY Uygula
          </Button>
        </Box>
      </Box>

      {/* Aktif kriterler */}
      {activeGroupByColumns.length > 0 && (
        <Box mb={2}>
          <Typography variant="subtitle2" gutterBottom>Aktif Kriterler:</Typography>
          {activeGroupByColumns.map(clause => (
            <Chip
              key={clause.id}
              label={`${clause.table}.${clause.column}`}
              variant="outlined"
              size="small"
              sx={{ mr: 1, mb: 1 }}
            />
          ))}
        </Box>
      )}

      {groupByColumns.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          Henüz bir gruplama kriteri eklenmedi. "Kriter Ekle" butonuna tıklayarak başlayabilirsiniz.
        </Typography>
      ) : (
        groupByColumns.map(clause => (
          <GroupByClause
            key={clause.id}
            clause={clause}
            tables={tables}
            tableColumns={tableColumns}
            onUpdate={handleUpdateGroupBy}
            onRemove={handleRemoveGroupBy}
            fetchTableColumns={fetchTableColumns}
          />
        ))
      )}
    </Box>
  );
};

export default GroupByBuilder;
