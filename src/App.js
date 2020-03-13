import React , { Component } from 'react';
import './App.css';
import axios from 'axios';
import { Container, Row, Col } from 'reactstrap';
import CarParkDetailPage from './components/carParkDetailPage';
import { InputGroup,
  InputGroupButtonDropdown,
  Input,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Badge,
  Button,
  Alert } from 'reactstrap';


class App extends Component {

  constructor(props) {
      super(props);
      this.state = {
          carparks: [],
          ilceler: [],
          parks:[],
          selected: "",
          isOpen: false,
          selectedCarPark: "",
          isOpen2: false,
          winner: null,
          change: 0,
          error: ""
      };
      this.toggle = this.toggle.bind(this);
      this.toggle2 = this.toggle2.bind(this);
      this.click = this.click.bind(this);
      
  }

  componentDidMount(){
      axios.get('https://api.ibb.gov.tr/ispark/Park')
          .then(response=>{
                  this.setState({carparks: [...response.data],
                                  start: true});
                  let ilceler = this.state.carparks.map((item,key )=> item.Ilce)
                    .filter((value, index, self) => self.indexOf(value) === index);
                  ilceler.sort();
                  this.setState({ilceler: ilceler,
                                 selected: ilceler[0]})
                  let first = this.state.carparks.filter(item => item.Ilce === this.state.selected);
                  this.setState({selectedCarPark: first[0].ParkAdi,
                                 winner: [first[0]]})

          }).catch(err =>{
                  console.log(err);
          });
  }

  toggle(){
    this.setState({isOpen: !this.state.isOpen})
  }

  toggle2(){
    this.setState({isOpen2: !this.state.isOpen2})
  }

  setIlceler(){
    let ilceler = this.state.carparks.map((item,key )=> item.Ilce)
                    .filter((value, index, self) => self.indexOf(value) === index);
      ilceler.sort();
      this.setState({ilceler: ilceler});
  }

  onChange =(nam) =>{
    if(nam){
      let ilceler = this.state.ilceler.filter((ilce) =>
        ilce[0] === nam.toUpperCase()[0]);
      this.setState({ilceler: ilceler});
    }
    else{ //silinmiş
      this.setIlceler();
    }
    if(this.state.ilceler.includes(nam)){
      this.setIlceler();
      this.setState({isOpen: false})
    }
    this.setState({selected: nam});
    this.setState({isOpen: true});
  }

  onChange2 =(nam) =>{
    this.setState({selectedCarPark: nam});
    this.setState({isOpen2: !this.state.isOpen2})
  }

  click(){
    let carPark = this.state.carparks.filter((item, index) => item.ParkAdi === this.state.selectedCarPark);
    if(carPark.length === 0){
      this.setState({error: "Bu isimle otopark bulunmamaktadır"});
    }
    else{
      this.setState({winner: carPark,
                     change: this.state.change+1,
                     error: ""});
    }
    
  }

  render() {
    let namesMap = this.state.ilceler.map((nam, index) => {
        return (
          <DropdownItem key = {index}>
            <div onClick={() => this.setState({selected: nam})}>
              {nam}
            </div>
          </DropdownItem>
        );
    });
    let park = this.state.carparks.filter((item, index) => item.Ilce === this.state.selected);
    let parkMap = park.map((park, index) => {
      return (
        <DropdownItem key = {index}>
          <div onClick={() => this.setState({selectedCarPark: park.ParkAdi})}>
            {park.ParkAdi}
          </div>
        </DropdownItem>
      );
    })
    return (
        <Container>
            <Row>
               <Col xs = "12">
                <Alert color="secondary">
                  ISPARK OTOPARKLARI            
                </Alert>
              </Col>
            </Row>
            <Row>
              <br/><br/><br/>
            </Row>
            <Row  >
                <Col xs ="4">
                  <h5> <Badge color="secondary">İlçe Seçin</Badge></h5>
                  <InputGroup>
                    <Input name="input1" type="text" value = {this.state.selected} onChange={(e) => this.onChange(`${e.target.value}`)} placeholder={this.state.selected} />
                    <InputGroupButtonDropdown addonType="append" isOpen={this.state.isOpen} toggle={this.toggle}>
                    <DropdownToggle caret/>
                      <DropdownMenu>
                          {namesMap}
                      </DropdownMenu>
                    </InputGroupButtonDropdown>
                  </InputGroup>
                  <br/><br/>
                  <h5> <Badge color="secondary">Park Yeri Seçin</Badge></h5>
                  <InputGroup>
                    <Input name="input1" type="text" value = {this.state.selectedCarPark} onChange={(e) => this.onChange2(`${e.target.value}`)} placeholder={this.state.selectedCarPark} />
                    <InputGroupButtonDropdown addonType="append" isOpen={this.state.isOpen2} toggle={this.toggle2}>
                    <DropdownToggle caret/>
                      <DropdownMenu>
                          {parkMap}
                      </DropdownMenu>
                    </InputGroupButtonDropdown>
                  </InputGroup>
                  <br/><br/>
                  <p>{this.state.error}</p>
                  <Button outline style={{fontSize: 18}} color="secondary" size="lg" block onClick = {this.click}>Otoparkı Görüntülemek İçin Tıklayın</Button>

                </Col>
                <Col xs="2">

                </Col>
                <Col xs="6">
                    <CarParkDetailPage items={this.state.winner} change={this.state.change}/>
                </Col>
            </Row>
        </Container>
    );
  }
}

export default App;


