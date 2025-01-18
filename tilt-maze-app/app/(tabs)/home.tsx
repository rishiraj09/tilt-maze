import React, { useEffect, useContext } from "react";
import { StyleSheet, View, Text, SafeAreaView, FlatList, RefreshControl } from "react-native";
import { useFocusEffect } from '@react-navigation/native';

// context
import { GameContext } from "@/contexts/GameContext";


// components
import RankListItem from "@/components/RankListItem";


const Home = () => {
  const { setIsStarted, fetchRankFeed, rankedlist, loading } = useContext(GameContext);
  

  useFocusEffect(
    React.useCallback(() => {
      fetchRankFeed();
      setIsStarted(false);
    }, [])
  );

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#0d1023"
      }}
    >
      <View style={{
        flex:1,
        padding: 10,
      }}>
        <FlatList
        data={rankedlist}
        keyExtractor={(item) => item.id}
        renderItem={({item, index}) =>(
          <RankListItem
            item={item}
            index={index}
          />
        )}
        ListHeaderComponent={()=>(
          <View style={styles.header}>
            <Text style={styles.headerText}>LEADER BOARD</Text>
          </View>
        )}

        refreshControl={<RefreshControl
          refreshing={loading}
          onRefresh={fetchRankFeed}
        />}
      />
      </View>
      
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "white",
  },
  header:{
    width: "100%",
    height: 40,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  headerText:{
    fontSize: 15,
    fontWeight: "bold",
    color: "white"
  }
});

export default Home;
