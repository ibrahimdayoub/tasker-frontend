import { useState } from 'react';
import { View, Text, ScrollView, TextInput, StatusBar, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
// import { useDebounce } from 'use-debounce';
import { useNotesApi } from '@/api/noteApi';
import Loading from '@/components/Loading';
import Error from '@/components/Error';
import Header from '@/components/Header';
import NoteCard from '@/components/NoteCard';

const NotesScreen = () => {
    const [search, setSearch] = useState('');
    // const [debouncedSearch] = useDebounce(search, 2500);

    const { useGetNotes } = useNotesApi();
    // const { data: response, isLoading, isError, error, isFetching, refetch } = useGetNotes(userId, debouncedSearch); // Backend search & Debounceing
    const { data: response, isLoading, isError, error, isFetching, refetch } = useGetNotes();

    const notes = response?.data || [];

    // Frontend search & filteredNotes instead of notes
    const filteredNotes = notes.filter(note => {
        const query = search.toLowerCase().trim();
        if (query === '') return true;

        return (
            note.title.toLowerCase().includes(query) ||
            (note.content && note.content.toLowerCase().includes(query)) ||
            note.tags.some(tag => tag.toLowerCase().includes(query))
        );
    });

    if (isLoading) return <Loading text='Loading Notes' />;
    if (isError) return <Error error={error} refetch={refetch} />;

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#4f46e5' }} edges={['top']}>
            <StatusBar barStyle="light-content" backgroundColor="#4f46e5" />
            <ScrollView
                showsVerticalScrollIndicator={false}
                className="flex-1 bg-back"
                contentContainerClassName="px-3.5 py-7 gap-10"
                refreshControl={
                    <RefreshControl
                        refreshing={isFetching}
                        onRefresh={refetch}
                        colors={['#4f46e5']}
                        tintColor={'#4f46e5'}
                    />
                }
            >
                {/* Header */}
                <Header
                    title="Notes List"
                    subtitle="My Thoughts"
                    iconName="archive"
                    href="/archive/notes"
                />
                {/* Search */}
                <View className="px-3.5 py-1 flex-row items-center gap-1.5 bg-white rounded-full">
                    <Ionicons name="search" size={20} color="#6b7280" />
                    <TextInput
                        value={search}
                        onChangeText={setSearch}
                        placeholder="Search your notes..."
                        className="py-2.5 flex-1 text-sm text-gray-500"
                    />
                </View>
                {/* Pinned Notes */}
                {
                    filteredNotes.some(n => n.isPinned) && (
                        <View className="px-3.5 py-5 gap-5 bg-white rounded-2xl shadow-sm border border-gray-100">
                            <View className="flex-row items-center gap-1.5">
                                <MaterialCommunityIcons name="pin" size={25} color="#4f46e5" />
                                <Text className="text-2xl font-bold text-gray-900">Pinned <Text className='text-xs text-indigo-600'>({filteredNotes.filter(n => n.isPinned).length})</Text></Text>
                            </View>
                            <View className="gap-5">
                                {
                                    filteredNotes.filter(n => n.isPinned).map((note, index) => {
                                        return (
                                            <NoteCard key={note._id} note={note} />
                                        )
                                    })
                                }
                            </View>
                        </View>
                    )
                }
                {/* Notes List */}
                <View className="px-3.5 py-5 gap-10 bg-white rounded-2xl shadow-sm border border-gray-100">
                    <View>
                        <Text className="text-2xl font-bold text-gray-900">Personal Vault
                            {
                                filteredNotes.filter(n => !n.isPinned).length ?
                                    <Text className='text-xs text-indigo-600'> ({filteredNotes.filter(n => !n.isPinned).length})</Text> :
                                    null
                            }
                        </Text>
                        <Text className="text-xs text-gray-500">Your thoughts and important notes</Text>
                    </View>
                    {
                        filteredNotes.filter(n => !n.isPinned).length === 0 ? (
                            <View className="px-5 py-10 justify-center items-center text-center">
                                <Text className="font-light text-gray-500">No notes in your vault yet!</Text>
                            </View>
                        ) : (
                            <View className="gap-5">
                                {
                                    filteredNotes.filter(n => !n.isPinned).map((note, index) => {
                                        return (
                                            <NoteCard key={note._id} note={note} />
                                        )
                                    })
                                }
                            </View>
                        )
                    }
                </View>
                <View style={{ height: 25 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

export default NotesScreen;