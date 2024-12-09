import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { auth } from '../../firebase'; // Importando a configuração do Firebase
import { signInWithEmailAndPassword } from 'firebase/auth';

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
        secureTextEntry={false} // Senha visível
      />
      {errorMessage ? <Text>{errorMessage}</Text> : null}
      <Button title="Entrar" onPress={handleLogin} />
      <Button 
        title="Criar Conta" 
        onPress={() => navigation.navigate('Cadastro')}  // Navega para a tela de cadastro
      />
    </View>
  );
};

export default Login;
