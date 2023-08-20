import React from "react";
import MapView, { Circle, Marker } from "react-native-maps";
import {
  View,
  Dimensions,
  Text,
  TouchableOpacity,
  Modal,
  Image,
  ScrollView,
  Animated,
  Keyboard,
} from "react-native";
import { useState, useEffect, useRef } from "react";

//images and icons
import { Ionicons } from "@expo/vector-icons";
import currentLocation from "./assets/current-location.png";
import defaultRestIcon from "./assets/defaultRestIcon.png";
import dishPin from "./assets/DishPin.png";
import dishPinSmall from "./assets/DishPinSmall.png";
import ghost from "./assets/Ghost.png";
import loader from "./assets/loader.svg";
import shopPin from "./assets/ShopPin.png";
import clover from "./assets/Clover/Clover4.png";
import bicycle from "./assets/Bicycle.png";

import Frame0 from "./assets/Frame0.png";
import Frame1 from "./assets/Frame1.png";
import Frame2 from "./assets/Frame2.png";
import Frame3 from "./assets/Frame3.png";
import Frame4 from "./assets/Frame4.png";
import Frame5 from "./assets/Frame5.png";

import SlidingUpPanel from "rn-sliding-up-panel";

import * as Location from "expo-location";
import { TextInput } from "react-native";
import {
  getBowlInfo,
  getShops,
  getUserKey,
  acceptBowl,
  getImages,
  setVisible,
} from "./RestAPI.js";
import { useFonts, loadAsync } from "expo-font";

//components
import Restaurant from "./Components/Restaurant.js";
import NearPick from "./Components/NearPick";
import SuccessModal from "./Components/SuccessModal";
import EmoteDisplay from "./Components/EmoteDisplay";
import Checker from "./Components/Checker";
import EmoteCollection from "./Components/EmoteCollection.js";

import { styles } from "./AppStyles";

const { width, height } = Dimensions.get("window");

const ASPECT_RATIO = width / height;

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

