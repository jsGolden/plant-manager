import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Image, FlatList, Alert } from "react-native";
import { useNavigation } from "@react-navigation/core";

import { formatDistance } from "date-fns";
import { ptBR } from "date-fns/locale";

import { Header } from "../components/Header";
import { PlantCardSecondary } from "../components/PlantCardSecondary";
import { Load } from "../components/Load";
import { DeleteConfirmation } from '../components/DeleteConfirmation';

import { loadPlant, PlantProps, removePlant } from "../libs/storage";
import waterdrop from "../assets/waterdrop.png";

import colors from "../styles/colors";
import fonts from "../styles/fonts";

export function MyPlants() {
  const navigation = useNavigation();

  const [myPlants, setMyPlants] = useState<PlantProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [nextWatered, setNextWatered] = useState<string>();

  const [alert, setAlert] = useState(false);
  const [plantToDelete, setPlantToDelete] = useState({} as PlantProps);

  function handleRemove(plant: PlantProps) {
    setPlantToDelete(plant);
    setAlert(true);
  }

  function handleDeleteConfirmed() {
    async function remove() {
      try {
        await removePlant(plantToDelete.id);
             
        setMyPlants((oldData) =>
          oldData.filter((item) => item.id !== plantToDelete.id)
        );
        setAlert(false);
      } catch {
        Alert.alert("Não foi possível remover! 😥");
      }
    }
    remove();
  }

  function handleCardPress(plant: PlantProps) {
    navigation.navigate('PlantSave', { plant });
  }

  useEffect(() => {
    async function loadStoragedData() {
      const plantsStoraged = await loadPlant();

      if(plantsStoraged.length < 1) {
        setNextWatered('Nenhuma planta esperando para ser regada.');
        setLoading(false);
        return;
      }
        
      const nextTime = formatDistance(
        new Date(plantsStoraged[0].dateTimeNotification).getTime(),
        new Date().getTime(),
        { locale: ptBR }
      );

      setNextWatered(
        `Não esqueça de regar a ${plantsStoraged[0].name} daqui a ${nextTime}.`
      );

      setMyPlants(plantsStoraged);
      setLoading(false);
    }

    loadStoragedData();
  }, []);

  if (loading) return <Load />;

  return (
    <>
    <View style={styles.container}>
      <Header />

      <View style={styles.spotlight}>
        <Image source={waterdrop} style={styles.spotlightImage} />
        <Text style={styles.spotlightText}>{nextWatered}</Text>
      </View>

      <View style={styles.plants}>
        <Text style={styles.plantsTitle}>Próximas regadas</Text>

        <FlatList
          data={myPlants}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <PlantCardSecondary  
              data={item}
              handleRemove={() => handleRemove(item)} 
              onPress={() => handleCardPress(item)}
            />
          )}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>

    { alert && (
      <DeleteConfirmation
        plant={plantToDelete}
        onCancel={() => setAlert(false)}
        onDelete={handleDeleteConfirmed}
      />
    )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 30,
    paddingTop: 50,
    backgroundColor: colors.background,
  },
  spotlight: {
    backgroundColor: colors.blue_light,
    paddingHorizontal: 20,
    borderRadius: 20,
    height: 110,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  spotlightImage: {
    width: 60,
    height: 60,
  },
  spotlightText: {
    flex: 1,
    color: colors.blue,
    paddingHorizontal: 20,
  },
  plants: {
    flex: 1,
    width: "100%",
  },
  plantsTitle: {
    fontSize: 24,
    fontFamily: fonts.heading,
    color: colors.heading,
    marginVertical: 20,
  },
});
