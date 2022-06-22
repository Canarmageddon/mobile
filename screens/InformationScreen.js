import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
} from "react-native";
import { usePosition } from "../contexts/GeolocationContext";
import checkStatus from "../utils/checkStatus";

function InformationScreen() {
  const [position, setPosition] = usePosition();
  const weatherKey = "812229d685d8b17aede0cff9dd71990a";
  const [weather, setWeather] = useState(null);
  const [dailyWeather, setDailyWeather] = useState(null);
  useEffect(async () => {
    setWeather(await fetchLiveWeather(position.longitude, position.latitude));
    setDailyWeather(await fetchDailyWeather(position.longitude, position.latitude));
  }, []);

  const fetchLiveWeather = async (lon, lat) => {
    return await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weatherKey}&lang=fr&units=metric`,
    ).then(checkStatus).then((res) => res.json());
  };
  const fetchDailyWeather = async (lon, lat) => {
    return await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${weatherKey}&lang=fr&units=metric&exclude=currently,hourly,minutely,alerts`,
    ).then(checkStatus).then((res) => res.json());
  };
  const convertUnixTimeToLocal = (unixTime) => {
    // const unixTime = weather.sys.sunrise;
    const date = new Date(unixTime * 1000);
    return date.toLocaleTimeString("fr-FR");
  };

  const displayLiveWeatherData = (w) => {
    let myDate = new Date(w.dt *1000);
    let splitedDate = myDate.toLocaleDateString('fr-FR').split('/');
    let dateFormatFR = splitedDate[1] + '/' + splitedDate[0] + '/' + splitedDate[2]
    return <>
      <View style={styles.infoContainer}>
        <Text style={styles.textStyle}>{dateFormatFR + ' ' + myDate.toLocaleTimeString()}</Text>
        <Text style={styles.textStyle}>{w.name}</Text>
        <View style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
          <Text style={styles.textStyle}>{w.weather[0].description[0].toUpperCase() + w.weather[0].description.slice(1)}</Text>
          <Image
            style={styles.tinyLogo}
            source={{
              uri: `https://openweathermap.org/img/wn/${w.weather[0].icon}@2x.png`,
            }}
          />
        </View>
        <Text style={styles.textStyle}>Température : {w.main.temp}°c</Text>
        <Text style={styles.textStyle}>Ressenti : {w.main.feels_like}°c</Text>
        <Text style={styles.textStyle}>Humidité : {w.main.humidity}%</Text>
        <Text style={styles.textStyle}>Vitesse du vent : {w.wind.speed} m/s</Text>
        <Text style={styles.textStyle}>
          Levé du soleil : {convertUnixTimeToLocal(w.sys.sunrise)}
        </Text>
        <Text style={styles.textStyle}>
          Couché du soleil : {convertUnixTimeToLocal(w.sys.sunset)}
        </Text>
      </View>
   </>;
  }
  const displayDailyWeather = (d, i) => {
    let myDate = new Date(w.dt *1000);
    let splitedDate = myDate.toLocaleDateString('fr-FR').split('/');
    let dateFormatFR = splitedDate[1] + '/' + splitedDate[0] + '/' + splitedDate[2]
    return (
      <View>
        <Text>{dateFormatFR + ' ' + myDate.toLocaleTimeString()}</Text>
        <Text>{d.weather[0].description[0].toUpperCase() + d.weather[0].description.slice(1)}</Text>
        <Text>Température : {d.temp.day}°c</Text>
        <Text>Ressenti : {d.feels_like.day}°c</Text>
        <Text>Humidité : {d.humidity}%</Text>
        <Text>Vitesse du vent : {d.wind_speed} m/s</Text>
        <Text>Levé du soleil : {convertUnixTimeToLocal(d.sunrise)}</Text>
        <Text>Couché du soleil : {convertUnixTimeToLocal(d.sunset)}</Text>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      {weather != null ? (
        <View style={styles.container}>{displayLiveWeatherData(weather)}</View>
      ) : null}
      
{/* //    météo sur 1 semaine */}
   {/* {weather != null ? (
        <View>
          <Text>Jour</Text>
          {dailyWeather?.daily?.map((d, i) => displayDailyWeather(d, i))}
        </View>
      ) : null} */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#333",
    flex: 1,
  },
  infoContainer:{
    margin: '10%',
    width: '100%',
    justifyContent: "space-around",
    flex: 1,
  },
  tinyLogo: {
    width: 50,
    height: 50,
    alignSelf: "center",
  },
  textStyle: {
    fontSize: 20,
    margin: 10,
    color: 'white',
  },
});
export default InformationScreen;
