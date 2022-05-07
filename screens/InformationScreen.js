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

function InformationScreen({ navigation, route }) {
  const weatherKey = "812229d685d8b17aede0cff9dd71990a";
  const [weather, setWeather] = useState(null);
  const [dailyWeather, setDailyWeather] = useState(null);
  useEffect(async () => {
    setWeather(await fetchLiveWeather(7.7345492, 48.5850678));
    setDailyWeather(await fetchDailyWeather(7.7345492, 48.5850678));
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
    <View>
      <Text>{w.weather[0].description}</Text>
      <Text>Température : {w.main.temp}°c</Text>
      <Text>Ressenti : {w.main.feels_like}°c</Text>
      <Text>Humidité : {w.main.humidity}%</Text>
      <Text>Vitesse du vent : {w.wind.speed} m/s</Text>
      <Text>Levé du soleil : {convertUnixTimeToLocal(w.sys.sunrise)}</Text>
      <Text>Couché du soleil : {convertUnixTimeToLocal(w.sys.sunset)}</Text>
    </View>
  );
  const displayDailyWeather = (d, i) => {
    console.log(i);
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
    <View>
      {weather != null ? (
        <View>
          <Text>Direct</Text>
          {displayLiveWeatherData(weather)}
        </View>
      ) : null}
      {weather != null ? (
        <View>
          <Text>Jour</Text>
          {dailyWeather?.daily?.map((d, i) => displayDailyWeather(d, i))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({});

export default InformationScreen;
