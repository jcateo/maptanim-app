import { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import LandingPage from './views/LandingPage';
import Login from './views/Login';
import Signup from './views/Signup';
import Dashboard from './views/Dashboard';
import FarmDetailScreen from './views/FarmDetailScreen';
import FarmCreationFlow from './views/FarmCreationFlow';
import MonitoringHub from './views/MonitoringHub';
import AgriLibrary from './views/AgriLibrary';
import CommunityHub from './views/CommunityHub';
import CalendarView from './views/CalendarView';
import HistoryScreen from './views/HistoryScreen';
import NotificationsScreen from './views/NotificationsScreen';
import ReportIssueScreen from './views/ReportIssueScreen';
import { addFarm, updateFarm } from './lib/utils';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function AuthStack({ onAuthSuccess }: { onAuthSuccess: () => void }) {
  const [authScreen, setAuthScreen] = useState<'landing' | 'login' | 'signup'>('landing');

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {authScreen === 'landing' && (
        <Stack.Screen
          name="Landing"
          component={() => (
            <LandingPage
              onNavigateToLogin={() => setAuthScreen('login')}
              onNavigateToSignup={() => setAuthScreen('signup')}
            />
          )}
          options={{
            animationEnabled: false,
          }}
        />
      )}
      {authScreen === 'login' && (
        <Stack.Screen
          name="Login"
          component={() => (
            <Login
              onLoginSuccess={onAuthSuccess}
              onNavigateToSignup={() => setAuthScreen('signup')}
            />
          )}
          options={{
            animationEnabled: false,
          }}
        />
      )}
      {authScreen === 'signup' && (
        <Stack.Screen
          name="Signup"
          component={() => (
            <Signup
              onSignupSuccess={() => setAuthScreen('login')}
              onNavigateToLogin={() => setAuthScreen('login')}
            />
          )}
          options={{
            animationEnabled: false,
          }}
        />
      )}
    </Stack.Navigator>
  );
}

function DashboardTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#10b981',
        tabBarInactiveTintColor: '#9ca3af',
        tabBarIcon: ({ color, size }) => {
          let iconName: string = 'home';

          if (route.name === 'DashboardScreen') {
            iconName = 'dashboard';
          } else if (route.name === 'MonitoringScreen') {
            iconName = 'trending-up';
          } else if (route.name === 'LibraryScreen') {
            iconName = 'library-books';
          } else if (route.name === 'CommunityScreen') {
            iconName = 'people';
          } else if (route.name === 'CalendarScreen') {
            iconName = 'calendar-month';
          }

          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="DashboardScreen"
        component={Dashboard}
        options={{
          title: 'Dashboard',
          tabBarLabel: 'Dashboard',
        }}
      />
      <Tab.Screen
        name="MonitoringScreen"
        component={MonitoringHub}
        options={{
          title: 'Monitoring',
          tabBarLabel: 'Monitoring',
        }}
      />
      <Tab.Screen
        name="LibraryScreen"
        component={AgriLibrary}
        options={{
          title: 'Library',
          tabBarLabel: 'Library',
        }}
      />
      <Tab.Screen
        name="CommunityScreen"
        component={CommunityHub}
        options={{
          title: 'Community',
          tabBarLabel: 'Community',
        }}
      />
      <Tab.Screen
        name="CalendarScreen"
        component={CalendarView}
        options={{
          title: 'Calendar',
          tabBarLabel: 'Calendar',
        }}
      />
    </Tab.Navigator>
  );
}

function FarmStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="MainTabs"
        component={DashboardTabs}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="CreateFarm"
        options={{
          title: 'Create Farm',
          headerShown: true,
        }}
      >
        {(props: any) => (
          <FarmCreationFlow
            onSave={async (farm) => {
              const editingFarm = props.route.params?.editingFarm;
              if (editingFarm) {
                await updateFarm(farm);
              } else {
                await addFarm(farm);
              }
              props.navigation.navigate('MainTabs', { screen: 'DashboardScreen' });
            }}
            onCancel={() => {
              props.navigation.navigate('MainTabs', { screen: 'DashboardScreen' });
            }}
            editingFarm={props.route.params?.editingFarm}
          />
        )}
      </Stack.Screen>
      <Stack.Screen
        name="FarmDetail"
        component={FarmDetailScreen}
        options={{
          headerShown: false,
          animationEnabled: true,
        }}
      />
      <Stack.Screen
        name="History"
        component={HistoryScreen}
        options={{
          headerShown: false,
          animationEnabled: true,
        }}
      />
      <Stack.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          headerShown: false,
          animationEnabled: true,
        }}
      />
      <Stack.Screen
        name="ReportIssue"
        component={ReportIssueScreen}
        options={{
          headerShown: false,
          animationEnabled: true,
        }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <>
      <StatusBar style="dark" />
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          {!isAuthenticated ? (
            <Stack.Screen
              name="Auth"
              component={() => <AuthStack onAuthSuccess={() => setIsAuthenticated(true)} />}
              options={{
                animationEnabled: false,
                headerShown: false,
              }}
              listeners={() => ({
                beforeRemove: (e) => {
                  e.preventDefault();
                },
              })}
            />
          ) : (
            <Stack.Screen
              name="App"
              component={FarmStack}
              options={{
                animationEnabled: false,
                headerShown: false,
              }}
            />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
