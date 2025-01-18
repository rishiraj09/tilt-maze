import React, { useEffect, useState, useContext } from "react";
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
import {z, ZodType} from "zod";
import Toast from "react-native-toast-message";



// context
import { AuthContext } from "@/contexts/AuthContext";

// component
import { toastConfig } from "@/components/ToastConfig";

interface Formdata {
  email: string;
  password: string;
}

interface ErrorParams {
  path: string;
  message: string;
}

const SignIn = () => {
  const {handleSignin} = useContext(AuthContext)
  const [formdata, setFormdata] = useState<Formdata>({
    email: "",
    password: "",
  });
  const [errorParams, setErrorParams] = useState<ErrorParams[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const signinSchema:ZodType<Formdata> = z.object({
    email: z.string().email(),
    password: z.string()
  });

  useEffect(()=>{
    if(errorParams.length >0){
      errorToast("Invalid Credential", "Enter valid credential!")
    }
  },[errorParams])

  const errorToast = (title:string, message: string) => {
    Toast.show({
      type: 'error', // or 'error'
      text1: title,
      text2: message,
    });
  };

  const handleFormValidation = () =>{
    let errlist:ErrorParams[] = [];
    const validation = signinSchema.safeParse(formdata);
    if(!validation.success){
      const {errors} = validation.error;
      errors.forEach(err =>{
        errlist.push({
          path: err.path[0] as string,
          message: err.message
        })
      })
    }
    setErrorParams(errlist);
    if(errlist.length >0){
      return false;
    }else{
      return true;
    }
  }

  const handleFormSubmit = async()=>{
    try {
      setLoading(true);
      const validation = handleFormValidation();
        if(!validation){
            return false;
        }
        const res = await  handleSignin(formdata);
        if(res.success === true){
          router.replace("/home");
        }else{
          errorToast(res.error, res.message)
        }
    } catch (error) {
      console.log("Error signing in user");
    }finally{
      setLoading(false);
    }
  }

 

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
        <Toast config={toastConfig}/>
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
          <TouchableOpacity style={styles.button}
          onPress={handleFormSubmit}
          >
            <Text style={styles.buttonText}>
             {loading ? "Signing in ..": "Sign In"}
            </Text>
          </TouchableOpacity>

          {/* link holder */}
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
