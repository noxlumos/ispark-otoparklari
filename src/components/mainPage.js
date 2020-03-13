import React, { Component } from 'react';
import CarParkDetailPage from './carParkDetailPage';
import axios from 'axios';
import { Container, Row, Col } from 'reactstrap';
import './mainPage.css';
class MainPage extends Component {
  
    constructor(props) {
        super(props);
        this.state = {
            carparks: [],
            selected: []
        };
        
    }

    componentDidMount(){
        axios.get('https://api.ibb.gov.tr/ispark/Park')
            .then(response=>{
                    this.setState({carparks: [...response.data],
                                    start: true});
            }).catch(err =>{
                    console.log(err);
            });
     }
    
    

      render() {
        let ilceler = this.state.carparks.map(item => item.Ilce)
            .filter((value, index, self) => self.indexOf(value) === index);
        ilceler.sort();
        console.log(ilceler);
        let namesMap = ilceler.map((nam, index) => {
            return (
              <tr key={index} >
                <td >
                    {nam}
                </td>
              </tr>
            );
        });
        let namesTable =  (
            <table className="table table-hover table-dark">
                <thead > 
                    <tr >
                        <th scope="col" >ilçe names</th>
                    </tr>        
                </thead>
                <tbody  >
                    {namesMap}
                </tbody>
            </table>
        );
        return (
            <Container>
                <Row>
                    <Col xs="3">
                        {namesTable}
                    </Col>
                    <Col xs="auto">
                        <CarParkDetailPage items={this.state.carparks}/>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default MainPage;