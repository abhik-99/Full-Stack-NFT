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
  Slide,
  CircularProgress
} from "@mui/material";

import {ethers} from "ethers";

import useTheme from "@mui/material/styles/useTheme";

import happy from "./assets/images/happy.png";
import surprised from "./assets/images/surprised.png";
import sad from "./assets/images/sad.png";
import background from "./assets/images/background.jpg";

import contract_abi from "./assets/blockchain/nft_contract_abi.json";


const CONTRACT_ADDRESS = '0x05df59AA883E9D86f528b6F1a253351Fa468a594';

function TabPanel(props) {
  const theme = useTheme();
  const { children, value, index, border, ...other } = props;

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
          borderRadius: theme.spacing(4),
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column'
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
  const [face, setFace] = React.useState(1);
  const [connected, setConnected] = React.useState(false);
  const [account, setAccount] = React.useState('');
  const [signer, setSigner] = React.useState();
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    window.ethereum.send('eth_requestAccounts');
  });

  const handleWalletConnect = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const acc = await signer.getAddress()
    await signer.signMessage(`You are now logging into a Test NFT Minting Portal Portal. Developer does not take any responsibility!
    
    This portal takes your Address and Mints it as an NFT.
    `)

    setAccount(acc);
    setSigner(signer);
    setConnected(true);
  }

  const handleCheck = async () => {
    setLoading(true);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, contract_abi, provider);
    const MINTER_ROLE = (await contract.MINTER_ROLE()).toString();
    if(await contract.hasRole(MINTER_ROLE, account)) {
      setFace(2);
    } else {
      setFace(3);
    }
    setLoading(false);
  }

  const handleMint = async () => {
    setLoading(true);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, contract_abi, signer);
    await contract.safeMint(account, `Account NFT Generated. Acc: ${account}`, {value: ethers.utils.parseEther("0.1")});
    setLoading(false);
    
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };


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
              }}
              centered
              >
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
                <Typography variant="h2">Welcome</Typography>
                {
                  connected &&
                  <Typography color="white" my={1}>{account.substring(0, 20)}...</Typography>
                }
                <Typography mb={3}>
                  Mint your Address as NFT!
                </Typography>
                <Button variant="contained" color="secondary" onClick={handleMint} disabled={loading}>
                  {
                    loading ? <CircularProgress sx={{color:"#fff", px: 6}} size={25}/> : 'Mint'
                  }
                </Button>
              </TabPanel>

              <TabPanel value={value} index={1}>
                <Box sx={{
                  mb: 2,
                  p: 2,
                  bgcolor: face===1 ?`${theme.palette.grey[100]}50`:
                  face===2?`${theme.palette.success.light}50`:
                  `${theme.palette.error.light}50`,
                  borderRadius: theme.spacing(4)
                }}>
                  <img src={face===1 ? surprised : face===2? happy: sad} alt="check" height={theme.spacing(10)} />
                </Box>
                <Button variant="contained" color="secondary" sx={{ mb: 2}} onClick={handleCheck} disabled={loading}>
                  {
                    loading ? <CircularProgress sx={{color:"#fff", px: 6}} size={25}/> : 'Check Whitelist'
                  }
                  
                </Button>
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
          
          <Typography m={1}>Note: You need to be whitelisted before minting!</Typography>
        </Card>
      </Fade>
    </div>
  );
}

export default App;
