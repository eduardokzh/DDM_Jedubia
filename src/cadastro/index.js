import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { auth, firestore } from '../../firebase'; // Importando a configuração do Firebase
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

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
        secureTextEntry={false} // Senha visível
      />
      {errorMessage ? <Text>{errorMessage}</Text> : null}
      <Button title="Registrar" onPress={handleRegister} />
    </View>
  );
};

export default Cadastro;
