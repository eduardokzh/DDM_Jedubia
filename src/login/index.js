import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Image } from 'react-native';
import { auth } from '../../firebase'; // Importando a configuração do Firebase
import { signInWithEmailAndPassword } from 'firebase/auth';

const whatsImage = require('../../assets/whats.webp'); // Logo do WhatsApp ou qualquer imagem de sua preferência

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

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
    <View style={styles.container}>

      {/* Logo */}
      <Image source={whatsImage} style={styles.image} />

      {/* Inputs de login */}
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true} // Senha oculta
        style={styles.input}
      />

      {/* Mensagem de erro */}
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

      {/* Botões de ação */}
      <View style={styles.buttonContainer}>
        <Button title="Entrar" onPress={handleLogin} color="#4CAF50" />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="Criar Conta"
          onPress={() => navigation.navigate('Cadastro')}
          color="#4CAF50"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F4F4F4', // Cor de fundo mais neutra e suave
    padding: 20,
  },
  image: {
    width: 120,
    height: 120,
    marginBottom: 40,
  },
  input: {
    width: '100%',
    padding: 15,
    marginVertical: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DDD',
    fontSize: 16,
    shadowColor: '#AAA',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3, // Sombra leve para os inputs
  },
  error: {
    color: '#FF4040',
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
  },
  buttonContainer: {
    width: '100%',
    marginVertical: 10,
  },
  footerText: {
    color: '#007BFF',
    fontSize: 14,
    marginTop: 20,
    textAlign: 'center',
  },
});

export default Login;
