import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button
} from '@mui/material';

/**
 * Bağlantı kartı bileşeni
 */
const ConnectionCard = ({ connection, onEdit, onDelete, onTest }) => {
  return (
    <Card>
      <CardContent>
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
      </CardContent>
      <CardActions>
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
      </CardActions>
    </Card>
  );
};

export default ConnectionCard;
