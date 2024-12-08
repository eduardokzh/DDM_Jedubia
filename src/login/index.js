import React, { useState } from 'react'; // useState está incluído aqui
import { View, TextInput, Button, Text } from 'react-native';
import { auth } from '../../firebase'; // Importando configuração do Firebase
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

const Login = ({ navigation }) => { // Adicionado navigation como prop
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleRegister = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      console.log('Usuário registrado com sucesso');
      navigation.navigate('Chats'); // Redireciona para a página de chats
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('Usuário logado com sucesso');
      navigation.navigate('Chats'); // Redireciona para a página de chats
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <View>
      <TextInput 
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {errorMessage ? <Text>{errorMessage}</Text> : null}
      <Button title="Registrar" onPress={handleRegister} />
      <Button title="Entrar" onPress={handleLogin} />
    </View>
  );
};

export default Login;
