import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  Pressable,
  Button,
} from "react-native";
import { usePosition } from "../contexts/GeolocationContext";
function InformationScreen({ navigation, route }) {
  const [position, setPosition] = usePosition();
  const weatherKey = "812229d685d8b17aede0cff9dd71990a";
  const [weather, setWeather] = useState(null);
  const [dailyWeather, setDailyWeather] = useState(null);
  useEffect(async () => {
    setWeather(await fetchLiveWeather(position.longitude, position.latitude));
    //setDailyWeather(await fetchDailyWeather(7.7345492, 48.5850678));
  }, []);

  const fetchLiveWeather = async (lon, lat) => {
    return await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weatherKey}&lang=fr&units=metric`,
    ).then((res) => res.json());
  };
  const fetchDailyWeather = async (lon, lat) => {
    return await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${weatherKey}&lang=fr&units=metric&exclude=currently,hourly,minutely,alerts`,
    ).then((res) => res.json());
  };
  const convertUnixTimeToLocal = (unixTime) => {
    // const unixTime = weather.sys.sunrise;
    const date = new Date(unixTime * 1000);
    return date.toLocaleTimeString("fr-FR");
  };

  const displayLiveWeatherData = (w) => (
    <>
      <Text style={styles.textStyle}>{w.name}</Text>
      <View style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
        <Text style={styles.textStyle}>{w.weather[0].description}</Text>
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
    </>
  );
  const displayDailyWeather = (d, i) => {
    return (
      <View>
        <Text>{d.weather[0].description}</Text>
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
      {/*
//    météo sur 1 semaine
   {weather != null ? (
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
    backgroundColor: "#9AC4F8",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    justifyContent: "space-between",
  },
  tinyLogo: {
    width: 50,
    height: 50,
    alignSelf: "center",
  },
  textStyle: {
    fontSize: 20,
    alignSelf: "center",
  },
});
export default InformationScreen;
