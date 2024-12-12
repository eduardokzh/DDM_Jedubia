import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const Balloon = ({ message, currentUser }) => {
  const isCurrentUser = message.sentBy === currentUser;

  return (
    <View style={[styles.bubble, isCurrentUser ? styles.currentUser : styles.otherUser]}>
      <Text style={isCurrentUser ? styles.currentUserText : styles.otherUserText}>
        {message.content}
      </Text>
      {message.image && <Image source={{ uri: message.image }} style={styles.image} />}
    </View>
  );
};

const styles = StyleSheet.create({
  bubble: {
    padding: 18,
    borderRadius: 25,
    marginVertical: 10,
    maxWidth: '80%',
    backgroundColor: '#F2F2F2', // Cor neutra de fundo
    shadowColor: '#B0B0B0', // Sombra suave
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3, // Para Android
  },
  currentUser: {
    backgroundColor: '#2E8B57', // Tom de verde mais elegante para o usuário atual
    alignSelf: 'flex-end', // Alinha à direita para o usuário atual
    borderBottomRightRadius: 10, // Suaviza a borda inferior direita
  },
  otherUser: {
    backgroundColor: '#E8E8E8', // Cor mais suave para outros usuários
    alignSelf: 'flex-start', // Alinha à esquerda para outros usuários
    borderBottomLeftRadius: 10, // Suaviza a borda inferior esquerda
  },
  currentUserText: {
    color: '#FFFFFF', // Texto branco para o usuário atual
    fontSize: 16, // Tamanho da fonte ajustado para legibilidade
    fontWeight: '600', // Fonte mais grossa para destaque
    lineHeight: 24, // Maior espaçamento entre linhas
  },
  otherUserText: {
    color: '#333', // Texto escuro para contraste
    fontSize: 16, 
    lineHeight: 24, // Maior espaçamento entre linhas
  },
  image: {
    width: '100%',
    height: undefined,
    aspectRatio: 1, // Proporção da imagem mantida
    borderRadius: 20,
    marginTop: 12, // Espaço extra entre a imagem e o texto
  },
});

export default Balloon;
