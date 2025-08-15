import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import {Colors }from "@/constants/Colors"; 
import { BASE_URL } from "@/constants/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export default function AuthScreen({ isDark = false }) {
  const styles = createStyles(isDark);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(true);
  const [isDisplay,setisDisplay] = useState(false);
  const [isAleart, setIsAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  

  const handleSubmit =  async(name:string,email:string,password:string) => {
    if (!email.endsWith("@iitk.ac.in")) {
      setIsAlert(true);
      setAlertMessage("Please use your IITK email address.");
      setTimeout(() => {
        setIsAlert(false);
        setAlertMessage("");
      }, 3000);
      return;
    }
    if (!email  || !password) {
  setIsAlert(true);
      setAlertMessage("Please fill all fields");
      setTimeout(() => {
        setIsAlert(false);
        setAlertMessage("");
      }, 3000);
      return;
    }
    if(password.length < 8) {
      setIsAlert(true);
      setAlertMessage("Please use a password with at least 8 characters.");
      setTimeout(() => {
        setIsAlert(false);
        setAlertMessage("");
      }, 3000);
      return;
    }

const res = await fetch(`${BASE_URL}/api/user/${isSignUp ? "signup" : "sigin"}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", 
      },
      body: JSON.stringify({
        name,
        email,
     
        password,
      }),    
    });
 
      

    if (!res.ok) {
      const errorData = await res.json();
      
        setIsAlert(true);
      setAlertMessage("Please try again later or contact support.");
      setTimeout(() => {
        setIsAlert(false);
        setAlertMessage("");
      }, 3000);
      return;
    }
    const data = await res.json();
    AsyncStorage.setItem("token", data.token);
    if(isSignUp) {
    setisDisplay(true);
    setName("");
    setEmail("");
    setPassword("");
    setTimeout(() => {
      setisDisplay(false);
    }, 3000);}

    if(!isSignUp){
    
      setIsAlert(true);
      setAlertMessage("Login successful. Redirecting to homepage");
      setTimeout(() => {
        setIsAlert(false);
        setAlertMessage("");
      
      }, 3000);
      router.push("/(tabs)");
//may be we can push to booking page directly
    }
    
  };

  return (
    <View style={styles.container}>

{isDisplay && (
  <View style={styles.card}>
    <Text style={styles.icon}>📧</Text>
    <Text style={styles.title}>Check your email</Text>
    <Text style={styles.message}>
      We've sent a verification link to your email. Click it to verify your account.
    </Text>
  </View>
)}

{isAleart && (
  <View style={styles.card}>

    <Text style={styles.message}>
     {alertMessage}
    </Text>
  </View>
)}



      <Text style={styles.heading}>{isSignUp ? "Sign Up" : "Sign In"}</Text>


      {isSignUp && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Name"
            placeholderTextColor={isDark ? "#aaa" : "#555"}
            value={name}
            onChangeText={setName}
          />
        
        </>
      )}

      <TextInput
        style={styles.input}
        placeholder="Email (@iitk.ac.in)"
        placeholderTextColor={isDark ? "#aaa" : "#555"}
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor={isDark ? "#aaa" : "#555"}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={()=>{handleSubmit(name,email,password)}}>
        <Text style={styles.buttonText}>
          {isSignUp ? "Sign Up" : "Sign In"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
        <Text style={styles.link}>
          {isSignUp
            ? "Already have an account? Sign In"
            : "Don't have an account? Sign Up"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

function createStyles(isDark : boolean) {
  return StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
    // backgroundColor: isDark  ? Colors.dark.background
    //     : Colors.light.background,
      justifyContent: "center",
    },
    heading: {
      fontSize: 26,
      textAlign: "center",
      fontFamily: "Poppins_600SemiBold",
        color: isDark ? Colors.dark.tint : Colors.light.tint,
      marginBottom: 20,
    },
    input: {
      borderWidth: 1,
      borderColor: isDark ? "#555" : "#ccc",
  backgroundColor: isDark
        ? Colors.dark.background
        : Colors.light.background,
      borderRadius: 8,
      padding: 12,
      marginBottom: 14,
      fontFamily: "OpenSans_400Regular",
      color: isDark ? Colors.dark.text : Colors.light.text,
    },
    button: {
      backgroundColor: isDark ? "#3399cc" : "#007acc",
      paddingVertical: 14,
      borderRadius: 10,
      alignItems: "center",
      marginVertical: 6,
    },
    buttonText: {
      color: "#fff",
      fontSize: 16,
      fontFamily: "Poppins_600SemiBold",
    },
    link: {
      marginTop: 10,
      fontSize: 14,
      color: isDark ? "#3399cc" : "#007acc",
      textAlign: "center",
      fontFamily: "OpenSans_400Regular",
    },
    card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    marginTop: 20,
  },
  icon: {
    fontSize: 40,
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
    color: '#333',
  },
  message: {
    fontSize: 14,
    textAlign: 'center',
    color: '#555',
  },
  });
}
