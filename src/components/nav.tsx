import React from 'react';
import * as Mui from '@mui/material/';
import '../styles.css';

const Nav = () => {
  return <div>
    <Mui.AppBar
      color="transparent"
      position="static"
      sx={{ py: 2 }}
    >
      <Mui.Container>
        <Mui.Toolbar disableGutters>

          <Mui.Typography
            sx={{ mr: 5 }}
          > <b className="brandFont">ABC</b>
          </Mui.Typography>

          <Mui.Typography
            sx={{ mr: 2 }}
          > Link 2
          </Mui.Typography>

          <Mui.Typography
            sx={{ mr: 2 }}
          > Link 3
          </Mui.Typography>

        </Mui.Toolbar>
      </Mui.Container>
    </Mui.AppBar>
  </div>
}
export default Nav
