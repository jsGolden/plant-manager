import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import { PlantProps } from "../libs/storage";

import { Header } from "../components/Header";
import { EnvironmentButton } from "../components/EnvironmentButton";
import { PlantCardPrimary } from "../components/PlantCardPrimary";
import { Load } from "../components/Load";
import { SearchInput } from "../components/SearchInput";

import colors from "../styles/colors";
import fonts from "../styles/fonts";
import api from "../services/api";

interface EnvironmentProps {
  key: string;
  title: string;
}


export function PlantSelect() {
  const [loading, setLoading] = useState(true);

  const [environments, setEnvironments] = useState<EnvironmentProps[]>([]);
  const [environmentSelected, setEnvironmentSelected] = useState("all");

  const [nameFilter, setNameFilter] = useState<string>("");

  const [plants, setPlants] = useState<PlantProps[]>([]);
  const [filteredPlants, setFilteredPlants] = useState<PlantProps[]>([]);

  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadedAll, setLoadedAll] = useState(false);

  const navigation = useNavigation();

  function getFilteredPlants(name: string, environment: string){
    if(environment === 'all') {
      if (name) 
        return plants.filter(plant => plant.name.includes(name));
      
      return plants;
    }

    return plants.filter(plant => {
      if (!name) return plant.environments.includes(environment);
      else return (
        plant.environments.includes(environment) && 
        plant.name.includes(name)
      );
    });
  }

  function handleEnvironmentSelected(environment: string) {
    setEnvironmentSelected(environment);
    const filtered = getFilteredPlants(nameFilter, environment);
    setFilteredPlants(filtered);
  }

  function handleSearch(value: string) {
    setNameFilter(value);
    const filtered = getFilteredPlants(value, environmentSelected);
    setFilteredPlants(filtered);
  }

  function handleSearchClear() {
    setNameFilter('');
    const filtered = getFilteredPlants('', environmentSelected);
    setFilteredPlants(filtered);
  }

  async function fetchPlants() {
    const { data } = await api.get(
      `plants?_sort=name&_order=asc&_page=${page}&_limit=8`
    );

    if (!data[0]) return setLoadedAll(true);

    if (page > 1) {
      setPlants((oldValue) => [...oldValue, ...data]);
      setFilteredPlants((oldValue) => [...oldValue, ...data]);
    } else {
      setPlants(data);
      setFilteredPlants(data);
    }
    setLoading(false);
    setLoadingMore(false);
  }

  function handleFetchMore(distance: number) {
    if (distance < 1 || loadedAll) return;

    setLoadingMore(true);
    setPage((oldValue) => oldValue + 1);
    fetchPlants();
  }

  function handlePlantSelect(plant: PlantProps) {
    navigation.navigate('PlantSave', { plant })
  }

  useEffect(() => {
    async function fetchEnvironment() {
      const { data } = await api.get(
        "plants_environments?_sort=title&_order=asc"
      );

      setEnvironments([
        {
          key: "all",
          title: "Todos",
        },
        ...data,
      ]);
    }

    fetchEnvironment();
  }, []);

  useEffect(() => {
    fetchPlants();
  }, []);

  if (loading) return <Load />;

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.header}>
          <Header />
          <Text style={styles.title}>Em qual ambiente</Text>
          <Text style={styles.subtitle}>você quer colocar sua planta?</Text>
        </View>

        <View>
          <FlatList
            data={environments}
            keyExtractor={(item) => String(item.key)}
            renderItem={({ item }) => (
              <EnvironmentButton
                title={item.title}
                active={item.key === environmentSelected}
                onPress={() => handleEnvironmentSelected(item.key)}
              />
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.environmentList}
            onScroll={Keyboard.dismiss}
          />
        </View>

        <View style={styles.search}>
          <SearchInput
            placeholder="Buscar pelo nome..."
            onChangeText={handleSearch}
            onClickClear={handleSearchClear}
            value={nameFilter}
          />
        </View>

        <View style={styles.plants}>
          <FlatList
            data={filteredPlants}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => (
              <PlantCardPrimary 
                data={item}
                onPress={() => handlePlantSelect(item)}
              />
            )}
            showsVerticalScrollIndicator={false}
            onScroll={Keyboard.dismiss}
            numColumns={2}
            onEndReachedThreshold={0.1}
            onEndReached={({ distanceFromEnd }) =>
              handleFetchMore(distanceFromEnd)
            }
            ListFooterComponent={
              loadingMore && !loadedAll ? (
                <ActivityIndicator color={colors.green} />
              ) : (
                <></>
              )
            }
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 17,
    color: colors.heading,
    fontFamily: fonts.heading,
    lineHeight: 20,
    marginTop: 15,
  },
  subtitle: {
    fontFamily: fonts.text,
    fontSize: 17,
    lineHeight: 20,
    color: colors.heading,
  },
  environmentList: {
    height: 40,
    justifyContent: "center",
    paddingBottom: 5,
    marginLeft: 32,
    marginVertical: 32,
    paddingRight: 32,
  },
  plants: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: "center",
  },
  search: {
    paddingHorizontal: 32,
  },
});
