import { useContext, useEffect } from "react";
import {View, Text} from "react-native";
import { Tabs } from "expo-router";


// context
import { GameContext } from "@/contexts/GameContext";


// icons
import Icon from "react-native-vector-icons/AntDesign";
import Entypo from "react-native-vector-icons/Entypo";
import FA6 from "react-native-vector-icons/FontAwesome6";


interface IconData {
  icontype: string;
  icon: any;
  color: string;
  name: string;
  focused: boolean;
}

const TabIcon = ({ icontype, icon, color, name, focused }: IconData) => {
  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        width: 60
      }}
    >
      {
        icontype === "antd" ?
        <Icon name={icon} size={24} color={focused ? color : "grey"} />: 
        icontype === "entypo" ?
        <Entypo name={icon} size={24} color={focused ? color : "grey"} />:
        <FA6 name={icon} size={24} color={focused ? color : "grey"} />
      }
      <Text style={{ color: focused ? color : "grey", fontSize: 12 }}>
        {name}
      </Text>
    </View>
  );
};

const TabsLayout = () => {
 
  const {isStarted} = useContext(GameContext);
  
 
  return (
    <>
      {/* <StatusBar style="light"/> */}
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: "white",
          tabBarInactiveTintColor: "#CDCDE0",
          tabBarStyle: {
            backgroundColor: "#161622",
            borderTopWidth: 1,
            borderTopColor: "#232533",
            height: 80,
            display: isStarted? "none": "flex",
            justifyContent: "center",
            boxSizing:"border-box",
            paddingTop: 10
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icontype="entypo"
                icon="home"
                color={color}
                name="Home"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="play"
          options={{
            title: "Play",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icontype="entypo"
                icon="game-controller"
                color={color}
                name="Play"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icontype="fa6"
                icon="user-large"
                color={color}
                name="Profile"
                focused={focused}
              />
            ),
          }}
          />
      </Tabs>
      </>
  );
};

export default TabsLayout;