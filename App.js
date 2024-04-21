import { StatusBar } from 'expo-status-bar';
import { useState,useEffect } from 'react';
import { StyleSheet, Text, View,SafeAreaView,FlatList,ActivityIndicator, TextInput,Button } from 'react-native';

export default function App() {
  const [postList,setPostList]=useState([])
  const [isLoading,setIsLoading]=useState(true)
  const [refreshing,setRefreshing]=useState(false)
  const [postTitle,setPostTitle]=useState("")
  const [postBody,setPostBody]=useState("")
  const [isPosting,setIsPosting]=useState(false)
  const fetchData=async (limit=10)=>{
    const response= await fetch(`https://jsonplaceholder.typicode.com/posts?_limit=${limit}`)
    const data=await response.json();
    setPostList(data);
    setIsLoading(false); 
  }
  const handleRefresh=()=>{
    setRefreshing(true);
    fetchData(100)
    setRefreshing(false)
  }
  useEffect(()=>{ 
    fetchData();
  },[])

  const addPost=async ()=>{
    
    setIsPosting(true);
    const response=await fetch('https://jsonplaceholder.typicode.com/posts',{
      method:'post',
      headers:{
        "Content-Type":"application/json",
      },
      body: JSON.stringify({
        title:postTitle,
        body:postBody
      })
    })
    const newPost=await response.json();
    setPostList([newPost,...postList]);
    setPostTitle('')
    setPostBody('')
    setIsPosting(false)
  }

  if(isLoading){
    return(
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size='large' color='red' />
        <Text>Loading....</Text>
      </SafeAreaView>
    );

  }
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput style={styles.input} placeholder='Post title' value={postTitle} onChangeText={setPostTitle} />
        <TextInput style={styles.input} placeholder='Post body' value={postBody} onChangeText={setPostBody}/>
        <Button title={isPosting? "Adding...":"Add Post"} onPress={addPost} disabled={isPosting} />
      </View>
      <View style={styles.containerList} >
        <FlatList
          data={postList}
          renderItem={({item})=>{
            return (
              <View style={styles.card}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.body}>{item.body}</Text>
              </View>
            );
          }}
          ListHeaderComponent={<Text style={styles.header}>Post List</Text>}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      </View>
    </SafeAreaView>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    
  },
  containerList:{
    alignItems:'center'
  },
  card:{
    borderColor:"black",
    borderRadius:5,
    borderWidth:1,
    margin:10,
    padding:10
  },
  title:{
    fontSize:20,
    fontWeight:'bold'
  },
  body:{
    fontSize:16,
    color:'#666666'
  },
  header:{
    alignItems:"center",
    fontWeight:'bold',
    fontSize:24,
    textAlign:"center"
  },
  loadingContainer:{
    flex:1,
    backgroundColor:"white",
    justifyContent:'center',
    alignItems:'center',
    paddingTop:50
  },
  input:{
    borderWidth:1,
    borderRadius:5,
    margin:5,
    padding:5
  },
  inputContainer:{
    borderWidth:1,
    borderRadius:10,
    padding:10,
    margin:10
  }

});
