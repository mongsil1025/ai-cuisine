import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { StyleSheet, Text, View, SafeAreaView, TextInput } from "react-native";
import "react-native-url-polyfill/auto";
import { Button } from "@react-native-material/core";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";

import { OPENAI_API_KEY } from "@env";

const inputboxStyles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});

const IngredientsInput = () => {
  const [ingredients, setIngredients] = useState("");
  return (
    <View>
      <TextInput
        style={inputboxStyles.input}
        placeholder="🍏 냉장고에 있는 재료를 ,로 구분해서 적어주세요"
        placeholderTextColor="#000"
        onChangeText={(i) => setIngredients(i)}
      />
    </View>
  );
};

export default function App() {
  const [answer, setAnswer] = useState("");
  const [ingredients, setIngredients] = useState("");

  const { Configuration, OpenAIApi } = require("openai");
  const configuration = new Configuration({
    apiKey: OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  async function onSubmit(event) {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `${ingredients} 를 이용해서 세 가지 레시피를 추천해줘`,
      temperature: 1,
      max_tokens: 500,
    });
    console.log(completion.data);
    setAnswer(completion.data.choices[0].text);
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text>Hi! This is AI-cuisine 👩‍🍳</Text>
      <TextInput
        style={inputboxStyles.input}
        placeholder="🍏 냉장고에 있는 재료를 ,로 구분해서 적어주세요"
        placeholderTextColor="#000"
        onChangeText={(i) => setIngredients(i)}
      />
      <Button title="🤖 ChatGPT 에게 물어보기" onPress={onSubmit} />
      <Text>{answer}</Text>
      {answer && (
        <Button
          title="다시하기"
          trailing={(props) => <Icon name="refresh" {...props} />}
        />
      )}
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
