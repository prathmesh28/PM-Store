import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  memo,
} from 'react';
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
  Modal,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
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
import switchTheme from 'react-native-theme-switch-animation';
import Animated, {
  FadeOutRight,
  FadeInRight,
  FadeInLeft,
  FadeOutLeft,
  FadeInDown,
  useSharedValue,
  withSpring,
  useAnimatedStyle,
  StretchInY,
} from 'react-native-reanimated';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
const AnimatedPressable = Animated.createAnimatedComponent(Pressable)
const IS_API = false;

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

const { width, height } = Dimensions.get('screen');
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
    'http://192.168.104.69/bgs/api/',
  );
  const [dataList, setListData] = useState<ItemData[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryID, setCategoryID] = useState<number>(0);
  const [searchTxt, setSearchTxt] = useState<string>('');
  const [showUpload, setShowUpload] = useState<boolean>(false);
  const [date, setDate] = useState<Date>(new Date());
  const [uploadState, setUploadState] = useState<0 | 1 | 2 | 3>(0);

  useEffect(() => {
    getFromStorage();
  }, []);

  const theme: themeObj = isDark ? darkMode : liteMode;

  const getFromStorage = async () => {
    // console.log('getFromStorage')

    // getting items
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
      if (storageData) setListData(storageData);

      // getting cat 
      const cattValue = await AsyncStorage.getItem('catList');
      let cattData =
        cattValue != null || cattValue != undefined
          ? JSON.parse(cattValue)
          : null;
      setCategories(cattData);
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
    // console.log('getList')
    ToastAndroid.showWithGravity(
      `connecting ${IPadd}`,
      ToastAndroid.SHORT,
      ToastAndroid.CENTER,
    );
    if (IS_API) {
      await fetch(`${IPadd}get_items.php`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mode: 'GET_ITEMS',
        }),
      })
        .then(res => res.json())
        .then(async (json: any) => {
          // console.log('json', json);
          if (json?.statusCode === 200) {
            let tempJsonData = json.data;
            // set cat
            setCategories(tempJsonData.categories);
            const jsonCat = JSON.stringify(tempJsonData.categories);
            await AsyncStorage.setItem('catList', jsonCat);
            // set data
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
            storeData(tempData);
            ToastAndroid.showWithGravity(
              'List Updated!',
              ToastAndroid.SHORT,
              ToastAndroid.CENTER,
            );
          } else {
            Alert.alert(`${IPadd}`, `${json.toString()}`);
          }
        })
        .catch(e => {
          Alert.alert(`Moye Moye`, `${e.toString()}`);
        });
    } else {
      // set cat
      setCategories(Data.categories);
      const jsonCat = JSON.stringify(Data.categories);
      await AsyncStorage.setItem('catList', jsonCat);

      // set data 
      let mainData = dataList || [];
      let tempData: ItemData[] = [];
      Data.items.map((itm: ItemData) => {
        const found = mainData?.findIndex((el: ItemData) => el.id === itm.id);
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
      storeData(tempData);
    }
  };

  const storeData = async (value: ItemData[]) => {
    // console.log('storeData')
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
    // console.log('AddItem')
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
    // console.log('RemoveItem')
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
    // console.log('onSearchData', data)
    setSearchTxt(data);
  };
  const UploadList = () => {
    setUploadState(0);
    setShowUpload(true);
  };

  const uploadDBFn = async () => {
    let tempDataList: {
      id: number;
      quantity: number;
    }[] = [];
    dataList?.map((itm: ItemData) => {
      // let tempDataList = dataList?.filter(({ quantity, id }: { quantity: number, id: number }) => {
      if (itm.quantity && itm.quantity > 0) {
        tempDataList = [
          ...tempDataList,
          {
            id: itm.id,
            quantity: itm.quantity,
          },
        ];
      }
    });
    if (tempDataList?.length > 0) {
      setUploadState(2);
      let formData = {
        mode: 'SAVE_DATA',
        date: moment(date).format('YYYY-MM-DD'),
        items: tempDataList,
      };

      if (IS_API) {
        await fetch(`${IPadd}save_data.php`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        })
          .then(res => res.json())
          .then(async (json: any) => {
            if (json?.statusCode === 201) {
              setListData([]);
              setCategories([]);
              storeData([])
              setCategoryID(0);
              setUploadState(0);
              setShowUpload(false);
              const jValue = JSON.stringify([]);
              await AsyncStorage.setItem('catList', jValue);
            } else {
              setUploadState(0);
              setShowUpload(false);
              Alert.alert(`Error${json?.statusCode}`, `${json.toString()}`);
            }
          })
          .catch(e => {
            setUploadState(0);
            setShowUpload(false);
            Alert.alert(`Moye Moye`, `${e.toString()}`);
          });
      } else {
        setListData([]);
        setCategories([]);
        storeData([])
        setCategoryID(0);
        setUploadState(0);
        setShowUpload(false);
        const jValue = JSON.stringify([]);
        await AsyncStorage.setItem('catList', jValue);
      }
    } else {
      setUploadState(0);
      setShowUpload(false);
      Alert.alert(`No Data`, `No Data to send!`);
    }
  };

  const setURL = () => {
    // console.log('setURL')
    setEditIP(false);
    //
    getList();
  };

  const changeCat = (itm: Category) => {
    // console.log('changeCat')
    if (categoryID === itm.id) {
      setCategoryID(0);
    } else {
      setCategoryID(itm.id);
    }
  };

  const searchList = useMemo(() => {
    // console.log('searchList', searchTxt, dataList)
    let tempdata = dataList?.filter(
      (obj: ItemData) =>
        obj?.name?.toLowerCase()?.includes(searchTxt?.toLowerCase()) && obj,
    );
    return tempdata;
  }, [searchTxt, dataList]);

  const catList = useMemo(() => {
    // console.log('catList')
    const tempcatList = dataList?.filter(
      (itm: ItemData) => itm.category === categoryID,
    );
    return tempcatList;
  }, [categoryID, dataList]);
  // cxRatio: 0.6,
  // cyRatio: 0.1,
  // 25 ?
  // width 1

  const switchThemeMode = useCallback(() => {
    let tempH: number = StatusBar?.currentHeight ? StatusBar.currentHeight : 0
    switchTheme({
      switchThemeFunction: () => setIsDark(pre => !pre),
      animationConfig: {
        type: 'circular',
        duration: 900,
        startingPoint: {
          cxRatio: 0.65,
          cyRatio: ((tempH + 25) * 1) / (height - tempH),
        },
      },
    });
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.background}
      />
      <Header
        isDark={isDark}
        theme={theme}
        editIP={editIP}
        IPadd={IPadd}
        setIPadd={setIPadd}
        setURL={setURL}
        switchThemeMode={switchThemeMode}
        setEditIP={() => setEditIP(pre => !pre)}
        UploadList={UploadList}
        getList={getList}
      />
      <SearchBar
        onSearchChange={onSearchData}
        height={50}
        placeholder={'Search...'}
        autoCorrect={false}
        padding={5}
        returnKeyType={'search'}
        inputStyle={[styles.searchSty, { borderColor: theme.border }]}
        isDark={isDark}
      />
      {searchTxt.length === 0 &&
        <Animated.View style={styles.catView}>
          {categories &&
            categories.map((itm, idx) => (
              <Category
                key={idx}
                idx={idx}
                categoryID={categoryID}
                itm={itm}
                theme={theme}
                changeCat={() => changeCat(itm)}
              />
            ))}
        </Animated.View>
      }

      {dataList?.length > 0 && (
        <>
          {/* {console.log('FlashList')} */}
          <FlashList
            data={
              searchTxt ? searchList : categoryID === 0 ? dataList : catList
            }
            contentContainerStyle={styles.flashList}
            renderItem={({ item, index }) => (
              <RenderData
                key={index}
                item={item}
                index={index}
                theme={theme}
                RemoveItem={() => RemoveItem(item, index)}
                AddItem={() => AddItem(item, index)}
              />
            )}
            estimatedItemSize={50}
            keyboardShouldPersistTaps="handled"
            extraData={isDark}
          />
        </>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={showUpload}
        onRequestClose={() => {
          setShowUpload(!showUpload);
          setUploadState(0);
        }}>
        <View style={[styles.centeredView]}>
          <View
            style={[
              styles.modalView,
              { backgroundColor: theme.surface, borderColor: theme.border },
            ]}>
            {uploadState === 0 && (
              <Animated.View
                // entering={FadeInLeft} exiting={FadeOutLeft}
                style={{
                  gap: height * 0.05,
                }}>
                <Animated.Text
                  entering={
                    FadeInLeft.damping(10) //10
                      .mass(1) //1
                      .stiffness(80) //100
                      .withInitialValues({
                        transform: [{ translateX: -width * 0.15 }],
                      })
                      .restDisplacementThreshold(0.01) //0.001
                      .restSpeedThreshold(2) //2
                  }
                  exiting={FadeOutLeft}
                  style={{
                    color: theme.text,
                    fontSize: 18,
                    textAlign: 'center',
                    alignSelf: 'center',
                    marginHorizontal: width * 0.05,
                  }}>
                  Do you want to upload data to DB?
                </Animated.Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-around',
                  }}>
                  <View
                    style={{
                      borderRadius: 10,
                      borderColor: theme.border,
                      borderWidth: 0.5,
                      elevation: 3,
                      shadowColor: theme.text,
                      backgroundColor: theme.surface
                    }}>
                    <Pressable
                      style={{
                        width: width * 0.2,
                        paddingVertical: 15,
                        alignItems: 'center',
                        borderRadius: 10,
                      }}
                      android_ripple={{ color: '#e7e7e7A1', borderless: true }}
                      onPress={() => setShowUpload(!showUpload)}>
                      <Text style={{ color: theme.text, fontSize: 16 }}>
                        Close
                      </Text>
                    </Pressable>
                  </View>
                  <View
                    style={{
                      borderRadius: 10,
                      borderColor: theme.border,
                      borderWidth: 0.5,
                      elevation: 3,
                      shadowColor: theme.text,
                      backgroundColor: theme.surface
                    }}>
                    <Pressable
                      style={{
                        width: width * 0.2,
                        paddingVertical: 15,
                        alignItems: 'center',
                        borderRadius: 10,
                      }}
                      android_ripple={{ color: '#e7e7e7A1', borderless: true }}
                      onPress={() => setUploadState(1)}>
                      <Animated.Text style={{ color: theme.text, fontSize: 16 }}>
                        Upload
                      </Animated.Text>
                    </Pressable>
                  </View>
                </View>
              </Animated.View>
            )}
            {uploadState === 1 && (
              <Animated.View
                // entering={SlideInRight}
                // exiting={SlideOutRight}
                style={{
                  gap: height * 0.05,
                }}>
                <Animated.Text
                  entering={
                    FadeInRight.damping(10) //10
                      .mass(1) //1
                      .stiffness(80) //100
                      .withInitialValues({
                        transform: [{ translateX: width * 0.35 }],
                      })
                      .restDisplacementThreshold(0.01) //0.001
                      .restSpeedThreshold(2) //2
                  }
                  exiting={FadeOutRight}
                  style={{
                    color: theme.text,
                    fontSize: 18,
                    textAlign: 'center',
                    alignSelf: 'center',
                  }}>
                  Enter Date
                </Animated.Text>
                <Animated.View entering={FadeInDown}>
                  <DatePicker
                    mode="date"
                    fadeToColor={theme.background}
                    theme={isDark ? 'dark' : 'light'}
                    date={date}
                    onDateChange={setDate}
                  />
                </Animated.View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-around',
                  }}>
                  <View
                    style={{
                      borderRadius: 10,
                      borderColor: theme.border,
                      borderWidth: 0.5,
                      elevation: 3,
                      shadowColor: theme.text,
                      backgroundColor: theme.surface
                    }}>
                    <Pressable
                      style={{
                        width: width * 0.2,
                        paddingVertical: 15,
                        alignItems: 'center',
                        borderRadius: 10,
                      }}
                      android_ripple={{ color: '#e7e7e7A1', borderless: true }}
                      onPress={() => setUploadState(0)}>
                      <Text style={{ color: theme.text, fontSize: 16 }}>
                        Back
                      </Text>
                    </Pressable>
                  </View>
                  <View
                    style={{
                      borderRadius: 10,
                      borderColor: theme.border,
                      borderWidth: 0.5,
                      elevation: 3,
                      shadowColor: theme.text,
                      backgroundColor: theme.surface
                    }}>
                    <Pressable
                      style={{
                        width: width * 0.2,
                        paddingVertical: 15,
                        alignItems: 'center',
                        borderRadius: 10,
                      }}
                      android_ripple={{ color: '#e7e7e7A1', borderless: true }}
                      onPress={() => uploadDBFn()}>
                      <Text style={{ color: theme.text, fontSize: 16 }}>
                        Upload
                      </Text>
                    </Pressable>
                  </View>
                </View>
              </Animated.View>
            )}
            {uploadState === 2 && (
              <Animated.View
                // entering={SlideInRight}
                // exiting={SlideOutRight}
                style={{
                  gap: height * 0.05,
                }}>
                <ActivityIndicator size={'large'} color={theme.text} />
                <Text
                  style={{
                    color: theme.text,
                    fontSize: 16,
                    alignSelf: 'center',
                    textAlign: 'center',
                  }}>
                  loading...
                </Text>
              </Animated.View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const Header = memo(
  ({
    isDark,
    theme,
    editIP,
    IPadd,
    setIPadd,
    setURL,
    switchThemeMode,
    setEditIP,
    UploadList,
    getList,
  }: {
    isDark: boolean;
    theme: themeObj;
    editIP: boolean;
    IPadd: string;
    setIPadd: (value: string) => void;
    setURL: () => void;
    switchThemeMode: () => void;
    setEditIP: () => void;
    UploadList: () => void;
    getList: () => void;
  }) =>
    <View style={[styles.header, { borderColor: theme.border }]}>
      {editIP ? (
        <>
          <Pressable
            android_ripple={{
              color: "#e7e7e7A1"
            }}
            style={{
              marginVertical: 10,
              paddingHorizontal: 10,
              justifyContent: 'center',
            }}
            onPress={setEditIP}
          >
            <Text style={{
              color: '#000',
              fontSize: 16,
            }}>X</Text>
          </Pressable>
          <TextInput
            style={[
              styles.IPinput,
              {
                borderColor: theme.border,
                shadowColor: theme.text,
              },
            ]}
            value={IPadd}
            onChangeText={setIPadd}
          />
          <Pressable
            style={[
              styles.goButt,
              { borderColor: theme.border, shadowColor: theme.text },
            ]}
            onPress={setURL}>
            <Text style={styles.goButtTxt}>GO</Text>
          </Pressable>
        </>
      ) : (
        <>
          <Text style={[styles.name, { color: theme.text }]}>PM Store</Text>
          <AnimatedPressable style={styles.topButtons} onPress={switchThemeMode}>
            {isDark ? (
              <SunSVG width={width * 0.065} height={width * 0.065} fill={theme.text} />
            ) : (
              <MoonSVG width={width * 0.065} height={width * 0.075} fill={theme.text} />
            )}
          </AnimatedPressable>
          <Pressable
            style={styles.topButtons}
            onPress={setEditIP}>
            <Text style={[styles.IPbuttTxt, { color: theme.text }]}>IP</Text>
          </Pressable>
          <Pressable style={styles.topButtons} onPress={UploadList}>
            <SyncSVG fill={theme.text} width={width * 0.065} height={width * 0.065} />
          </Pressable>
          <Pressable style={styles.topButtons} onPress={getList}>
            <DownloadSVG fill={theme.text} width={width * 0.065} height={width * 0.065} />
          </Pressable>
        </>
      )}
    </View>

);

const Category = memo(({
  idx,
  categoryID,
  itm,
  theme,
  changeCat,
}: {
  idx: number;
  categoryID: number;
  itm: Category;
  theme: themeObj;
  changeCat: () => void;
}) => <Animated.View
  key={idx}
  style={{
    backgroundColor: categoryID === itm.id ? theme.selected : theme.surface,
    borderColor: theme.border,
    shadowColor: theme.text,
    ...styles.catBox,
  }}
  entering={StretchInY.delay(idx * 50)}

>
    <Pressable
      style={styles.catBoxPress}
      onPress={changeCat}
      android_ripple={{
        color: `${theme.border}80`,
      }}
    >
      <Text
        style={{
          color: categoryID === itm.id ? theme.background : theme.text,
        }}>
        {itm.name}
      </Text>
    </Pressable>
  </Animated.View>
);

const RenderData = ({
  item,
  index,
  theme,
  RemoveItem,
  AddItem,
}: {
  item: ItemData;
  index: number;
  theme: themeObj;
  RemoveItem: () => void;
  AddItem: () => void;
}) =>
  <Animated.View
    entering={FadeInLeft.delay(index * 100)}
    exiting={FadeOutLeft}
    key={index}
    style={[
      styles.rowSty,
      {
        backgroundColor: theme.surface,
        borderColor: theme.border,
        shadowColor: theme.text,
      },
    ]}>
    <View style={styles.numView}>
      <Text style={[styles.num, { color: theme.text }]}>{index + 1}. </Text>
    </View>
    <View style={styles.txtView}>
      <Text style={[styles.titTxt, { color: theme.text }]}>{item.name}</Text>
    </View>
    <ItemButt
      isAdd={false}
      onPress={RemoveItem}
      color={theme.text ? theme.text : "grey"}
    />

    <View>
      <Text style={[styles.Quantity, { color: theme.text }]}>
        {item.quantity}
      </Text>
    </View>
    <ItemButt
      isAdd={true}
      onPress={AddItem}
      color={theme.text ? theme.text : "grey"}
    />

  </Animated.View>


function ItemButt({ isAdd, onPress, color }: { isAdd: boolean, onPress: () => void, color: string }) {
  const ButtSize = useSharedValue(1)
  const onPressIn = () => {
    ButtSize.value = isAdd ? 1.1 : 0.9
  }

  const onPressOut = () => {
    ButtSize.value = 1
  }
  const buttStyles = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withSpring(ButtSize.value) }]
    }
  })

  return <AnimatedPressable onPress={onPress}
    onPressIn={onPressIn}
    onPressOut={onPressOut}
    style={buttStyles}
  >
    {isAdd ?
      <AddSVG width={25} height={25} fill={color} />
      :
      <MinusSVG width={25} height={25} fill={color} />
    }
  </AnimatedPressable>
}

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
    width: width * 0.1,
    justifyContent: 'center',
    alignItems: 'center',
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
  },
  catBoxPress: {
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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    // margin: 20,
    width: width * 0.8,
    minHeight: height * 0.2,
    borderRadius: 10,
    paddingVertical: height * 0.05,
    // alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 1,
  },
});

export default App;
