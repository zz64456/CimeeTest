import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import {
  SavingInfoScreen,
} from './screens/SavingInfoScreen';

const Router = createStackNavigator(
  {
    SavingInfoScreen,
  },
  {
    initialRouteName: 'SavingInfoScreen',
    headerMode: 'none',
  }
);

export default createAppContainer(Router);
