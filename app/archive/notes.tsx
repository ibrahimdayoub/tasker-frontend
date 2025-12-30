import { View, Text, ScrollView, TouchableOpacity, StatusBar, RefreshControl, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons';
import { useNotesApi } from '@/api/noteApi';
import InnerHeader from '@/components/InnerHeader';
import Loading from '@/components/Loading';
import Error from '@/components/Error';

const ArchivedNotesScreen = () => {
  const { useGetArchivedNotes, useToggleArchive } = useNotesApi();
  const { data: response, isLoading, isError, error, isFetching, refetch } = useGetArchivedNotes();
  const { mutate: toggleArchive } = useToggleArchive();

  const archivedNotes = response?.data || [];

  const handleArchive = (noteId: string) => {
    Alert.alert(
      "Unarchive Note",
      "Move this note back to your main list?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Ok",
          onPress: () => {
            toggleArchive(noteId, {
              // onSuccess: (res) => {
              //   Toast.show({
              //     type: 'success',
              //     text1: 'Success',
              //     text2: res.message
              //   });
              // },
              onError: (err) => {
                Toast.show({
                  type: 'error',
                  text1: 'Update Failed',
                  text2: err.message
                });
              }
            });
          }
        }
      ]
    );
  };

  if (isLoading) return <Loading text='Loading Archived Notes' />;
  if (isError) return <Error error={error} refetch={refetch} />;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#4f46e5' }} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#4f46e5" />
      <View className="px-5 py-7 flex-1 -gap-5 bg-white">
        {/* Inner Header */}
        <InnerHeader
          title="Archived Notes"
          showRightIcon={false}
        />
        {/* Archived Notes */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          className="flex-1"
          contentContainerClassName="py-5"
          refreshControl={
            <RefreshControl
              refreshing={isFetching}
              onRefresh={refetch}
              colors={['#4f46e5']}
              tintColor={'#4f46e5'}
            />
          }
        >
          {
            archivedNotes.length === 0 ? (
              <View className="px-5 py-10 flex-1 justify-center items-center text-center">
                <Text className="font-light text-gray-500">No archived notes yet!</Text>
              </View>
            ) : (
              <View className="gap-5">
                {
                  archivedNotes.map((note) => (
                    <View
                      key={note._id}
                      style={{ backgroundColor: note.color + '15' }}
                      className="p-5 gap-2.5 bg-white rounded-2xl border border-gray-100"
                    >
                      <View className="flex-row justify-between items-center">
                        <Text className="flex-1 text-base font-medium text-gray-900">
                          {note.title}
                        </Text>
                        <TouchableOpacity
                          onPress={() => handleArchive(note._id)}
                          className="p-2.5 bg-white rounded-full"
                        >
                          <Ionicons name="refresh" size={15} color="#22c55e" />
                        </TouchableOpacity>
                      </View>
                      <Text className="text-sm text-gray-500">
                        {note.content}
                      </Text>
                      <View className="flex-row flex-wrap gap-1">
                        {note.tags.map((tag: string) => (
                          <View key={tag} className="px-2.5 py-1 bg-white rounded-full border border-gray-100">
                            <Text className="text-[8px] font-medium text-indigo-600 uppercase" style={{ color: '#4f46e5', fontSize: 8 }}># {tag}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  ))
                }
              </View>
            )
          }
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

export default ArchivedNotesScreen;