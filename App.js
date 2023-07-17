import React, { useState } from "react";
import "react-native-url-polyfill/auto";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import {
  DefaultTheme,
  Button,
  Appbar,
  TextInput,
  Text,
  FAB,
  Dialog,
  Portal,
  Provider,
  Chip,
} from "react-native-paper";

import { OPENAI_API_KEY } from "@env";

export default function App() {
  const [answer, setAnswer] = useState("");
  const [visible, setVisible] = useState(false);
  const [ingredient, setIngredient] = useState("");
  const [arrIngredients, setArrIngredients] = useState([]);

  const { Configuration, OpenAIApi } = require("openai");
  const configuration = new Configuration({
    apiKey: OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  async function onSubmit(event) {
    console.log("Start ====");
    try {
      const completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `${arrIngredients.join(
          ","
        )} 를 이용해서 세 가지 레시피를 추천해줘`,
        temperature: 1,
        max_tokens: 500,
      });
      console.log(completion.data);
      setAnswer(completion.data.choices[0].text);
    } catch (e) {
      console.log(e);
    }
  }

  function addIngredient() {
    setArrIngredients((oldArray) => [...oldArray, ingredient]);
  }

  function delIngredient(value) {
    setArrIngredients(arrIngredients.filter((item) => item !== value));
  }

  return (
    <SafeAreaProvider style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="AI-cuisine 👩‍🍳" />
      </Appbar.Header>
      <Provider>
        <View style={{ height: 150 }}>
          <View style={styles.view}>
            <Text variant="headlineLarge">냉장고를 부탁해 🍏</Text>
          </View>
          <View style={styles.view}>
            {arrIngredients.map((value, index) => (
              <Chip
                key={index}
                style={{ marginHorizontal: 10 }}
                onClose={() => delIngredient(value)}
              >
                {value}
              </Chip>
            ))}
          </View>
        </View>
        <View style={styles.view}>
          <Button mode="contained" onPress={onSubmit}>
            🤖 ChatGPT 에게 물어보기
          </Button>
        </View>
        <View
          style={{
            backgroundColor: DefaultTheme.colors.primaryContainer,
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "center",
            flexWrap: "wrap",
            marginVertical: 10,
            paddingHorizontal: 30,
            marginHorizontal: 30,
            height: 300,
          }}
        >
          <Text style={{ marginTop: 30 }} variant="titleLarge">
            추천하는 세 가지 레시피입니다
          </Text>
          <Text>{answer}</Text>
          <>{answer && <Button icon="refresh" title="다시 추천해줘!" />}</>
        </View>
        <FAB icon="plus" style={styles.fab} onPress={() => setVisible(true)} />
        <View>
          <Portal>
            <Dialog visible={visible} onDismiss={() => setVisible(false)}>
              <Dialog.Title>재료 추가하기</Dialog.Title>
              <Dialog.Content>
                <TextInput value={ingredient} onChangeText={setIngredient} />
              </Dialog.Content>
              <Dialog.Actions>
                <Button mode="elevated" onPress={() => setVisible(false)}>
                  Cancel
                </Button>
                <Button mode="elevated" onPress={addIngredient}>
                  Add
                </Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>
        </View>
      </Provider>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  view: {
    // flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    marginVertical: 10,
    paddingHorizontal: 30,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 10,
    bottom: 40,
  },
  textInput: {
    width: 300,
  },
});
