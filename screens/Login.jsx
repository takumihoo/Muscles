import { View, Text, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import {
  colors,
  defaultStyle,
  formHeading,
  inputOptions,
  formStyles as styles,
} from "../styles/styles";
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes
} from '@react-native-google-signin/google-signin';
import { Button, TextInput } from "react-native-paper";
import Footer from "../components/Footer";
import { useDispatch, useSelector } from "react-redux";
import { login, verifyToken } from "../redux/actions/userActions";

import { useMessageAndErrorUser } from "../utils/hooks";
import { CLIENT_ID_WEB, CLIENT_ID_ANDROID, CLIENT_ID_IOS } from "@env"
const Login = ({ navigation }) => {
  const [error, setError] = useState();
  
  const {newUser, user} = useSelector((state) => state.user)
  const configureGoogleSignIn = () => {
    GoogleSignin.configure({
      webClientId: CLIENT_ID_WEB,
      androidClientId: CLIENT_ID_ANDROID,
      iosClientId: CLIENT_ID_IOS,
    });
  }
 
  useEffect(()=>{
    if (newUser){
      console.log('verified yung token at di pa existing')
      navigation.navigate("signup")
    }
 
  },[newUser, navigation])

  useEffect(() => {
    
    configureGoogleSignIn();
    GoogleSignin.signOut();
  });

 

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch()
  const loading = useMessageAndErrorUser(navigation, dispatch, "profile")

  const submitHandler = () => {
    dispatch(login(email, password))
  };
  const signIn = async () => {

    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      
      
      dispatch(verifyToken(userInfo.idToken))
      setError();
    } catch (e) {
      setError(e);
    }
  }

  return (
    <>
      <View style={defaultStyle}>
        {/* Heading */}
        <View style={{ marginBottom: 20 }}>
          <Text style={formHeading}>Login</Text>
        </View>
       
          <View style={styles.container}>
            <Text style={styles.or}>Continue with</Text>
            <GoogleSigninButton style={{ margin: 20, width: 'auto' }} size={GoogleSigninButton.Size.Standard} color={GoogleSigninButton.Color.Dark} onPress={signIn} />

            <Text style={styles.or}>OR</Text>
            <TextInput
              {...inputOptions}
              placeholder="Email"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />

            <TextInput
              {...inputOptions}
              placeholder="Password"
              secureTextEntry={true}
              value={password}
              onChangeText={setPassword}
            />

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.navigate("forgetpassword")}
            >
              <Text style={styles.forget}>Forget Password?</Text>
            </TouchableOpacity>

            <Button
              loading={loading}
              textColor={colors.color2}
              disabled={email === "" || password === ""}
              style={styles.btn}
              onPress={submitHandler}
            >
              Log In
            </Button>

            <Text style={styles.or}>OR</Text>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.navigate("signup")}
            >
              <Text style={styles.link}>Sign Up</Text>
            </TouchableOpacity>
          </View>
     
      </View>

      <Footer activeRoute="profile" />
    </>
  );
};

export default Login;
