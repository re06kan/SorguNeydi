import React from 'react';
import { Typography, Button } from '@mui/material';
import { StyledCard, StyledCardContent, StyledCardActions } from './styles';

const ConnectionCard = ({ connection, onEdit, onDelete, onTest }) => {
  return (
    <StyledCard>
      <StyledCardContent>
        <Typography variant="h6" component="h3">
          {connection.name}
        </Typography>
        <Typography color="textSecondary">
          Tür: {connection.type}
        </Typography>
        <Typography variant="body2" component="p">
          {connection.host}:{connection.port}
        </Typography>
        <Typography variant="body2" component="p">
          Veritabanı: {connection.database}
        </Typography>
      </StyledCardContent>
      <StyledCardActions>
        <Button
          size="small"
          color="primary"
          onClick={() => onEdit(connection)}
        >
          Düzenle
        </Button>
        <Button
          size="small"
          color="secondary"
          onClick={() => onDelete(connection.id)}
        >
          Sil
        </Button>
        <Button
          size="small"
          color="primary"
          onClick={() => onTest(connection)}
        >
          Test Et
        </Button>
      </StyledCardActions>
    </StyledCard>
  );
};

export default ConnectionCard;
