import React, { memo } from "react";
import { ScrollView, Text, SafeAreaView, View, StyleSheet, Button, TextInput } from "react-native";

const SavingInfoScreen1 = ({ navigation }) => (
    <View>
        <Text>
            I AM SAVING Sth....!!
        </Text>
    </View>
);

const SavingInfoScreen2 = ({ navigation }) => (
    <View>
        <Text>
            I got nothing to do....!!
        </Text>
    </View>
);

export {SavingInfoScreen1, SavingInfoScreen2 as S2}
// export const SavingInfoScreen1;