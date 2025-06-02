import { styled } from '@mui/material/styles';
import { Card, CardContent, CardActions } from '@mui/material';

export const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: theme.shadows[4],
    transform: 'translateY(-5px)'
  }
}));

export const StyledCardContent = styled(CardContent)(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(2)
}));

export const StyledCardActions = styled(CardActions)(({ theme }) => ({
  padding: theme.spacing(1, 2),
  justifyContent: 'space-between'
}));
