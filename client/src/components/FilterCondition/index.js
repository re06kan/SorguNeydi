import React from 'react';
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Chip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const operators = {
  text: [
    { value: '=', label: 'Eşit' },
    { value: '!=', label: 'Eşit Değil' },
    { value: 'LIKE', label: 'İçerir' },
    { value: 'NOT LIKE', label: 'İçermez' },
    { value: 'IS NULL', label: 'Boş' },
    { value: 'IS NOT NULL', label: 'Boş Değil' }
  ],
  number: [
    { value: '=', label: 'Eşit' },
    { value: '!=', label: 'Eşit Değil' },
    { value: '>', label: 'Büyük' },
    { value: '<', label: 'Küçük' },
    { value: '>=', label: 'Büyük veya Eşit' },
    { value: '<=', label: 'Küçük veya Eşit' },
    { value: 'IS NULL', label: 'Boş' },
    { value: 'IS NOT NULL', label: 'Boş Değil' }
  ],
  date: [
    { value: '=', label: 'Eşit' },
    { value: '!=', label: 'Eşit Değil' },
    { value: '>', label: 'Sonra' },
    { value: '<', label: 'Önce' },
    { value: 'IS NULL', label: 'Boş' },
    { value: 'IS NOT NULL', label: 'Boş Değil' }
  ]
};

const FilterCondition = ({ condition, onChange, onRemove, dataType = 'text' }) => {
  const handleOperatorChange = (e) => {
    const newOperator = e.target.value;
    const needsValue = !['IS NULL', 'IS NOT NULL'].includes(newOperator);

    onChange({
      ...condition,
      operator: newOperator,
      value: needsValue ? condition.value : ''
    });
  };

  const handleValueChange = (e) => {
    onChange({
      ...condition,
      value: e.target.value
    });
  };

  // Uygun operatörleri seç
  const availableOperators = operators[dataType] || operators.text;

  // Değer girişi gerekip gerekmediğini kontrol et
  const needsValueInput = !['IS NULL', 'IS NOT NULL'].includes(condition.operator);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1 }}>
      <Chip
        label={condition.column}
        color="primary"
        sx={{ minWidth: '120px' }}
      />

      <FormControl sx={{ minWidth: 180 }}>
        <InputLabel>Operatör</InputLabel>
        <Select
          value={condition.operator}
          onChange={handleOperatorChange}
          label="Operatör"
          size="small"
        >
          {availableOperators.map(op => (
            <MenuItem key={op.value} value={op.value}>
              {op.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {needsValueInput && (
        <TextField
          label="Değer"
          value={condition.value}
          onChange={handleValueChange}
          size="small"
          sx={{ flexGrow: 1 }}
        />
      )}

      <IconButton onClick={() => onRemove(condition.id)} color="error">
        <DeleteIcon />
      </IconButton>
    </Box>
  );
};

export default FilterCondition;
