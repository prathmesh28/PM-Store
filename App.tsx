import React, {useEffect, useState, useCallback, FC, useMemo} from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  Pressable,
  ToastAndroid,
  TextInput,
  Alert,
  useColorScheme,
} from 'react-native';
import {FlashList} from '@shopify/flash-list';
import SearchBar from './SearchBar';
import {
  AddSVG,
  DownloadSVG,
  MinusSVG,
  MoonSVG,
  SunSVG,
  SyncSVG,
} from './AllSVG';
import AsyncStorage from '@react-native-async-storage/async-storage';
const Data = {
  categories: [
    {
      id: 1,
      name: 'Grocery',
    },
    {
      id: 2,
      name: 'Rice and Atta',
    },
    {
      id: 3,
      name: 'Oils',
    },
    {
      id: 4,
      name: 'Food and Stuff',
    },
    {
      id: 5,
      name: 'Others',
    },
  ],
  items: [
    {
      id: 1,
      name: '1kg Sugar',
      category: 0,
    },
    {
      id: 2,
      name: '0.5kg sugdsadasdar',
      category: 0,
    },
    {
      id: 3,
      name: '1kg ashirwad',
      category: 1,
    },
    {
      id: 4,
      name: '0.5kg besan',
      category: 1,
    },
    {
      id: 5,
      name: '1kg rice flour',
      category: 2,
    },
    {
      id: 6,
      name: '1kg asdasda',
      category: 2,
    },
    {
      id: 7,
      name: '0.5kg qweqweqw',
      category: 3,
    },
    {
      id: 8,
      name: '1kg rice XCZCZ',
      category: 3,
    },

    {
      id: 9,
      name: '1kg rice XCZCZ',
      category: 3,
    },
    {
      id: 10,
      name: '1kg rice XCZCZ',
      category: 3,
    },
    {
      id: 11,
      name: '1kg rice XCZCZ',
      category: 3,
    },
    {
      id: 12,
      name: '1kg rice XCZCZ',
      category: 3,
    },
    {
      id: 13,
      name: '1kg rice XCZCZ',
      category: 4,
    },
    {
      id: 14,
      name: '1kg rice XCZCZ',
      category: 4,
    },
  ],
};

type ItemData = {
  name: string;
  id: number;
  category: number;
  quantity?: number;
};

type Category = {
  id: number;
  name: string;
};

