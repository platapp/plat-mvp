import React, { useState } from 'react';
import * as Mui from '@mui/material/';
import '../styles.css';

const Start = () => {
  return <div>
    <Mui.AppBar 
      color="transparent"
      position="static"
      sx={{pb: 3, pt: 2}}
    >
      <Mui.Container>
        <Mui.Toolbar disableGutters>
          <Mui.Typography
            sx={{mr: 2}}
            color="error"
            variant="h5"
          > <b>ABC Bank</b>
          </Mui.Typography>


          <Mui.Typography
            sx={{mr: 2}}
          > Link 2
          </Mui.Typography>

          <Mui.Typography
            sx={{mr: 2}}
          > Link 3
          </Mui.Typography>

        </Mui.Toolbar>
      </Mui.Container>
    </Mui.AppBar>

    <div className="jumbotron">
      <Mui.Container>
        <Mui.Grid container spacing={2}>
          <Mui.Grid item xs={8}>
            <div className="darkBg">
              <Mui.Typography
                variant="h2"
                sx={{mb: 5}}
              > At ABC Bank you are more than just a customer, you are family.
              </Mui.Typography>
              <Mui.Typography
                variant="h4"
                sx={{mb: 10}}
              > Whatever you're saving for retirement or need a loan for a new home, you can be confident we're on your side.
              </Mui.Typography>
              <Mui.Button 
                variant="contained"
                size="large"
                color="error"
              >
                Plan with ABC Bank
              </Mui.Button>
            </div>
          </Mui.Grid>
          <Mui.Grid item xs={4}></Mui.Grid>
        </Mui.Grid>
      </Mui.Container>
    </div>
  </div>
}
export default Start

// https://www.dropbox.com/s/w3rdbj3y63ojew4/bg_plat.png?dl=0