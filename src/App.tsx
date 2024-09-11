
import Routes from "./routes/Routes";
import "./assets/styles/admin.css";
import "./assets/styles/admin.responsive.css";
import { createTheme, ThemeProvider } from "@mui/material";

function App() {
  const theme = createTheme({
    typography: {
      allVariants: {
        fontFamily: "Lota, sans-serif",
        fontWeight: "400",
        lineHeight: "normal",
      },
    },
  });

  return (
   
      <ThemeProvider theme={theme}>
        <Routes />
      </ThemeProvider>
    
  );
}

export default App;
