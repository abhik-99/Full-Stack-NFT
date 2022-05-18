/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Tabs,
  Tab,
  Fade,
  Button,
  Slide
} from "@mui/material";

import useTheme from "@mui/material/styles/useTheme";


import background from "./assets/images/background.jpg";

function TabPanel(props) {
  const theme = useTheme();
  const { children, value, index, border, ...other } = props;
  console.log("border", border)

  return (
    <Box
      sx={{
        height: '70%'
      }}
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{
          p: 3,
          bgcolor: `${theme.palette.grey[900]}40`,
          minHeight: '100%',
          width: '80%',
          borderTopLeftRadius: value ? theme.spacing(4) : 0,
          borderTopRightRadius: !value ? theme.spacing(4) : 0,
          borderBottomLeftRadius: theme.spacing(4),
          borderBottomRightRadius: theme.spacing(4),
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          {children}
        </Box>
      )}
    </Box>
  );
}

function a11yProps(index) {
  return {
    id: `tab-${index}`,
    'aria-controls': `tabpanel-${index}`,
  };
}

function App() {
  const theme = useTheme();
  const [value, setValue] = React.useState(0);
  const [connected, setConnected] = React.useState(false);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleWalletConnect = () => {
    setConnected(true);
  }
  return (
    <div className="App" css={css`
    min-height: 100vh;
    width: 100%;
    background-image: url(${background});
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    overflow: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    `}>
      <Fade in={true} timeout={800}>
        <Card sx={{ 
          height: '400px',
          bgcolor: 'rgba(255, 255, 255, 0.4)',
          backdropFilter: 'blur(5px)',
          borderRadius: theme.spacing(4),
          position: 'relative'
        }}>
          <CardContent sx={{height: '80%'}}>
            <Box sx={{ height: '100%'}}>
              <Tabs value={value} onChange={handleChange} aria-label="basic tabs"
              TabIndicatorProps={{
                style: {
                    display: "none",
                },
              }}>
                <Tab label="Mint" {...a11yProps(0)} sx={{
                  bgcolor: value ? 'none':`${theme.palette.grey[900]}40`,
                  color: theme.palette.common.white,
                  borderTopLeftRadius: theme.spacing(4),
                  borderTopRightRadius: theme.spacing(4),
                  p: 3,
                  px:5,
                  '&.Mui-selected': {
                    color: theme.palette.common.white
                  }
                }}/>
                <Tab label="Whitelist" {...a11yProps(1)} sx={{
                  bgcolor: !value ? 'none':`${theme.palette.grey[900]}40`,
                  color: theme.palette.common.white,
                  borderTopLeftRadius: theme.spacing(4),
                  borderTopRightRadius: theme.spacing(4),
                  p: 3,
                  '&.Mui-selected': {
                    color: theme.palette.common.white
                  }
                }}/>
              </Tabs>
              <TabPanel value={value} index={0}>
                <Button variant="contained" color="secondary">Mint</Button>
              </TabPanel>

              <TabPanel value={value} index={1}>
                <Button variant="contained" color="secondary">Whitelist</Button>
              </TabPanel>
            </Box>
            <Slide in={!connected} timeout={1500}>
              <Box sx={{
                bgcolor: `#00000080`,
                borderRadius: theme.spacing(4),
                height: '100%',
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'absolute',
                top: 0,
                left: 0,
                zIndex: 15
              }}>
                <Button variant="contained" color='primary' onClick={handleWalletConnect}>Connect</Button>
              </Box>
              
            </Slide>
            
          </CardContent>
        </Card>
      </Fade>
    </div>
  );
}

export default App;
