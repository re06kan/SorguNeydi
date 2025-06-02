/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
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
  Paper
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { v4 as uuidv4 } from 'uuid';

const joinTypes = [
  { value: 'INNER JOIN', label: 'Inner Join', description: 'Eşleşen kayıtları getirir' },
  { value: 'LEFT JOIN', label: 'Left Join', description: 'Sol tablodaki tüm kayıtları ve eşleşen sağ kayıtları getirir' },
  { value: 'RIGHT JOIN', label: 'Right Join', description: 'Sağ tablodaki tüm kayıtları ve eşleşen sol kayıtları getirir' },
  { value: 'FULL JOIN', label: 'Full Join', description: 'Her iki tablodaki tüm kayıtları getirir' },
];

const JoinClause = ({
  join,
  tables,
  tableColumns,
  onUpdate,
  onRemove,
  fetchTableColumns,
  updateQueryWithJoins
}) => {
  console.log("Render JoinClause with:", { join, tableColumns });

  const sourceTableColumns = tableColumns[join.sourceTable] || [];
  const targetTableColumns = tableColumns[join.targetTable] || [];

  // Her tablo seçildiğinde sütunlarını önceden yükle
  useEffect(() => {
    if (join.sourceTable && !tableColumns[join.sourceTable]) {
      fetchTableColumns(join.sourceTable);
    }
    if (join.targetTable && !tableColumns[join.targetTable]) {
      fetchTableColumns(join.targetTable);
    }
  }, [join.sourceTable, join.targetTable, tableColumns, fetchTableColumns]);

  // Tüm join bileşenleri tamamlandığında sorguyu güncelle
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    // Eğer tüm gerekli alanlar doluysa JOIN'i sorguya uygula
    if (join.sourceTable && join.sourceColumn && join.targetTable && join.targetColumn) {
      console.log("Join is complete, updating query with:", join);
      // Doğrudan sorguyu güncelle
      setTimeout(() => {
        updateQueryWithJoins([join]);
      }, 100);
    }
  }, [join.sourceTable, join.sourceColumn, join.targetTable, join.targetColumn, updateQueryWithJoins]);

  const handleChange = (field, value) => {
    console.log(`Changing ${field} to:`, value);

    let updatedJoin = { ...join };
    updatedJoin[field] = value;

    // Tablo değiştiyse sütun seçimini sıfırla
    if (field === 'sourceTable') {
      updatedJoin.sourceColumn = '';
      // Yeni tabloyu hemen yükle
      if (value && !tableColumns[value]) {
        fetchTableColumns(value);
      }
    } else if (field === 'targetTable') {
      updatedJoin.targetColumn = '';
      // Yeni tabloyu hemen yükle
      if (value && !tableColumns[value]) {
        fetchTableColumns(value);
      }
    }

    onUpdate(updatedJoin);
  };

  return (
    <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth size="small">
            <InputLabel id={`join-type-label-${join.id}`}>Join Türü</InputLabel>
            <Select
              labelId={`join-type-label-${join.id}`}
              id={`join-type-${join.id}`}
              value={join.type || ''}
              onChange={(e) => handleChange('type', e.target.value)}
              label="Join Türü"
            >
              {joinTypes.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  {type.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={2}>
          <FormControl fullWidth size="small">
            <InputLabel id={`source-table-label-${join.id}`}>Kaynak Tablo</InputLabel>
            <Select
              labelId={`source-table-label-${join.id}`}
              id={`source-table-${join.id}`}
              value={join.sourceTable || ''}
              onChange={(e) => {
                const value = e.target.value;
                console.log("Selected source table:", value);
                handleChange('sourceTable', value);
              }}
              label="Kaynak Tablo"
            >
              {tables.map((table) => (
                <MenuItem key={table} value={table}>{table}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={2}>
          <FormControl fullWidth size="small">
            <InputLabel id={`source-column-label-${join.id}`}>Kaynak Sütun</InputLabel>
            <Select
              labelId={`source-column-label-${join.id}`}
              id={`source-column-${join.id}`}
              value={join.sourceColumn || ''}
              onChange={(e) => handleChange('sourceColumn', e.target.value)}
              label="Kaynak Sütun"
              disabled={!join.sourceTable || sourceTableColumns.length === 0}
            >
              {sourceTableColumns.map((column) => (
                <MenuItem key={column.column_name} value={column.column_name}>
                  {column.column_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={1} textAlign="center">
          <Typography variant="body1">=</Typography>
        </Grid>

        <Grid item xs={12} sm={2}>
          <FormControl fullWidth size="small">
            <InputLabel id={`target-table-label-${join.id}`}>Hedef Tablo</InputLabel>
            <Select
              labelId={`target-table-label-${join.id}`}
              id={`target-table-${join.id}`}
              value={join.targetTable || ''}
              onChange={(e) => {
                const value = e.target.value;
                console.log("Selected target table:", value);
                handleChange('targetTable', value);
              }}
              label="Hedef Tablo"
            >
              {tables.map((table) => (
                <MenuItem key={table} value={table}>{table}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={2}>
          <FormControl fullWidth size="small">
            <InputLabel id={`target-column-label-${join.id}`}>Hedef Sütun</InputLabel>
            <Select
              labelId={`target-column-label-${join.id}`}
              id={`target-column-${join.id}`}
              value={join.targetColumn || ''}
              onChange={(e) => handleChange('targetColumn', e.target.value)}
              label="Hedef Sütun"
              disabled={!join.targetTable || targetTableColumns.length === 0}
            >
              {targetTableColumns.map((column) => (
                <MenuItem key={column.column_name} value={column.column_name}>
                  {column.column_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={1}>
          <IconButton color="error" onClick={() => onRemove(join.id)}>
            <DeleteIcon />
          </IconButton>
        </Grid>
      </Grid>
    </Paper>
  );
};

const JoinBuilder = ({
  joins,
  tables,
  tableColumns,
  onJoinsChange,
  fetchTableColumns,
  updateQueryWithJoins
}) => {
  // Yeni join ekle
  const handleAddJoin = () => {
    const newJoin = {
      id: uuidv4(),
      type: 'INNER JOIN',
      sourceTable: '',
      sourceColumn: '',
      targetTable: '',
      targetColumn: ''
    };

    const updatedJoins = [...joins, newJoin];
    onJoinsChange(updatedJoins);
  };

  // Join güncelle
  const handleUpdateJoin = (updatedJoin) => {
    const updatedJoins = joins.map(join =>
      join.id === updatedJoin.id ? updatedJoin : join
    );
    onJoinsChange(updatedJoins);
  };

  // Sorguyu güncelle butonu
  const handleApplyJoin = () => {
    const validJoins = joins.filter(join =>
      join.sourceTable && join.sourceColumn && join.targetTable && join.targetColumn
    );

    if (validJoins.length > 0) {
      console.log("Manually applying joins:", validJoins);
      updateQueryWithJoins(validJoins);
    }
  };

  // Join sil
  const handleRemoveJoin = (joinId) => {
    const updatedJoins = joins.filter(join => join.id !== joinId);
    onJoinsChange(updatedJoins);
    updateQueryWithJoins(updatedJoins);
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Tablo Birleştirme</Typography>
        <Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddJoin}
            size="small"
            sx={{ mr: 1 }}
          >
            Join Ekle
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleApplyJoin}
            size="small"
          >
            JOIN'leri Uygula
          </Button>
        </Box>
      </Box>

      {joins.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          Henüz bir tablo birleştirmesi eklenmedi. "Join Ekle" butonuna tıklayarak başlayabilirsiniz.
        </Typography>
      ) : (
        joins.map(join => (
          <JoinClause
            key={join.id}
            join={join}
            tables={tables}
            tableColumns={tableColumns}
            onUpdate={handleUpdateJoin}
            onRemove={handleRemoveJoin}
            fetchTableColumns={fetchTableColumns}
            updateQueryWithJoins={updateQueryWithJoins}
          />
        ))
      )}
    </Box>
  );
};

export default JoinBuilder;
