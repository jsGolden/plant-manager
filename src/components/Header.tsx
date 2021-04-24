import React, { useEffect, useState } from "react";

import { StyleSheet, View, Text, Image, Alert } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { getStatusBarHeight } from "react-native-iphone-x-helper";
import * as ImagePicker from 'expo-image-picker';


import userImg from "../assets/avatar.png";
import colors from "../styles/colors";
import fonts from "../styles/fonts";
import { RectButton } from "react-native-gesture-handler";

export function Header() {
  const [userName, setUserName] = useState<string>();
  const [imageUri, setImageUri] = useState("http://github.com/jsGolden.png");

  useEffect(() => {
    async function loadStorageUserName() {
      const user = await AsyncStorage.getItem("@plantmanager:user");
      setUserName(user || "");
    }
    loadStorageUserName();
  }, [userName]);

  useEffect(() => {
    async function loadStorageImage() {
      const img = await AsyncStorage.getItem("@plantmanager:avatar");
      if(!img) return;
      setImageUri(img);
    }
    loadStorageImage();
  })

  function handleImageChange() {
    async function checkPermissionsAndPickImage() {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        return Alert.alert("Oops...", "Precisamos de sua permissão! 😥");
      }

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        quality: 1,
      });

      if (result.cancelled) return;

      await AsyncStorage.setItem("@plantmanager:avatar", result.uri);
      setImageUri(result.uri);
    }

    checkPermissionsAndPickImage();
  }

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.greeting}>Olá,</Text>
        <Text style={styles.username}>{userName}</Text>
      </View>
      <RectButton onPress={handleImageChange}>
        <Image style={styles.image} source={{ uri: imageUri }} />
      </RectButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 20,
    marginTop: getStatusBarHeight(),
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 40,
  },
  greeting: {
    fontSize: 32,
    color: colors.heading,
    fontFamily: fonts.text,
  },
  username: {
    fontSize: 32,
    fontFamily: fonts.heading,
    color: colors.heading,
    lineHeight: 40,
  },
});
