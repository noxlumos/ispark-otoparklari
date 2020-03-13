import React, { Component } from 'react';
import { Alert } from 'reactstrap';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import {fromLonLat} from "ol/proj";
import Vector from 'ol/source/Vector'
import Vect from 'ol/layer/Vector'
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import Icon from "ol/style/Icon";
import Style from "ol/style/Style";


class CarParkDetailPage extends Component {
      _isMouted = false;
      constructor(props) {
        super(props);
        this.state = {
          carpark : null,
          kapasite: 0,
          bos: 0,
          enlem: 0,
          boylam: 0,
          map: {},
          change: -1
        };
        
      }

      componentDidMount(){
        this._isMouted=true;
        let map = new Map({
          target: 'map',
          layers: [
              new TileLayer({
                  source: new OSM()
              })
          ],
          view: new View({

              center: fromLonLat([this.state.boylam, this.state.enlem]),
              zoom: 13
          })
        });
        setInterval(() => {
            if(this.props.items){
              if(this.state.change<this.props.change){
                const layers = [...map.getLayers().getArray()];
                layers.forEach((layer) => map.removeLayer(layer));
                map.addLayer(
                  new TileLayer({
                    source: new OSM()
                })
                );
                this.setState({carpark: this.props.items[0],
                               kapasite: this.props.items[0].Kapasitesi,
                               bos: this.props.items[0].BosKapasite,
                               enlem: this.props.items[0].Latitude,
                               boylam: this.props.items[0].Longitude,
                               adi: this.props.items[0].ParkAdi,
                              });            
                              
                let layer = new Vect({
                    source: new Vector({
                        features: [
                            new Feature({
                                geometry: new Point(fromLonLat([this.state.boylam, this.state.enlem]))
                            })
                        ]
                    })
                });

                let iconStyle = new Style({
                    image: new Icon({
                        anchor: [0.5, 1],
                        src: 'http://dev.openlayers.org/img/marker.png'
                    })
                }); 
                layer.setStyle(iconStyle);
                
                map.addLayer(layer);
                this.setState({change: this.props.change});

                
                let view = fromLonLat([this.state.boylam, this.state.enlem]);
                map.getView().setCenter(view);
              }
            }
        }, 1000);
    }

    componentWillUnmount(){
        this._isMouted=false;
    }
      render() {
        return (
            <div>
              <Alert color="secondary">
                {this.state.adi}
              </Alert>
              <Alert color="success">
                Boş Kapasite: {this.state.bos}
              </Alert>
              <Alert color="danger">
                Dolu Kapasite: {this.state.kapasite - this.state.bos}
              </Alert>
              <div id="map" className="map"></div>

            
            </div>
        )
      }
}

export default CarParkDetailPage;