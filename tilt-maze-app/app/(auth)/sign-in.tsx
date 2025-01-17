import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from "react-native";
import { router } from "expo-router";

const SignIn = () => {
  const [formdata, setFormdata] = useState<{
    email: string;
    password: string;
  }>({
    email: "",
    password: "",
  });
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#0d1023",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={Platform.OS === "ios" ? 50 : 0}
        style={{
          flex: 1,
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View style={styles.form}>
          <Text style={styles.header}>Sign In</Text>
          <TextInput
            placeholder="Email"
            placeholderTextColor="#7b7b8b"
            style={styles.textInput}
            value={formdata.email}
            onChangeText={(e) => {
              setFormdata({
                ...formdata,
                email: e,
              });
            }}
          />
          <TextInput
            placeholder="Password"
            placeholderTextColor="#7b7b8b"
            style={styles.textInput}
            secureTextEntry={true}
            value={formdata.password}
            onChangeText={(e) => {
              setFormdata({
                ...formdata,
                password: e,
              });
            }}
          />
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>
          <View style={styles.linkholder}>
            <Text>Don't have an account?</Text>
            <TouchableOpacity onPress={() => {
                        router.replace("/sign-up");
                      }}>
              <Text style={styles.link}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  form: {
    width: "90%",
    height: 400,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: 6,
    padding: 15,
    gap: 10,
  },
  header: {
    width: "100%",
    textAlign: "center",
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 20,
  },
  textInput: {
    width: "100%",
    height: 45,
    borderWidth: 1,
    borderColor: "#3D424A",
    borderRadius: 5,
    padding: 5,
  },
  button: {
    width: "100%",
    height: 40,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "red",
    borderRadius: 6,
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 17,
    fontWeight: 600,
  },
  linkholder: {
    marginTop: 10,
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
  link: {
    color: "red",
  },
});

export default SignIn;
