//login
import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { auth, firestore } from '../../firebase'; // Importando a configuração do Firebase
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [name, setName] = useState(''); // Nome do usuário

  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Aqui você pode definir o nome do usuário após a criação
      await updateProfile(user, { displayName: name });

      // Salvar o usuário no Firestore
      await setDoc(doc(firestore, 'users', user.uid), {
        name: name,
        email: email,
        uid: user.uid,
      });

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
        placeholder="Nome"
        value={name}
        onChangeText={setName}
      />
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
