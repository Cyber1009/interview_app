import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2196F3',
    },
    secondary: {
      main: '#FE6B8B',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    text: {
      primary: '#333333',
    },
  },
  customGradients: {
    primary: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
    secondary: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    background: 'linear-gradient(120deg, #f0f7ff 0%, #ffffff 100%)',
  },
});

export default theme;