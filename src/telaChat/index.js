import React from 'react';
import { SafeAreaView, StyleSheet, Text } from 'react-native';
import { useRoute } from '@react-navigation/native';  // Usando o hook para pegar os parâmetros da navegação
import Balloon from '../../components/balloon'; // Importando componente para exibir as mensagens

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    marginTop: 32,
  },
});

const Chat = () => {
  const route = useRoute();  // Acessando os parâmetros passados pela navegação
  const { chat } = route.params;  // Extraindo o parâmetro 'chat'

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Chat {chat.id}</Text>
      {/* Renderizando mensagens do chat */}
      {chat.messages.map((message) => (
        <Balloon key={message.id} message={message} currentUser={32} />
      ))}
    </SafeAreaView>
  );
};

export default Chat;