export default function App() {
  const [location, setLocation] = useState(null);
  const [initRegion, setInitRegion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bowls, setBowls] = useState([]);
  const [displayBowls, setDisplayBowls] = useState([]); // [0, 1, 2
  const [shops, setShops] = useState([]); // [0, 1, 2
  const [selected, setSelected] = useState(0); // [0, 1, 2
  const [pickUpBowls, setPickUpBowls] = useState([]);
  const [searchWord, setSearchWord] = useState("");
  const [currentAddress, setCurrentAddress] = useState("");

  const [accpetModalVisible, setAcceptModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [emoteVisible, setEmoteVisible] = useState(false);
  const [emoteCollectionVisible, setEmoteCollectionVisible] = useState(false);
  const [backMode, setBackMode] = useState(false);

  const [draggable, setDraggable] = useState(true);
  const [status, setStatus] = useState("");
  const [userKey, setUserKey] = useState("");

  const [imageURL, setImageURL] = useState("");

  const map = useRef(null);
  const slideUp = useRef(null);
  const sizeUpAnim = useRef(new Animated.Value(0)).current;

  const [fontsLoaded] = useFonts({
    Cocogoose: require("./assets/Fonts/cocogoose/Cocogoose_trial.otf"),
    Pretendard: require("./assets/Fonts/Pretendard-1.3.8/public/static/Pretendard-Regular.otf"),
  });

  loadAsync({
    Cocogoose: require("./assets/Fonts/cocogoose/Cocogoose_trial.otf"),
    Pretendard: require("./assets/Fonts/Pretendard-1.3.8/public/static/Pretendard-Regular.otf"),
  });

  const setCurrentPosition = () => {
    (async () => {
      let _location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setLocation({
        coords: {
          latitude: _location.coords.latitude,
          longitude: _location.coords.longitude,
          accuracy: _location.coords.accuracy,
        },
      });

      const newRegion = {
        latitude: _location.coords.latitude,
        longitude: _location.coords.longitude,
        latitudeDelta: 0.0102,
        longitudeDelta: 0.0102 * ASPECT_RATIO,
      };
      map.current.animateToRegion(newRegion, 1000);
    })();
  };

  const handleMarkerPress = (key) => {
    Keyboard.dismiss();
    (async () => {
      await delay(50);
      slideUp.current.show();
    })().catch((err) => console.log(err));
    let index = -1;
    for (let i = 0; i < bowls.length; i++) {
      const bowl = bowls[i];
      if (bowl.id == key) {
        index = i;
        setSelected(i);
        break;
      }
    }
    setStatus("showOrder");
    const newRegion = {
      latitude: bowls[index].latitude,
      longitude: bowls[index].longitude,
      latitudeDelta: 0.0082,
      longitudeDelta: 0.0082 * ASPECT_RATIO,
    };
    map.current.animateToRegion(newRegion, 1000);
  };

  const handleSearch = (e) => {
    setSearchWord(e.nativeEvent.text);
  };

  const handleMapTouch = () => {
    Keyboard.dismiss();
    if (status == "pickingUp") return;
    setStatus("");
  };

  const handleFocus = (info) => {
    (async () => {
      await delay(50);
      slideUp.current.show();
    })().catch((err) => console.log(err));
    if (map.current == null) return;
    if (slideUp.current == null) return;
    const newRegion = {
      latitude: info.latitude,
      longitude: info.longitude,
      latitudeDelta: 0.0102,
      longitudeDelta: 0.0102 * ASPECT_RATIO,
    };
    map.current.animateToRegion(newRegion, 1000);
    setSelected(info);
    handleMarkerPress(info.id);
  };

  handleLocationChange = (coordinate) => {
    setLocation({
      coords: {
        latitude: coordinate.latitude,
        longitude: coordinate.longitude,
        accuracy: coordinate.accuracy,
      },
    });

    // if (status == "pickingUp") {
    //   const distance = calcDistance(
    //     coordinate.latitude,
    //     coordinate.longitude,
    //     pickUpOrder.latitude,
    //     pickUpOrder.longitude
    //   );

    //   if (distance < 100) {
    //     setStatus("returning");
    //     setDraggable(false);
    //     setTimeout(() => {
    //       setStatus("");
    //       setDraggable(true);
    //       slideUp.current.hide();
    //     }, 3000);
    //   }
    // }
  };

  const handleExitReward = () => {
    setSuccessModalVisible(false);
    setStatus("");
    slideUp.current.hide();
  };

  const handlePickUpCheck = () => {
    setSuccessModalVisible(false);
    setStatus("");
    slideUp.current.hide();
    setEmoteVisible(true);
  };

  const handlePickUpComplete = (id) => {
    //remove bowl with id from pickUpBowls
    let _pickUpBowls = [...pickUpBowls];
    for (let i = 0; i < _pickUpBowls.length; i++) {
      const bowl = _pickUpBowls[i];
      if (bowl.id == id) {
        _pickUpBowls.splice(i, 1);
        break;
      }
    }
    setPickUpBowls([..._pickUpBowls]);
    setSuccessModalVisible(true);
    updateData();
  };

  const updateData = () => {
    (async () => {
      let data = await getBowlInfo();
      console.log(data);
      setBowls(data);
      let displayData = [];
      for (let i = 0; i < data.length; i++) {
        const bowl = data[i];
        if (bowl.collectState != "COMPLETE") {
          displayData.push(bowl);
        }
      }
      setDisplayBowls(displayData);

      let myBowls = [];
      setStatus("");
      for (let i = 0; i < data.length; i++) {
        const bowl = data[i];
        if (bowl.collectState == "COLLECTING") {
          setStatus("pickingUp");
          myBowls.push(bowl);
        }
      }
      setPickUpBowls([...myBowls]);

      let _shopData = await getShops();
      console.log(_shopData);
      if (Array.isArray(_shopData)) setShops(_shopData);
      else setShops([]);

      console.log("Data Updated");
    })();
  };

  useEffect(() => {
    if (searchWord === "") {
      setDisplayBowls(bowls);
    } else {
      const newOrders = bowls.filter((order) => {
        return order.restaurantName.includes(searchWord);
      });
      setDisplayBowls(newOrders);
    }
  }, [searchWord]);

  const handlePickUp = () => {
    setAcceptModalVisible(true);
  };

  const handlePickUpConfirm = () => {
    (async () => {
      try {
        let restID = bowls[selected].restaurantId;
        await delay(50);
        slideUp.current.hide();
        console.log(bowls[selected].id);
        let res = await acceptBowl(bowls[selected], userKey);
        console.log(JSON.stringify(res));
      } catch (error) {
        console.log(error);
      }
    })();
    setAcceptModalVisible(false);
    setStatus("pickingUp");
    let _pickUpBowls = [...pickUpBowls];
    _pickUpBowls.push(bowls[selected]);
    setPickUpBowls([..._pickUpBowls]);
    const shop = shops.filter(
      (shop) => shop.shopId == bowls[selected].restaurantId
    )[0];

    if (shop == undefined) return;
    const newRegion = {
      latitude: shop.shopLocationResponseDto.latitude,
      longitude: shop.shopLocationResponseDto.longitude,
      latitudeDelta: 0.0302,
      longitudeDelta: 0.0302 * ASPECT_RATIO,
    };
    map.current.animateToRegion(newRegion, 1000);
  };

  const handleEmoteBack = () => {
    setEmoteVisible(false);
  };

  const handleCollectionBack = () => {
    setEmoteCollectionVisible(false);
  };

  const handleTextFocus = () => {
    setBackMode(true);
  };

  useEffect(() => {
    setAcceptModalVisible(false);
    setStatus("");
    (async () => {
      setLoading(true);

      // let url = await getImages();
      // setImageURL(url);

      // let _userKey = await getUserKey();
      let _shopData = await getShops();
      console.log(_shopData);
      if (Array.isArray(_shopData)) setShops(_shopData);
      else setShops([]);

      let data = await getBowlInfo();
      setBowls(data);
      let displayData = [];
      for (let i = 0; i < data.length; i++) {
        const bowl = data[i];
        if (bowl.collectState != "COMPLETE") {
          console.log(bowl.collectState);
          displayData.push(bowl);
        }
      }
      setDisplayBowls(displayData);

      let myBowls = [];
      for (let i = 0; i < data.length; i++) {
        const bowl = data[i];
        if (bowl.collectState == "COLLECTING") {
          setStatus("pickingUp");
          myBowls.push(bowl);
        }
      }
      setPickUpBowls([...myBowls]);

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let _location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setLocation({
        coords: {
          latitude: _location.coords.latitude,
          longitude: _location.coords.longitude,
          accuracy: _location.coords.accuracy,
        },
      });

      let _address = await Location.reverseGeocodeAsync({
        latitude: _location.coords.latitude,
        longitude: _location.coords.longitude,
      });
      let formattedAddress = _address[0].region + " " + _address[0].name;
      setCurrentAddress(formattedAddress);

      const shop = shops.filter(
        (shop) => shop.shopId == pickUpBowls[0].restaurantId
      )[0];
      let Region = {};
      if (pickUpBowls.length > 0 && shop !== undefined) {
        Region = {
          latitude: shop.shopLocationResponseDto.latitude,
          longitude: shop.shopLocationResponseDto.longitude,
          latitudeDelta: 0.0302,
          longitudeDelta: 0.0302 * ASPECT_RATIO,
        };
      } else {
        Region = {
          latitude: _location.coords.latitude,
          longitude: _location.coords.longitude,
          latitudeDelta: 0.0102,
          longitudeDelta: 0.0102 * ASPECT_RATIO,
        };
      }

      setInitRegion(Region);
      Animated.timing(sizeUpAnim, {
        toValue: 1,
        delay: 500,
        duration: 1000,
        useNativeDriver: true,
      }).start();
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    })();
  }, []);

  if (!fontsLoaded) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#FF9B3F",
        }}
      >
        <Image source={loader} style={{ width: 300, height: 300 }} />
      </View>
    );
  }

  return (
    <>
      {loading ? (
        // <View style={styles.container}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#FF9B3F",
          }}
        >
          <Text style={styles.loadingText}>PiCK!</Text>
          <Animated.Image
            source={ghost}
            style={{
              width: 103,
              height: 103,
              transform: [{ scale: sizeUpAnim }],
            }}
          />
        </View>
      ) : (
        // Actual Body
        <View style={styles.container}>
          {status == "pickingUp" && (
            <Checker
              bowls={pickUpBowls}
              handlePickUpComplete={handlePickUpComplete}
            />
          )}
          {/* Map */}
          <MapView
            ref={map}
            style={styles.map}
            region={initRegion}
            onPanDrag={handleMapTouch}
            onUserLocationChange={({ coordinate }) => {
              handleLocationChange(coordinate);
            }}
          >
            <Marker
              coordinate={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
              image={currentLocation}
              pinColor="blue"
              onPress={() => {}}
            />
            <Circle
              center={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
              radius={location.coords.accuracy}
              fillColor="rgba(255, 0, 0, 0.1)"
              strokeColor="rgba(255, 0, 0, 0.1)"
            />
            {displayBowls
              .filter((order) => order.collectState == "WAITING")
              .map((order, index) => (
                <Marker
                  key={index}
                  coordinate={{
                    latitude: order.latitude,
                    longitude: order.longitude,
                  }}
                  image={order.dish == "SMALL" ? dishPinSmall : dishPin}
                  onPress={() => handleMarkerPress(order.id)}
                />
              ))}
            {shops
              .filter((shop) => {
                return pickUpBowls.some(
                  (bowl) => bowl.restaurantId == shop.shopId
                );
              })
              .map((shop, index) => (
                <Marker
                  key={index}
                  coordinate={{
                    latitude: shop.shopLocationResponseDto.latitude,
                    longitude: shop.shopLocationResponseDto.longitude,
                  }}
                  image={shopPin}
                />
              ))}
          </MapView>
          {/* Accept Modal */}
          <Modal
            animationType="fade"
            transparent={true}
            visible={accpetModalVisible}
            onRequestClose={() => {
              setAcceptModalVisible(!accpetModalVisible);
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalTitle}>수령 하시겠습니까?</Text>
                <View style={styles.packageContainer}>
                  <Image source={ghost} style={styles.packageIcon} />
                </View>
                <Text style={styles.modalName}>
                  {bowls[selected]?.restaurantName}
                </Text>
                <View style={styles.modalAddressBox}>
                  <Ionicons name="location-sharp" size={24} color="black" />
                  <Text style={styles.modalAddress}>
                    {bowls[selected]?.restaurantAddress}
                  </Text>
                </View>
                <View style={styles.modalButtonContainer}>
                  <TouchableOpacity
                    style={[
                      styles.modalPickUpButton,
                      { backgroundColor: "#EBEBEB" },
                    ]}
                    onPress={() => setAcceptModalVisible(false)}
                  >
                    <Text
                      style={[
                        styles.modalPickUpButtonText,
                        { color: "#B3B3B3" },
                      ]}
                    >
                      취소하기
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.modalPickUpButton}
                    onPress={handlePickUpConfirm}
                  >
                    <Text style={styles.modalPickUpButtonText}>수락하기</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          {/* Finish Model */}
          {/* Success Modal */}
          <Modal
            animationType="fade"
            transparent={true}
            visible={successModalVisible}
            onRequestClose={() => {
              setSuccessModalVisible(!successModalVisible);
            }}
          >
            <SuccessModal
              handleExitReward={handleExitReward}
              handlePickUpCheck={handlePickUpCheck}
            />
          </Modal>

          {/* Search Bar */}
          <View style={styles.searchBarContainer}>
            <View style={styles.searchBar}>
              {backMode ? (
                <TouchableOpacity
                  onPress={() => {
                    Keyboard.dismiss();
                    setBackMode(false);
                  }}
                >
                  <Ionicons name="chevron-back-sharp" size={30} color="black" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => setEmoteCollectionVisible(true)}
                >
                  <Image source={clover} style={styles.searchBarIcon} />
                </TouchableOpacity>
              )}
              <TextInput
                style={styles.searchBarInput}
                placeholder="지역 명, 이름을 입력하세요"
                onEndEditing={handleSearch}
                onFocus={handleTextFocus}
              />
              <Ionicons name="search-outline" size={30} color="black" />
            </View>
          </View>
          {/* Focus on Current Postion Button */}
          <TouchableOpacity
            style={styles.reloadButton}
            onPress={() => updateData()}
          >
            <Ionicons name="reload" size={24} color="black" />
          </TouchableOpacity>

          {/* Slide up */}
          <SlidingUpPanel
            ref={slideUp}
            draggableRange={{
              top:
                height *
                (status == "pickingUp"
                  ? 0.55
                  : status == "showOrder"
                  ? 0.65
                  : 0.5),
              bottom: height * 0.2,
            }}
            allowDragging={draggable}
            onBottomReached={() => {
              setDraggable(true);
            }}
            backdropOpacity={0.4}
            onDragEnd={(position) => {
              if (position > height * 0.45) {
                setDraggable(false);
              }
            }}
          >
            <>
              <View style={styles.slideUpHeader}></View>
              {status == "pickingUp" ? (
                <View style={styles.returnAlertContainer}>
                  <Image source={bicycle} style={styles.returnAlertIcon} />
                  <Text style={styles.returnAlertText}>
                    빈 그릇 반납을 위해 가게로 가고있어요!
                  </Text>
                </View>
              ) : (
                <></>
              )}
              {status == "pickingUp" ? (
                <View style={styles.pickingupContainer}>
                  <ScrollView
                    contentContainerStyle={styles.pickingupScrollContainer}
                    showsVerticalScrollIndicator={false}
                  >
                    {pickUpBowls.map((order, index) => {
                      return (
                        <View key={index} style={styles.pickingupTop}>
                          <View style={{ flex: 1, flexDirection: "row" }}>
                            <View style={styles.restaurantTop}>
                              <Image
                                source={defaultRestIcon}
                                style={styles.restaurantImage}
                              />
                            </View>
                            <View
                              style={{
                                flex: 2,
                                justifyContent: "center",
                                paddingHorizontal: 10,
                                top: -5,
                              }}
                            >
                              <Text style={styles.pickUpName}>
                                {order.restaurantName}
                              </Text>
                              <View style={styles.pickUpAddresss}>
                                <Ionicons
                                  name="location-sharp"
                                  size={18}
                                  color="#727171"
                                />
                                <Text style={styles.pickUpAddressText}>
                                  {order.restaurantAddress}
                                </Text>
                              </View>
                            </View>
                          </View>
                          <View style={{ flex: 1 }}>
                            <ScrollView
                              horizontal
                              showsHorizontalScrollIndicator={false}
                              contentContainerStyle={{
                                marginTop: 10,
                                height: 100,
                              }}
                            >
                              <View style={styles.frame}>
                                <Image
                                  source={Frame0}
                                  style={styles.frameImage}
                                />
                              </View>
                              <View style={styles.frame}>
                                <Image
                                  source={Frame1}
                                  style={styles.frameImage}
                                />
                              </View>
                              <View style={styles.frame}>
                                <Image
                                  source={Frame2}
                                  style={styles.frameImage}
                                />
                              </View>
                              <View style={styles.frame}>
                                <Image
                                  source={Frame3}
                                  style={styles.frameImage}
                                />
                              </View>
                              <View style={styles.frame}>
                                <Image
                                  source={Frame4}
                                  style={styles.frameImage}
                                />
                              </View>
                              <View style={styles.frame}>
                                <Image
                                  source={Frame5}
                                  style={styles.frameImage}
                                />
                              </View>
                            </ScrollView>
                          </View>
                        </View>
                      );
                    })}
                  </ScrollView>
                </View>
              ) : status == "showOrder" ? (
                <View style={styles.slideUpContainer}>
                  <Restaurant
                    info={bowls[selected]}
                    handlePickUp={handlePickUp}
                  />
                </View>
              ) : (
                <View style={styles.locationContainer}>
                  <View style={styles.locationTop}>
                    <Text style={styles.locationTitle}>내 위치</Text>
                    <TouchableOpacity
                      style={styles.locationAddressHolder}
                      onPress={setCurrentPosition}
                    >
                      <Ionicons
                        name="location-sharp"
                        color={"#727171"}
                        size={24}
                      />
                      <Text style={styles.locationAddressText}>
                        {currentAddress}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.nearPickTitle}>내 주변 PICK!</Text>
                  <View style={styles.locationBottom}>
                    <ScrollView
                      horizontal
                      contentContainerStyle={styles.locationBottomScroll}
                    >
                      {displayBowls
                        .filter((bowl) => bowl.collectState == "WAITING")
                        .map((bowl, index) => (
                          <NearPick
                            key={index}
                            info={bowl}
                            handleFocus={handleFocus}
                          />
                        ))}
                    </ScrollView>
                  </View>
                </View>
              )}
            </>
          </SlidingUpPanel>
          {emoteCollectionVisible && (
            <EmoteCollection
              handleBack={handleCollectionBack}
              handleEmoteSelect={() => setEmoteVisible(true)}
            />
          )}
          {emoteVisible && <EmoteDisplay handleBack={handleEmoteBack} />}
        </View>
      )}
    </>
  );
}

// function calcDistance(lat1, lon1, lat2, lon2) {
//   const R = 6371e3; // metres
//   const φ1 = (lat1 * Math.PI) / 180; // φ, λ in radians
//   const φ2 = (lat2 * Math.PI) / 180;
//   const Δφ = ((lat2 - lat1) * Math.PI) / 180;
//   const Δλ = ((lon2 - lon1) * Math.PI) / 180;

//   const a =
//     Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
//     Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

//   const d = R * c; // in metres
//   return d;
// }