type themeObj = {
  background?: string;
  surface?: string;
  text?: string;
  selected?: string;
  border?: string;
};
const liteMode = {
  background: '#fff',
  surface: '#fff',
  text: '#525252',
  selected: '#888888',
  border: '#b0b0b0',
};
const darkMode = {
  background: '#000',
  surface: '#000',
  text: '#efefef',
  selected: '#989898',
  border: '#4f4f4f',
};
const App: React.FC = () => {
  const colorScheme = useColorScheme();
  const [isDark, setIsDark] = useState(colorScheme === 'dark' ? true : false);
  const [editIP, setEditIP] = useState<boolean>(false);
  const [IPadd, setIPadd] = useState<string>(
    'http://192.168.104.69/bgs/api/get_items.php',
  );
  const [dataList, setListData] = useState<ItemData[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryID, setCategoryID] = useState<number>(0);
  const [searchTxt, setSearchTxt] = useState<string>('');

  useEffect(() => {
    getFromStorage();
  }, []);
  const theme: themeObj = isDark ? darkMode : liteMode;
  const getFromStorage = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('dataList');
      let storageData =
        jsonValue != null || jsonValue != undefined
          ? JSON.parse(jsonValue)
          : null;
      ToastAndroid.showWithGravity(
        'From local storage!',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
      setListData(storageData);
    } catch (e: any) {
      // error reading value
      ToastAndroid.showWithGravity(
        e.message,
        ToastAndroid.LONG,
        ToastAndroid.CENTER,
      );
    }
  };
  const getList = async () => {
    ToastAndroid.showWithGravity(
      'Fetching Data!',
      ToastAndroid.SHORT,
      ToastAndroid.CENTER,
    );
    await fetch(IPadd, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
      body: JSON.stringify({
        mode: 'GET_ITEMS',
      }),
    })
      .then(res => res.json())
      .then((json: any) => {
        // console.log('json', json);
        if (json?.statusCode === 200) {
          let tempJsonData = json.data;
          setCategories(tempJsonData.categories);
          let mainData = dataList || [];
          let tempData: ItemData[] = [];
          tempJsonData.items.map((itm: ItemData) => {
            const found = mainData?.findIndex(
              (el: ItemData) => el.id === itm.id,
            );
            // console.log(found, itm);
            if (found === -1) {
              tempData = [
                ...tempData,
                {
                  id: itm.id,
                  name: itm.name.toString(),
                  category: itm.category,
                  quantity: 0,
                },
              ];
            } else {
              tempData = [
                ...tempData,
                {
                  id: itm.id,
                  name: itm.name.toString(),
                  category: itm.category,
                  quantity: mainData[found].quantity,
                },
              ];
            }
          });
          setListData(tempData);
        } else {
          alert(`${IPadd} : ${json.toString()}`);
        }
      })
      .catch(e => {
        alert(`${IPadd} : ${e.toString()}`);
      });

    // setCategories(Data.categories);
    // let mainData = dataList || [];
    // let tempData: ItemData[] = [];
    // Data.items.map((itm: ItemData) => {
    //   const found = mainData?.findIndex((el: ItemData) => el.id === itm.id);
    //   // console.log(found, itm);
    //   if (found === -1) {
    //     tempData = [
    //       ...tempData,
    //       {
    //         id: itm.id,
    //         name: itm.name.toString(),
    //         category: itm.category,
    //         quantity: 0,
    //       },
    //     ];
    //   } else {
    //     tempData = [
    //       ...tempData,
    //       {
    //         id: itm.id,
    //         name: itm.name.toString(),
    //         category: itm.category,
    //         quantity: mainData[found].quantity,
    //       },
    //     ];
    //   }
    // });
    // setListData(tempData);

    ToastAndroid.showWithGravity(
      'List Updated!',
      ToastAndroid.SHORT,
      ToastAndroid.CENTER,
    );
  };

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
    let tempQuantiti = item?.quantity || 0;
    let dataToAdd = tempQuantiti + 1;
    let AllData = [...dataList];
    let index = AllData?.findIndex(
      (element: ItemData) => element.id === item.id,
    );
    AllData[index].quantity = dataToAdd;
    setListData(AllData);
    storeData(AllData);
  };

  const RemoveItem = (item: ItemData, idx: number) => {
    if (item.quantity) {
      let dataToRemove = item.quantity - 1;
      let AllData = [...dataList];
      let index = AllData?.findIndex(
        (element: ItemData) => element.id === item.id,
      );
      AllData[index].quantity = dataToRemove;
      setListData(AllData);
      storeData(AllData);
    }
  };

  const onSearchData = (data: string) => {
    setSearchTxt(data);
  };
  const UploadList = () => {
    ToastAndroid.showWithGravity(
      'lol!',
      ToastAndroid.LONG,
      ToastAndroid.CENTER,
    );
  };

  const setURL = () => {
    setEditIP(false);
    //
    getList();
  };

  const changeCat = (itm: Category) => {
    if (categoryID === itm.id) {
      setCategoryID(0);
    } else {
      setCategoryID(itm.id);
    }
  };

  const searchList = useMemo(() => {
    let tempdata = dataList?.filter(
      (obj: ItemData) =>
        obj?.name?.toLowerCase()?.includes(searchTxt?.toLowerCase()) && obj,
    );
    return tempdata;
  }, [searchTxt, dataList]);

  const catList = useMemo(() => {
    const tempcatList = dataList?.filter(
      (itm: ItemData) => itm.category === categoryID,
    );
    return tempcatList;
  }, [categoryID, dataList]);

  return (
    <View style={[styles.container, {backgroundColor: theme.background}]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.background}
      />
      <View style={[styles.header, {borderColor: theme.border}]}>
        {editIP ? (
          <>
            <TextInput
              style={[
                styles.IPinput,
                {
                  borderColor: theme.border,
                  shadowColor: theme.border,
                },
              ]}
              value={IPadd}
              onChangeText={setIPadd}
            />
            <Pressable
              style={[
                styles.goButt,
                {borderColor: theme.border, shadowColor: theme.border},
              ]}
              onPress={setURL}>
              <Text style={styles.goButtTxt}>GO</Text>
            </Pressable>
          </>
        ) : (
          <>
            <Text style={[styles.name, {color: theme.text}]}></Text>

            <Pressable
              style={styles.topButtons}
              onPress={() => setIsDark(pre => !pre)}>
              {isDark ? (
                <SunSVG width={25} height={25} />
              ) : (
                <MoonSVG width={25} height={25} />
              )}
            </Pressable>
            <Pressable
              style={styles.topButtons}
              onPress={() => setEditIP(true)}>
              <Text style={[styles.IPbuttTxt, {color: theme.text}]}>IP</Text>
            </Pressable>
            <Pressable style={styles.topButtons} onPress={UploadList}>
              <SyncSVG fill={theme.text} width={25} height={25} />
            </Pressable>
            <Pressable style={styles.topButtons} onPress={getList}>
              <DownloadSVG fill={theme.text} width={25} height={25} />
            </Pressable>
          </>
        )}
      </View>
      <SearchBar
        onSearchChange={onSearchData}
        height={50}
        placeholder={'Search...'}
        autoCorrect={false}
        padding={5}
        returnKeyType={'search'}
        inputStyle={[styles.searchSty, {borderColor: theme.border}]}
        isDark={isDark}
      />
      <View style={styles.catView}>
        {categories &&
          categories.map((itm, idx) => (
            <Pressable
              key={idx}
              style={{
                backgroundColor:
                  categoryID === itm.id ? theme.selected : theme.surface,
                borderColor: theme.border,
                shadowColor: theme.border,
                ...styles.catBox,
              }}
              onPress={() => changeCat(itm)}>
              <Text
                style={{
                  color: categoryID === itm.id ? theme.background : theme.text,
                }}>
                {itm.name}
              </Text>
            </Pressable>
          ))}
      </View>
      {dataList && (
        <FlashList
          data={searchTxt ? searchList : categoryID === 0 ? dataList : catList}
          contentContainerStyle={styles.flashList}
          renderItem={({item, index}) =>
            renderData(item, index, isDark, RemoveItem, AddItem)
          }
          estimatedItemSize={50}
          keyboardShouldPersistTaps="handled"
          extraData={isDark}
        />
      )}
    </View>
  );
};
const renderData = (
  item: ItemData,
  index: number,
  isDark: boolean,
  RemoveItem: (item: ItemData, idx: number) => void,
  AddItem: (item: ItemData, idx: number) => void,
) => {
  const theme: themeObj = isDark ? darkMode : liteMode;
  return (
    <View
      key={index}
      style={[
        styles.rowSty,
        {
          backgroundColor: theme.surface,
          borderColor: theme.border,
          shadowColor: theme.border,
        },
      ]}>
      <View style={styles.numView}>
        <Text style={[styles.num, {color: theme.text}]}>{index + 1}. </Text>
      </View>
      <View style={styles.txtView}>
        <Text style={[styles.titTxt, {color: theme.text}]}>{item.name}</Text>
      </View>
      <Pressable onPress={() => RemoveItem(item, index)}>
        <MinusSVG width={25} height={25} fill={theme.text} />
      </Pressable>
      <View>
        <Text style={[styles.Quantity, {color: theme.text}]}>
          {item.quantity}
        </Text>
      </View>
      <Pressable onPress={() => AddItem(item, index)}>
        <AddSVG width={25} height={25} fill={theme.text} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    width: '100%',
    paddingHorizontal: 5,

    borderBottomWidth: 1,
    flexDirection: 'row',
  },
  IPinput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    fontSize: 16,
    color: '#292929',
    elevation: 1,
    paddingHorizontal: 5,
    margin: 5,
    backgroundColor: '#fff',
  },
  goButt: {
    elevation: 1,
    borderWidth: 1,
    borderRadius: 10,
    margin: 5,
    paddingHorizontal: 5,
    backgroundColor: '#e7e7e7',
    justifyContent: 'center',
  },
  goButtTxt: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 18,
    paddingHorizontal: 6,
  },
  name: {
    fontSize: 21,
    flex: 1,
    paddingVertical: 14,
    paddingLeft: 10,
    fontWeight: 'bold',
  },
  IPbuttTxt: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  topButtons: {
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  searchSty: {
    borderRadius: 100,
    borderWidth: 2,
  },
  catView: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    flexWrap: 'wrap',
  },
  catBox: {
    width: '30%',
    marginVertical: 5,
    elevation: 3,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 5,
    alignItems: 'center',
  },
  flashList: {
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  rowSty: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    elevation: 3,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  numView: {
    // height: '100%'
  },
  num: {
    fontSize: 18,
  },
  txtView: {
    flex: 1,
  },
  titTxt: {
    fontSize: 18,
  },
  Quantity: {
    fontSize: 18,
    textAlign: 'center',
    width: 50,
  },
});

export default App;
