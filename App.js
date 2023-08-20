
import React, { useEffect, useState, useCallback } from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  Pressable,
  ToastAndroid
} from 'react-native';
import { FlashList } from "@shopify/flash-list";
import SearchBar from './SearchBar';
import { AddSVG, DownloadSVG, MinusSVG, SyncSVG } from './AllSVG';
import AsyncStorage from '@react-native-async-storage/async-storage';
function App() {

  const [dataList, setListData] = useState([])
  const [searchData, setSearchData] = useState([])
  // const [searchFocus, setSearchFocus] = useState([])
  const [searchTxt, setSearchTxt] = useState("")


  useEffect(() => {
    getFromStorage()
  }, [])

  const getFromStorage = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('dataList');
      let storageData = (jsonValue != null || jsonValue != undefined) ? JSON.parse(jsonValue) : null;
      ToastAndroid.showWithGravity(
        'From local storage!',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
      setListData(storageData)
    } catch (e) {
      // error reading value
      ToastAndroid.showWithGravity(
        e.message,
        ToastAndroid.LONG,
        ToastAndroid.CENTER,
      );
    }
  }
  const getList = async () => {
    ToastAndroid.showWithGravity(
      'Fetching Data!',
      ToastAndroid.SHORT,
      ToastAndroid.CENTER,
    );
    fetch('https://dummyjson.com/products')
      .then(res => res.json())
      .then((json) => {
        let mainData = dataList || []
        json?.products?.map(itm => {
          const found = mainData?.some(el => el.id === itm.id);
          if (!found)
            mainData = [...mainData, {
              title: itm?.title,
              id: itm?.id,
              quantity: 0
            }]
        })
        let sortedData = mainData?.sort((a, b) => a.id - b.id)
        ToastAndroid.showWithGravity(
          'List Updated!',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
        setListData(sortedData)
        storeData(sortedData)
      })
  }

  const storeData = async (value) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem('dataList', jsonValue);
      ToastAndroid.showWithGravity(
        'Saved locally!',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
    } catch (e) {
      // saving error
      ToastAndroid.showWithGravity(
        e.message,
        ToastAndroid.LONG,
        ToastAndroid.CENTER,
      );
    }
  };
  const AddItem = (item, idx) => {
    let dataToAdd = item.quantity + 1
    let AllData = [...dataList]
    let index = AllData?.findIndex((element) => element.id === item.id)
    AllData[index].quantity = dataToAdd
    if (searchTxt) {
      let AllData_S = [...searchData]
      AllData_S[idx].quantity = dataToAdd
      setSearchData(AllData_S)
    }
    setListData(AllData)
    storeData(AllData)
  }
  const RemoveItem = (item, idx) => {
    if (item.quantity) {
      let dataToRemove = item.quantity - 1
      let AllData = [...dataList]
      let index = AllData?.findIndex((element) => element.id === item.id)
      AllData[index].quantity = dataToRemove
      if (searchTxt) {
        let AllData_S = [...searchData]
        AllData_S[idx].quantity = dataToRemove
        setSearchData(AllData_S)
      }
      setListData(AllData)
      storeData(AllData)
    }
  }

  const onSearchData = (data) => {
    setSearchTxt(data)
    let tempdata = dataList?.filter(obj => (obj?.title?.toLowerCase()?.includes(data?.toLowerCase())) && obj);
    setSearchData(tempdata)
  }
  const UploadList = () => {
    ToastAndroid.showWithGravity(
      "lol!",
      ToastAndroid.LONG,
      ToastAndroid.CENTER,
    );
  }

  // const onFocus = () => setSearchFocus(true)

  // const onBlur = () => setSearchFocus(false)

  const renderData = ({ item, index }) => <View style={styles.rowSty} >
    <View style={styles.numView}>
      <Text style={styles.num}>{index + 1}. </Text>
    </View>
    <View style={styles.txtView}>
      <Text style={styles.titTxt}>{item.title}</Text>
    </View>
    <Pressable onPress={() => RemoveItem(item, index)}>
      <MinusSVG width={25} height={25} />
    </Pressable>
    <View>
      <Text style={styles.Quantity}>{item.quantity}</Text>
    </View>
    <Pressable onPress={() => AddItem(item, index)}>
      <AddSVG width={25} height={25} />
    </Pressable>
  </View>

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={'dark-content'}
        backgroundColor={"#fff"}
      />
      <View style={styles.header}>
        <Text style={styles.title}>
          {/* Pratikesh Store */}
        </Text>
        <Pressable
          style={styles.topButtons}
          onPress={UploadList}>
          <SyncSVG width={25} height={25} />
        </Pressable>
        <Pressable
          style={styles.topButtons}
          onPress={getList}
        >
          <DownloadSVG width={25} height={25} />
        </Pressable>

      </View>
      <SearchBar
        onSearchChange={onSearchData}
        height={50}
        // onFocus={onFocus}
        // onBlur={onBlur}
        placeholder={'Search...'}
        autoCorrect={false}
        padding={5}
        returnKeyType={'search'}
        inputStyle={styles.searchSty}
      />
      {dataList && <FlashList
        data={searchTxt ? searchData : dataList}
        contentContainerStyle={styles.flashList}
        renderItem={renderData}
        estimatedItemSize={50}
        keyboardShouldPersistTaps="handled"
      />}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1
  },
  header: {
    width: '100%',
    paddingHorizontal: 5,
    backgroundColor: '#fff',
    borderColor: '#eeeeee',
    borderBottomWidth: 1,
    flexDirection: 'row',
  },
  title: {
    color: "#000", fontSize: 21, flex: 1,
    paddingVertical: 14, paddingLeft: 10,
    fontWeight: 'bold'
  },
  topButtons: {
    paddingHorizontal: 10,
    justifyContent: 'center'
  },
  searchSty: {
    borderRadius: 100,
    borderColor: "#eeeeee",
    borderWidth: 2
  },
  flashList: {
    paddingHorizontal: 10,
    paddingBottom: 10
  },
  rowSty: {
    flexDirection: 'row', alignItems: 'center', marginVertical: 5, elevation: 3, borderColor: "#eeeeee",
    borderWidth: 1, borderRadius: 10,
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 5
  },
  numView: {
    // height: '100%'
  },
  num: {
    color: '#000', fontSize: 18
  },
  txtView: {
    flex: 1,
  },
  titTxt: {
    color: "#000", fontSize: 18
  },
  Quantity: {
    color: '#000', fontSize: 18, textAlign: 'center',
    width: 50
  }
});

export default App;
