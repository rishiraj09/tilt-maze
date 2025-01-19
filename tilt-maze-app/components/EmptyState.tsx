import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import SLI from "react-native-vector-icons/SimpleLineIcons";

const EmptyState = () => {
    return (
        <View style={styles.container}>
            <SLI name="drawer" size={40} color="grey" />
            <Text style={styles.text}>No Game Log</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        height: 200,
        width: "100%",
        alignItems :"center",
        justifyContent: "center",

    },
    text:{
        fontSize: 15,
        color: "grey",
        marginTop: 10
    }
})

export default EmptyState;
