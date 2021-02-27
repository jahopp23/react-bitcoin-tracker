import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Chart from "./chart";
import { Navbar, Container, Row, Col } from 'react-bootstrap';
import { Btc } from 'react-cryptocoins';
import { FaGithub } from 'react-icons/fa';
import { ExternalLink } from 'react-external-link';






const styles = theme => ({
  "chart-container": {
    height: 400
  }
});

class App extends React.Component {
  state = {
    lineChartData: {
      labels: [],
      datasets: [
        {
          type: "line",
          label: "BTC-USD",
          backgroundColor: "rgba(0, 0, 0, 0)",
          borderColor: this.props.theme.palette.primary.main,
          pointBackgroundColor: this.props.theme.palette.secondary.main,
          pointBorderColor: this.props.theme.palette.secondary.main,
          borderWidth: "2",
          lineTension: 0.45,
          data: []
        }
      ]
    },
    lineChartOptions: {
      responsive: true,
      maintainAspectRatio: false,
      tooltips: {
        enabled: true
      },
      scales: {
        xAxes: [
          {
            ticks: {
              autoSkip: true,
              maxTicksLimit: 10
            }
          }
        ]
      }
    }
  };

  componentDidMount() {
    const subscribe = {
      type: "subscribe",
      channels: [
        {
          name: "ticker",
          product_ids: ["BTC-USD"]
        }
      ]
    };

    this.ws = new WebSocket("wss://ws-feed.gdax.com");

    this.ws.onopen = () => {
      this.ws.send(JSON.stringify(subscribe));
    };

    this.ws.onmessage = e => {
      const value = JSON.parse(e.data);
      if (value.type !== "ticker") {
        return;
      }

      const oldBtcDataSet = this.state.lineChartData.datasets[0];
      const newBtcDataSet = { ...oldBtcDataSet };
      newBtcDataSet.data.push(value.price);

      const newChartData = {
        ...this.state.lineChartData,
        datasets: [newBtcDataSet],
        labels: this.state.lineChartData.labels.concat(
          new Date().toLocaleTimeString()
        )
      };
      this.setState({ lineChartData: newChartData });
    };
  }

  componentWillUnmount() {
    this.ws.close();
  }

  render() {
    const { classes } = this.props;

    return (
      <>
      <Navbar bg="dark" variant="dark">
      <Navbar.Brand href="#home">
      <Btc style={{ marginRight: '0.25em'}}  />     
        Realtime Bitcoin Tracker
      </Navbar.Brand>
     
      
    </Navbar>
  
     
        <div className={classes["chart-container"]}>
       
     
       <Chart
         data={this.state.lineChartData}
         options={this.state.lineChartOptions}
         
       />
 
      
     </div>
     <Container>
       <Row>
       
       <Col style={{textAlign: 'center', height: '100'}}>

       <ExternalLink href="https://www.github.com/jahopp23/react-bitcoin-tracker/tree/master" style={{ color: 'black'}}>
       <h2><FaGithub></FaGithub></h2>
       </ExternalLink>
       
         
         <small>Built with React, Material UI, and Bootstrap</small>
       <br />
         <small>Deployed with Vercel</small>
      
       
       </Col>

       </Row>
       </Container>



     

     
      </>
    );
  }
}

export default withStyles(styles, { withTheme: true })(App);