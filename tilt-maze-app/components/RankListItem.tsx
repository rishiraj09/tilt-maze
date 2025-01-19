import React from "react";
import { StyleSheet, View, Text } from "react-native";
import FA6 from "react-native-vector-icons/FontAwesome6";
import MC from "react-native-vector-icons/MaterialCommunityIcons";

interface RankListData {
  item: {
    id: string;
    user_id: string;
    user: string;
    timer: string;
    time_in_second: number;
    collision: number;
    createdAt: string;
  };
  index: number;
}

const RankListItem = ({ item, index }: RankListData) => {
  return (
    <View style={styles.item}>
      <View style={styles.rank}>
        <Text style={styles.rankText}>{index + 1}</Text>
      </View>
      <View style={styles.user}>
        <FA6 name="user-large" size={18} color="grey" />
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{item.user}</Text>
        <Text style={styles.timestamp}>{item.createdAt}</Text>
      </View>
      <View style={styles.badgeHolder}>
        <View style={styles.badge}>
          <MC
            name="arrow-collapse-all"
            size={15}
            color="grey"
          />
          <Text style={styles.badgeText}>{item.collision}</Text>
        </View>
        <View style={styles.badge}>
          <MC
            name="camera-timer"
            size={15}
            color="grey"
          />
          <Text style={styles.badgeText}>{item.timer}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    width: "100%",
    height: 60,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    // borderColor: "#20eefb",
    backgroundColor: "#292828",
    marginBottom: 10,
    borderRadius: 10,
    padding: 5,
    paddingRight: 10,
    gap: 10,
  },
  rank: {
    width: 30,
    height: 30,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  rankText: {
    fontSize: 25,
    fontWeight: "bold",
    color: "white",
  },
  user: {
    width: 35,
    height: 35,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#424140",
    borderRadius: 10,
  },
  info: {
    flex: 1,
    display: "flex",
    alignItems: "flex-start",
    gap: 3
  },
  name: {
    fontSize: 15,
    fontWeight: "bold",
    color: "white",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  timestamp:{
    fontSize: 10,
    color: "grey"
  },
  badgeHolder: {
    width: 80,
    height: "100%",
    display: "flex",
    justifyContent:"space-between"
  },
  badge:{
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    width: "100%",
    height: "48%",
    backgroundColor: "#424140",
    paddingLeft: 5,
    paddingRight: 5,
    borderRadius: 6
  },
  badgeText:{
    color:"white",
    fontSize: 11,
    fontWeight:"bold"
  }
  
});

export default RankListItem;
