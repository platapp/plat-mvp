import React, { useState } from 'react';
import * as Mui from '@mui/material/';
import '../styles.css';

const Start = () => {
  return <div className="jumbotron">
      <Mui.Container>
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
            color="info"
            component={Mui.Link}
            href="relationships"
          >
            Plan with ABC Bank
          </Mui.Button>
        </div>
      </Mui.Container>
    </div>
}
export default Start
