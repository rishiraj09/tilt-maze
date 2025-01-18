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
import { z, ZodType } from "zod";
import Toast from "react-native-toast-message";

// context
import { AuthContext } from "@/contexts/AuthContext";

// component
import { toastConfig } from "@/components/ToastConfig";

interface Formdata {
  name: string;
  email: string;
  password: string;
}

interface ErrorParams {
  path: string;
}

const SignUp = () => {
  const [formdata, setFormdata] = useState<Formdata>({
    name: "",
    email: "",
    password: "",
  });
  const [errorParams, setErrorParams] = useState<any>({
    name: false,
    email: false,
    password: false
  });
  const [loading, setLoading] = useState<boolean>(false);

  const signupSchema: ZodType<Formdata> = z.object({
    name: z.string().min(2).max(300),
    email: z.string().email(),
    password: z.string().min(5),
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
          <Text style={styles.header}>Register</Text>
          <TextInput
            placeholder="Name"
            placeholderTextColor="#7b7b8b"
            style={[styles.textInput, styles.error]}
            value={formdata.name}
            onChangeText={(e) => {
              setFormdata({
                ...formdata,
                name: e,
              });
            }}
          />
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
            placeholder="Password (min 5 characters)"
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
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
          <View style={styles.linkholder}>
            <Text>Already have an account?</Text>
            <TouchableOpacity
              onPress={() => {
                router.replace("/sign-in");
              }}
            >
              <Text style={styles.link}>Sign in</Text>
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
  error:{
    borderColor: "red"
  }
});

export default SignUp;
