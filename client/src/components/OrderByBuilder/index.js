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
  Chip,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { v4 as uuidv4 } from 'uuid';

const OrderByClause = ({
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

  const handleDirectionChange = (event, newDirection) => {
    if (newDirection !== null) {
      onUpdate({
        ...clause,
        direction: newDirection
      });
    }
  };

  // Seçilen tabloya ait sütunları al
  const selectedTableColumns = tableColumns[clause.table] || [];

  return (
    <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth size="small">
            <InputLabel id={`order-table-label-${clause.id}`}>Tablo</InputLabel>
            <Select
              labelId={`order-table-label-${clause.id}`}
              id={`order-table-${clause.id}`}
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

        <Grid item xs={12} sm={4}>
          <FormControl fullWidth size="small">
            <InputLabel id={`order-column-label-${clause.id}`}>Sütun</InputLabel>
            <Select
              labelId={`order-column-label-${clause.id}`}
              id={`order-column-${clause.id}`}
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

        <Grid item xs={12} sm={3}>
          <ToggleButtonGroup
            value={clause.direction}
            exclusive
            onChange={handleDirectionChange}
            aria-label="sıralama yönü"
            size="small"
          >
            <ToggleButton value="ASC" aria-label="artan sıralama">
              <ArrowUpwardIcon fontSize="small" /> <Box component="span" sx={{ ml: 1 }}>Artan</Box>
            </ToggleButton>
            <ToggleButton value="DESC" aria-label="azalan sıralama">
              <ArrowDownwardIcon fontSize="small" /> <Box component="span" sx={{ ml: 1 }}>Azalan</Box>
            </ToggleButton>
          </ToggleButtonGroup>
        </Grid>

        <Grid item xs={12} sm={1}>
          <IconButton color="error" onClick={() => onRemove(clause.id)}>
            <DeleteIcon />
          </IconButton>
        </Grid>
      </Grid>
    </Paper>
  );
};

const OrderByBuilder = ({
  orderByColumns,
  onOrderByChange,
  tables,
  tableColumns,
  fetchTableColumns,
  updateQueryWithOrderBy
}) => {
  // Yeni sıralama kriteri ekle
  const handleAddOrderBy = () => {
    const newClause = {
      id: uuidv4(),
      table: '',
      column: '',
      direction: 'ASC'
    };

    const updatedClauses = [...orderByColumns, newClause];
    onOrderByChange(updatedClauses);
  };

  // Sıralama güncelle
  const handleUpdateOrderBy = (updatedClause) => {
    const updatedClauses = orderByColumns.map(clause =>
      clause.id === updatedClause.id ? updatedClause : clause
    );
    onOrderByChange(updatedClauses);
  };

  // Sıralama sil
  const handleRemoveOrderBy = (clauseId) => {
    const updatedClauses = orderByColumns.filter(clause => clause.id !== clauseId);
    onOrderByChange(updatedClauses);
  };

  // Sorguyu güncelle
  const handleApplyOrderBy = () => {
    const validClauses = orderByColumns.filter(clause =>
      clause.table && clause.column
    );

    if (validClauses.length > 0) {
      console.log("Applying ORDER BY clauses:", validClauses);
      updateQueryWithOrderBy(validClauses);
    }
  };

  // Aktif sıralama kriterlerini göster
  const activeOrderByColumns = orderByColumns.filter(clause => clause.table && clause.column);

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Sıralama Kriterleri</Typography>
        <Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddOrderBy}
            size="small"
            sx={{ mr: 1 }}
          >
            Kriter Ekle
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleApplyOrderBy}
            size="small"
          >
            ORDER BY Uygula
          </Button>
        </Box>
      </Box>

      {/* Aktif kriterler */}
      {activeOrderByColumns.length > 0 && (
        <Box mb={2}>
          <Typography variant="subtitle2" gutterBottom>Aktif Kriterler:</Typography>
          {activeOrderByColumns.map(clause => (
            <Chip
              key={clause.id}
              label={`${clause.table}.${clause.column} ${clause.direction}`}
              variant="outlined"
              size="small"
              sx={{ mr: 1, mb: 1 }}
              color={clause.direction === 'ASC' ? 'primary' : 'secondary'}
              icon={clause.direction === 'ASC' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
            />
          ))}
        </Box>
      )}

      {orderByColumns.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          Henüz bir sıralama kriteri eklenmedi. "Kriter Ekle" butonuna tıklayarak başlayabilirsiniz.
        </Typography>
      ) : (
        orderByColumns.map(clause => (
          <OrderByClause
            key={clause.id}
            clause={clause}
            tables={tables}
            tableColumns={tableColumns}
            onUpdate={handleUpdateOrderBy}
            onRemove={handleRemoveOrderBy}
            fetchTableColumns={fetchTableColumns}
          />
        ))
      )}
    </Box>
  );
};

export default OrderByBuilder;
