
import React, { useEffect, useState, useCallback, FC, useMemo } from 'react';
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
const Data = {
  "categories": [
    {
      "id": 1,
      "name": "Grocery"
    },
    {
      "id": 2,
      "name": "Rice and Atta"
    },
    {
      "id": 3,
      "name": "Oils"
    },
    {
      "id": 4,
      "name": "Food and Stuff"
    },
    {
      "id": 5,
      "name": "Others"
    }
  ],
  "items": [
    {
      "id": "1",
      "name": "1kg Sugar",
      "category": "0"
    },
    {
      "id": "2",
      "name": "0.5kg sugdsadasdar",
      "category": "0"
    },
    {
      "id": "3",
      "name": "1kg ashirwad",
      "category": "1"
    },
    {
      "id": "4",
      "name": "0.5kg besan",
      "category": "1"
    },
    {
      "id": "5",
      "name": "1kg rice flour",
      "category": "2"
    },
    {
      "id": "6",
      "name": "1kg asdasda",
      "category": "2"
    },
    {
      "id": "7",
      "name": "0.5kg qweqweqw",
      "category": "3"
    },
    {
      "id": "8",
      "name": "1kg rice XCZCZ",
      "category": "3"
    }
  ]
}



type ItemData = {
  name: string,
  id: number,
  category: number,
  quantity: number,
}

type Category = {
  id: number,
  name: string
}
const App: React.FC = () => {

  const [dataList, setListData] = useState<ItemData[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [searchTxt, setSearchTxt] = useState<string>("")


  useEffect(() => {
    // getFromStorage()
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
    } catch (e: any) {
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
    fetch('https://dummyjson.com/products?limit=100')
      .then(res => res.json())
      .then((json: any) => {
        // console.log(json?.products.length)
        // let mainData = dataList || []
        // console.log(json)
        // json?.products?.map((itm: ItemData) => {
        // const found = mainData?.some((el: ItemData) => el.id === itm.id);
        // if (!found)
        // mainData = [...mainData, {
        //   title: itm?.title,
        //   id: itm?.id,
        //   quantity: 0
        // }]
        // })
        // 
        setCategories(Data.categories)
        let tempData: ItemData[] = []
        Data.items.map(itm => {
          tempData = [...tempData, {
            id: parseInt(itm.id),
            name: itm.name.toString(),
            category: parseInt(itm.category),
            quantity: 0
          }]
        })
        setListData(tempData)
        // 
        // let sortedData = mainData?.sort((a: ItemData, b: ItemData) => a.id - b.id)
        ToastAndroid.showWithGravity(
          'List Updated!',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
        // setListData(sortedData)
        // storeData(sortedData)
      })
  }

  const storeData = async (value: ItemData[]) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem('dataList', jsonValue);
      ToastAndroid.showWithGravity(
        'Saved locally!',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
    } catch (e: any) {
      // saving error
      ToastAndroid.showWithGravity(
        e.message,
        ToastAndroid.LONG,
        ToastAndroid.CENTER,
      );
    }
  };
  const AddItem = (item: ItemData, idx: number) => {
    // let dataToAdd = item.quantity + 1
    // let AllData = [...dataList]
    // let index = AllData?.findIndex((element: ItemData) => element.id === item.id)
    // AllData[index].quantity = dataToAdd
    // setListData(AllData)
    // // storeData(AllData)
  }
  const RemoveItem = (item: ItemData, idx: number) => {
    // if (item.quantity) {
    //   let dataToRemove = item.quantity - 1
    //   let AllData = [...dataList]
    //   let index = AllData?.findIndex((element: ItemData) => element.id === item.id)
    //   AllData[index].quantity = dataToRemove

    //   setListData(AllData)
    //   // storeData(AllData)
    // }
  }

  const onSearchData = (data: string) => {
    setSearchTxt(data)
  }
  const UploadList = () => {
    ToastAndroid.showWithGravity(
      "lol!",
      ToastAndroid.LONG,
      ToastAndroid.CENTER,
    );
  }

  const searchList = useMemo(() => {
    let tempdata = dataList?.filter((obj: ItemData) => (obj?.name?.toLowerCase()?.includes(searchTxt?.toLowerCase())) && obj);
    return tempdata
  }, [searchTxt, dataList])


  const renderData = ({ item, index }: { item: ItemData, index: number }) => {
    // console.log('item data')
    return <View style={styles.rowSty} >
      <View style={styles.numView}>
        <Text style={styles.num}>{index + 1}. </Text>
      </View>
      <View style={styles.txtView}>
        <Text style={styles.titTxt}>{item.name}</Text>
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
  }

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={'dark-content'}
        backgroundColor={"#fff"}
      />
      <View style={styles.header}>
        <Text style={styles.name}>
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
        placeholder={'Search...'}
        autoCorrect={false}
        padding={5}
        returnKeyType={'search'}
        inputStyle={styles.searchSty}
      />
      <View style={{
        flexDirection: 'row', justifyContent: 'space-evenly',
        flexWrap: 'wrap'
      }} >
        {categories && categories.map((itm, idx) => <Pressable key={idx}
          style={{
            width: "30%",
            marginVertical: 5, elevation: 3,
            borderColor: "#eeeeee",
            borderWidth: 1, borderRadius: 10,
            backgroundColor: "#fff",
            paddingVertical: 10,
            paddingHorizontal: 5,
            alignItems: 'center'
          }}
        ><Text style={{ color: "#000" }}>{itm.name}</Text></Pressable>)}
      </View>
      {dataList && <FlashList
        data={searchTxt ? searchList : dataList}
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
  name: {
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
