import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Image,StyleSheet } from 'react-native';
import * as Animatable from 'react-native-animatable'; 

const SearchScreen = (fishData) => {
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const searchResultsRef = React.useRef();

  const handleSearch = () => {
    // Filter the fishData based on the searchText
    const results = fishData.filter(
      (fish) =>
        fish.name.toLowerCase().includes(searchText.toLowerCase()) ||
        fish.tags.some((tag) => tag.toLowerCase().includes(searchText.toLowerCase()))
    );
    setSearchResults(results);

    // Animate the search results container
    searchResultsRef.current.animate('bounceInUp');
  };

  const renderFishItem = ({ item }) => (
    <TouchableOpacity style={styles.searchResultItem}>
      <Image source={item.image} style={styles.searchResultImage} />
      <View style={{ marginLeft: 16 }}>
        <Text style={styles.searchResultName}>{item.name}</Text>
        <View style={{ flexDirection: 'row', marginTop: 8 }}>
          {item.tags.map((tag, index) => (
            <View key={index} style={styles.tagContainer}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Animatable.Text animation="fadeInDown" style={styles.searchTitle}>
        Search Fish:
      </Animatable.Text>
      <Animatable.View animation="fadeInDown" style={styles.inputContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Enter fish name or tag"
          value={searchText}
          onChangeText={(text) => setSearchText(text)}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity
          style={styles.searchButton}
          onPress={handleSearch}
          activeOpacity={0.8}
        >
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </Animatable.View>
      <Animatable.View
        ref={searchResultsRef}
        style={styles.searchResultsContainer}
        animation="bounceInUp"
      >
        <FlatList
          data={searchResults}
          renderItem={renderFishItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ flexGrow: 1 }}
          ListEmptyComponent={
            <Text style={{ textAlign: 'center', marginTop: 32 }}>
              No results found for "{searchText}"
            </Text>
          }
        />
      </Animatable.View>
    </View>
  );
};

export default SearchScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: '#CCC',
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 10,
    marginRight: 10,
  },
  searchButton: {
    backgroundColor: '#0080FF',
    borderRadius: 10,
    padding: 10,
  },
  searchButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  fishListContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  fishItemContainer: {
    margin: 10,
    backgroundColor: '#FFF',
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  fishItemImage: {
    width: '100%',
    height: 150,
  },
  fishItemName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 5,
    paddingHorizontal: 10,
  },
  fishItemTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
    paddingBottom: 5,
  },
  fishItemTag: {
    backgroundColor: '#0080FF',
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: 5,
    marginBottom: 5,
  },
  fishItemTagText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
 
 