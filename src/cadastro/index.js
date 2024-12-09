import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Image } from 'react-native';
import { auth, firestore } from '../../firebase'; // Importando a configuração do Firebase
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const whatsImage = require('../../assets/whats.webp');

const Cadastro = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(''); // Nome do usuário
  const [errorMessage, setErrorMessage] = useState('');

  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Definir o nome do usuário
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

  return (
    <View style={styles.container}>
      <Image source={whatsImage} style={styles.image} />
      <Text style={{color: 'white', fontSize: 40, fontWeight: 'bold'}}>WhatsApp</Text>
      <TextInput 
        placeholder="Nome"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput 
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true} // Senha oculta
        style={styles.input}
      />
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
      <View style={styles.buttonContainer}>
        <Button title="Registrar" onPress={handleRegister} color="#3fab4e" />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="Já tem uma conta? Entrar"
          onPress={() => navigation.navigate('Login')}
          color="#3fab4e"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#42f563',
    padding: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    marginVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  image: {
    width: 100,
    height: 100,
  },
  error: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    marginVertical: 5,
  },
});

export default Cadastro;
