import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Text, View, Platform } from 'react-native';

const TabsLayout = () => {
    return (
        <Tabs screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: '#f4f7fa',
            tabBarInactiveTintColor: '#f4f7fa',
            tabBarShowLabel: false,
            tabBarStyle: {
                backgroundColor: '#111827',
                position: 'absolute',
                bottom: 7.5,
                left: '2.5%',
                width: '95%',
                height: 60,
                marginHorizontal: '2.5%',
                paddingTop: 10,
                borderRadius: 30,
                borderTopWidth: 0,
                elevation: 10,
                shadowOpacity: 0.5,
                paddingBottom: Platform.OS === 'ios' ? 20 : 0,
            }
        }}>
            <Tabs.Screen
                name="tasks"
                options={{
                    tabBarIcon: ({ color, focused }) => (
                        <View style={{ alignItems: 'center', justifyContent: 'center', width: 50 }}>
                            <Ionicons
                                name={focused ? "list-outline" : "list"}
                                size={focused ? 20 : 25}
                                color={color}
                            />
                            {
                                focused && (
                                    <Text style={{ marginTop: 0.5, color, fontSize: 10 }}>Tasks</Text>
                                )
                            }
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="add"
                options={{
                    tabBarIcon: ({ color, focused }) => (
                        <View style={{ alignItems: 'center', justifyContent: 'center', width: 100 }}>
                            <Ionicons
                                name={focused ? "add-circle-outline" : "add-circle"}
                                size={focused ? 20 : 25}
                                color={color}
                            />
                            {
                                focused && (
                                    <Text style={{ marginTop: 0.5, color, fontSize: 10 }}>Add New</Text>
                                )
                            }
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="notes"
                options={{
                    tabBarIcon: ({ color, focused }) => (
                        <View style={{ alignItems: 'center', justifyContent: 'center', width: 50 }}>
                            <Ionicons
                                name={focused ? "document-text-outline" : "document-text"}
                                size={focused ? 20 : 25}
                                color={color}
                            />
                            {
                                focused && (
                                    <Text style={{ marginTop: 0.5, color, fontSize: 10 }}>Notes</Text>
                                )
                            }
                        </View>
                    ),
                }}
            />
        </Tabs>
    );
}

export default TabsLayout;