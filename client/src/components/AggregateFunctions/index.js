import React from 'react';
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Paper,
  Button,
  IconButton,
  Grid
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { v4 as uuidv4 } from 'uuid';

const functions = [
  { value: 'COUNT', label: 'COUNT', description: 'Satır sayısı' },
  { value: 'SUM', label: 'SUM', description: 'Toplam' },
  { value: 'AVG', label: 'AVG', description: 'Ortalama' },
  { value: 'MIN', label: 'MIN', description: 'Minimum değer' },
  { value: 'MAX', label: 'MAX', description: 'Maksimum değer' },
  { value: 'CONCAT', label: 'CONCAT', description: 'Metinleri birleştir' },
  { value: 'SUBSTRING', label: 'SUBSTRING', description: 'Metin parçası' },
  { value: 'CASE', label: 'CASE WHEN', description: 'Koşullu ifade' }
];

const AggregateFunctions = ({
  functionExpressions,
  setFunctionExpressions,
  tables,
  tableColumns,
  updateQueryWithFunctions
}) => {
  // Fonksiyon ekle
  const handleAddFunction = () => {
    const newFunction = {
      id: uuidv4(),
      functionType: '',
      table: '',
      column: '',
      alias: '',
      parameters: {}
    };

    setFunctionExpressions([...functionExpressions, newFunction]);
  };

  // Fonksiyon kaldır
  const handleRemoveFunction = (id) => {
    const updatedFunctions = functionExpressions.filter(func => func.id !== id);
    setFunctionExpressions(updatedFunctions);
    updateQueryWithFunctions(updatedFunctions);
  };

  // Fonksiyonu güncelle
  const handleFunctionChange = (id, field, value) => {
    const updatedFunctions = functionExpressions.map(func => {
      if (func.id === id) {
        return { ...func, [field]: value };
      }
      return func;
    });

    setFunctionExpressions(updatedFunctions);

    // Temel değerlere sahipse sorguyu güncelle
    const isComplete = updatedFunctions.every(func =>
      func.functionType && (
        func.functionType === 'COUNT' ||
        (func.table && func.column)
      )
    );

    if (isComplete) {
      updateQueryWithFunctions(updatedFunctions);
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">SQL Fonksiyonları</Typography>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={handleAddFunction}
          size="small"
        >
          Fonksiyon Ekle
        </Button>
      </Box>

      {functionExpressions.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          Henüz bir fonksiyon eklenmedi. "Fonksiyon Ekle" butonuna tıklayarak başlayabilirsiniz.
        </Typography>
      ) : (
        functionExpressions.map(func => (
          <Paper key={func.id} elevation={1} sx={{ p: 2, mb: 2 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Fonksiyon</InputLabel>
                  <Select
                    value={func.functionType}
                    onChange={(e) => handleFunctionChange(func.id, 'functionType', e.target.value)}
                    label="Fonksiyon"
                  >
                    {functions.map(f => (
                      <MenuItem key={f.value} value={f.value}>
                        {f.label} - {f.description}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {func.functionType && func.functionType !== 'COUNT' && (
                <>
                  <Grid item xs={12} sm={3}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Tablo</InputLabel>
                      <Select
                        value={func.table}
                        onChange={(e) => handleFunctionChange(func.id, 'table', e.target.value)}
                        label="Tablo"
                      >
                        {tables.map(table => (
                          <MenuItem key={table} value={table}>{table}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={3}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Sütun</InputLabel>
                      <Select
                        value={func.column}
                        onChange={(e) => handleFunctionChange(func.id, 'column', e.target.value)}
                        label="Sütun"
                        disabled={!func.table}
                      >
                        {tableColumns[func.table]?.map(col => (
                          <MenuItem key={col.column_name} value={col.column_name}>
                            {col.column_name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </>
              )}

              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  size="small"
                  label="Takma Ad (AS)"
                  value={func.alias}
                  onChange={(e) => handleFunctionChange(func.id, 'alias', e.target.value)}
                  placeholder="örn: toplam_miktar"
                />
              </Grid>

              <Grid item xs={12} sm={1}>
                <IconButton color="error" onClick={() => handleRemoveFunction(func.id)}>
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </Grid>
          </Paper>
        ))
      )}
    </Box>
  );
};

export default AggregateFunctions;
