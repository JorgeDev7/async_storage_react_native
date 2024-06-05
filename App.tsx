import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  TouchableHighlight,
  Alert,
  Animated
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


function App(): React.JSX.Element {

  const [inputText, setInputText] = useState('');
  const [isInStorage, setIsInStorage] = useState(false);
  const [increaseAnimationValue] = useState(new Animated.Value(1));
  const [opacityValue] = useState(new Animated.Value(0));

  useEffect(() => {
    const getDataAS = async () => {
      const nameAS = await AsyncStorage.getItem('name');
      const hasName: string = nameAS ? JSON.parse(nameAS) : '';
      if (hasName) {
        setInputText(hasName);
        setIsInStorage(true);
      }
    };

    getDataAS();
  }, []);

  useEffect(() => {
    Animated.timing(opacityValue, {
      toValue: 1,
      duration: 800,
      useNativeDriver: false
    }).start();
  }, []);

  const handleInputText = (text: string) => {
    setInputText(text);
  };

  const safeData = async () => {
    try {
      if (!inputText) {
        Alert.alert('Campo vacío', 'Debes llenar el campo de nombre para continuar');
        return;
      }
      await AsyncStorage.setItem('name', JSON.stringify(inputText));
      setIsInStorage(true);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteName = async () => {
    try {
      await AsyncStorage.removeItem('name');
      setInputText('');
      setIsInStorage(false);
    } catch (error) {
      console.log(error);
    }
  };

  const decreaseButtonScale = () => {
    Animated.spring(increaseAnimationValue, {
      toValue: .9,
      useNativeDriver: false
    }).start();
  };

  const increaseButtonScale = () => {
    Animated.spring(increaseAnimationValue, {
      toValue: 1,
      friction: 4,
      useNativeDriver: false
    }).start();
  };

  const animationStyles = {
    transform: [{ scale: increaseAnimationValue }]
  };

  //todo añadir animación
  return (
    <SafeAreaView style={styles.container}>
      {isInStorage ? <Text>Hola: {inputText}</Text> : ''}
      <Animated.View style={{
        opacity: opacityValue
      }}>
        <TextInput
          placeholder='Escribe tu nombre'
          style={styles.input}
          value={inputText}
          onChangeText={value => handleInputText(value)}
        />
        <Button
          title='Guardar'
          color={'#333'}
          onPress={() => safeData()}
        />
        {isInStorage &&
          <Animated.View style={animationStyles}>
            <TouchableHighlight
              style={styles.deleteButton}
              onPress={() => deleteName()}
              onPressIn={() => decreaseButtonScale()}
              onPressOut={() => increaseButtonScale()}
            >
              <Text style={styles.deleteText}>Eliminar Nombre</Text>
            </TouchableHighlight>
          </Animated.View>}
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    alignItems: 'center',
    justifyContent: 'center'
  },
  input: {
    borderColor: "#666",
    borderBottomWidth: 1,
    width: 300,
    height: 40
  },
  deleteButton: {
    backgroundColor: '#ff3030',
    borderRadius: 5,
    marginTop: 20,
    padding: 10
  },
  deleteText: {
    color: "#FFF",
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'uppercase'
  }
});

export default App;
