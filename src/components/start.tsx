import React from 'react';
import * as Mui from '@mui/material/';
import Nav from '../components/nav'
import '../styles.css';

const Start = () => {
  return <div>
    <Nav />

    <div className="jumbotron">
      <Mui.Container>
        <div className="darkBg">
          <Mui.Typography
            variant="h2"
            sx={{ mb: 5 }}
          > At ABC Bank you are more than just a customer, you are family.
          </Mui.Typography>
          <Mui.Typography
            variant="h4"
            sx={{ mb: 10 }}
          > Whatever you're saving for retirement or need a loan for a new home, you can be confident we're on your side.
          </Mui.Typography>
          <Mui.Button
            variant="contained"
            size="large"
            color="info"
            component={Mui.Link}
            href="#learn"
          > <span className="btn">Learn More</span>
          </Mui.Button>
        </div>
      </Mui.Container>
    </div>

    <div className="section" id="learn">
      <Mui.Container>
        <Mui.Grid container spacing={3}>
          <Mui.Grid xs={6}>
            <Mui.Typography variant="h4" sx={{ mb: 2 }}>
              <b>We can help you earn and save more.</b>
            </Mui.Typography>

            <Mui.Typography variant="h5">
              <p>Being an awesome customer at <i>any</i> of our competitors will save you a lot of pennies at ABC Bank. Our Pinch a Penny service can save you on average 10% annually!</p>
              <p>Would you like us to look at your existing financial relationships so that we can save you some money? </p>
            </Mui.Typography>


            <Mui.Button
              href="relationships"
              variant="contained"
              color="info"
              component={Mui.Link}
              sx={{ mt: 2, mb: 5 }}
            > <span className="btn">Lets Get Started</span>
            </Mui.Button>

            <Mui.Typography variant="subtitle1">
              I don't want to save money. Click <Mui.Link href="https://wellsfargo.com">here</Mui.Link> to open an account.
            </Mui.Typography>

          </Mui.Grid>
          <Mui.Grid xs={6} sx={{ pl: 5 }} display="flex">
            <video className="video" controls>
              <source src="https://www.dropbox.com/s/bvxhsuly4p9t7tf/Plat%20Commercials%20and%20Pitch.m4v?raw=1" type="video/mp4" />
            </video>
          </Mui.Grid>
        </Mui.Grid>
      </Mui.Container>
    </div>

  </div>
}
export default Start
