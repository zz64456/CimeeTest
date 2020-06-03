import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import * as Sensors from "react-native-sensors";


const Value = ({ name, value }) => (
  <View style={styles.valueContainer}>
    <Text style={styles.valueName}>{name}:</Text>
    <Text style={styles.valueValue}>{new String(value).substr(0, 8)}</Text>
  </View>
);

export default function(sensorName, values) {

    console.log("sensorName在這喔～～～～"+sensorName)
    // accelerometer
    console.log("values在這喔～～～～"+values)
    // x,y,z


    const sensor$ = Sensors[sensorName];
    // sensor$ = 類別為Sensors的東西 裡面值為 accelerometer


    return class SensorView extends Component {
        constructor(props) {
        super(props);

        const initialValue = values.reduce(
            (carry, val) => ({ ...carry, [val]: 0 }),
            {}
        );
        this.state = initialValue;
        // console.log('initial....' + this.state)
        }

        UNSAFE_componentWillMount() {
        const subscription = sensor$.subscribe(values => {
            this.setState({ ...values });
        });
        
        this.setState({ subscription });
        
        }

        // componentDidMount() {
        //     console.log('value:...'+this.state.x)
        //     console.log('subscription:...'+this.state.subscription)
        // }

        componentWillUnmount() {
        this.state.subscription.unsubscribe();
        this.setState({ subscription: null });
        }

        render() {
            return (
                <View style={styles.container}>
                <Text style={styles.headline}>{sensorName} valuessss</Text>
                {values.map(valueName => (
                    <Value
                    key={sensorName + valueName}
                    name={valueName}
                    value={this.state[valueName]}
                    />
                ))}
                </View>
            );
        }
    };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#cafcde",
    marginTop: 10,
    marginBottom: 10
  },
  headline: {
    fontSize: 30,
    textAlign: "left",
    margin: 10
  },
  valueContainer: {
    flexDirection: "row",
    flexWrap: "wrap"
  },
  valueValue: {
    width: 200,
    fontSize: 20
  },
  valueName: {
    width: 50,
    fontSize: 20,
    fontWeight: "bold"
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5
  }
});
