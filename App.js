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
} from "react-native";
import { useState, useEffect, useRef } from "react";

//images and icons
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import currentLocation from "./assets/current-location.png";
import { Feather } from "@expo/vector-icons";
import packageIcon from "./assets/Package.png";
import packageShadow from "./assets/PackageShadow.png";
import defaultRestIcon from "./assets/defaultRestIcon.png";
import dishPin from "./assets/DishPin.png";
import dishPinSmall from "./assets/DishPinSmall.png";
import ghost from "./assets/Ghost.png";

import SlidingUpPanel from "rn-sliding-up-panel";

import * as Location from "expo-location";
import { TextInput } from "react-native";
import { getBowls } from "./RestAPI";

//components
import Restaurant from "./Components/Restaurant.js";
import NearPick from "./Components/NearPick";

import { styles } from "./AppStyles";

const { width, height } = Dimensions.get("window");

const ASPECT_RATIO = width / height;

export default function App() {
  const [location, setLocation] = useState(null);
  const [initRegion, setInitRegion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [displayOrders, setDisplayOrders] = useState([]); // [0, 1, 2
  const [selected, setSelected] = useState(0); // [0, 1, 2
  const [pickUpOrder, setPickUpOrder] = useState(null); // [0, 1, 2
  const [searchWord, setSearchWord] = useState("");
  const [currentAddress, setCurrentAddress] = useState("");

  const [accpetModalVisible, setAcceptModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);

  const [draggable, setDraggable] = useState(true);
  const [status, setStatus] = useState("");

  const map = useRef(null);
  const slideUp = useRef(null);
  const pickupUp = useRef(null);

  const setCurrentPosition = () => {
    (async () => {
      let _location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setLocation(_location);

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
    slideUp.current.show();
    setSelected(key);
    setStatus("showOrder");
    const newRegion = {
      latitude: orders[key].latitude,
      longitude: orders[key].longitude,
      latitudeDelta: 0.0082,
      longitudeDelta: 0.0082 * ASPECT_RATIO,
    };
    map.current.animateToRegion(newRegion, 1000);
  };

  const handleSearch = (e) => {
    setSearchWord(e.nativeEvent.text);
  };

  const handleMapTouch = () => {
    console.log("map touched");
    if (status == "pickingUp") return;
    setStatus("");
  };

  const handleFocus = (info) => {
    console.log(slideUp.current.draggableRange);
    slideUp.current.show(1000, 1);
    if (map.current == null) return;
    if (slideUp.current == null) return;
    const newRegion = {
      latitude: info.latitude,
      longitude: info.longitude,
      latitudeDelta: 0.0102,
      longitudeDelta: 0.0102 * ASPECT_RATIO,
    };
    map.current.animateToRegion(newRegion, 1000);
    handleMarkerPress(info.id - 1);
  };

  handleLocationChange = (coordinate) => {
    setLocation({
      coords: {
        latitude: coordinate.latitude,
        longitude: coordinate.longitude,
        accuracy: coordinate.accuracy,
      },
    });
    if (status == "pickingUp") {
      const distance = calcDistance(
        coordinate.latitude,
        coordinate.longitude,
        pickUpOrder.latitude,
        pickUpOrder.longitude
      );
      console.log(distance);
      if (distance < 100) {
        setStatus("returning");
        setDraggable(false);
        setTimeout(() => {
          setStatus("");
          setDraggable(true);
          slideUp.current.hide();
        }, 3000);
      }
    }
  };

  useEffect(() => {
    if (searchWord === "") {
      setDisplayOrders(orders);
    } else {
      const newOrders = orders.filter((order) => {
        return order.restaurantName.includes(searchWord);
      });
      setDisplayOrders(newOrders);
    }
  }, [searchWord]);

  const handlePickUp = () => {
    setAcceptModalVisible(true);
  };

  const handlePickUpConfirm = () => {
    setTimeout(() => {
      slideUp.current.hide();
    }, 1000);
    setAcceptModalVisible(false);
    setStatus("pickingUp");
    setPickUpOrder(orders[selected]);
  };

  useEffect(() => {
    setAcceptModalVisible(false);
    const dummyData = [
      {
        id: 1,
        longitude: 129.0646,
        latitude: 35.1908,
        openAddress1: "부산광역시 연제구 중앙대로 1001",
        openAddress2: "중앙대로 1001 116번길",
        restaurantName: "홍콩반점 센텀시티점",
        restaurantAddress: "부산광역시 연제구 센텀시티대로",
        collectionSstatus: false,
        type: "12345",
        weight: 1,
        dish: "SMALL",
      },
      {
        id: 2,
        longitude: 129.069,
        latitude: 35.1988,
        openAddress1: "부산광역시 연제구 중앙대로 1001",
        openAddress2: "301호",
        restaurantName: "홍콩반점 센텀시티점 2호점",
        restaurantAddress: "부산광역시 연제구 센텀대로 1004",
        collectionSstatus: false,
        type: "123",
        weight: 1,
        dish: "LARGE",
      },
    ];

    (async () => {
      setLoading(true);

      // setOrders(dummyData);
      // setDisplayOrders(dummyData);

      let data = await getBowls();
      setOrders(data);
      setDisplayOrders(data);

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let _location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setLocation(_location);

      let _address = await Location.reverseGeocodeAsync({
        latitude: _location.coords.latitude,
        longitude: _location.coords.longitude,
      });
      let fomattedAddress =
        _address[0].region + " " + _address[0].street + " " + _address[0].name;
      setCurrentAddress(fomattedAddress);

      const Region = {
        latitude: _location.coords.latitude,
        longitude: _location.coords.longitude,
        latitudeDelta: 0.0102,
        longitudeDelta: 0.0102 * ASPECT_RATIO,
      };

      setInitRegion(Region);

      setLoading(false);
    })();
  }, []);

  return (
    <>
      {loading ? (
        // <View style={styles.container}>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text>Loading...</Text>
        </View>
      ) : (
        // Actual Body
        <View style={styles.container}>
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
            {displayOrders.map((order, index) => (
              <Marker
                key={index}
                coordinate={{
                  latitude: order.latitude,
                  longitude: order.longitude,
                }}
                image={order.dish == "SMALL" ? dishPinSmall : dishPin}
                onPress={() => handleMarkerPress(index)}
              />
            ))}
          </MapView>
          {/* Accept Modal */}
          <Modal
            animationType="fade"
            transparent={true}
            visible={accpetModalVisible}
            onRequestClose={() => {
              Alert.alert("Modal has been closed.");
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
                  {orders[selected]?.restaurantName}
                </Text>
                <View style={styles.modalAddressBox}>
                  <Ionicons name="location-sharp" size={24} color="black" />
                  <Text style={styles.modalAddress}>
                    {orders[selected]?.restaurantAddress}
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
              Alert.alert("Modal has been closed.");
              setSuccessModalVisible(!successModalVisible);
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalTitle}>수령 하시겠습니까?</Text>
                <View style={styles.packageContainer}>
                  <Image source={ghost} style={styles.packageIcon} />
                </View>
                <Text style={styles.modalName}>
                  {orders[selected]?.restaurantName}
                </Text>
                <View style={styles.modalAddressBox}>
                  <Ionicons name="location-sharp" size={24} color="black" />
                  <Text style={styles.modalAddress}>
                    {orders[selected]?.restaurantAddress}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.modalPickUpButton}
                  onPress={handlePickUpConfirm}
                >
                  <Text style={styles.modalPickUpButtonText}>Pick Up</Text>
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity
              style={styles.modalExitButton}
              onPress={() => setAcceptModalVisible(false)}
            >
              <Feather name="x" size={20} color="black" />
            </TouchableOpacity>
          </Modal>

          {/* Search Bar */}
          <View style={styles.searchBarContainer}>
            <View style={styles.searchBar}>
              <TextInput
                style={styles.searchBarInput}
                placeholder="Search"
                onEndEditing={handleSearch}
              />
              <Ionicons name="search-outline" size={40} color="black" />
            </View>
          </View>
          {/* Focus on Current Postion Button */}
          <TouchableOpacity
            style={styles.button}
            onPress={() => setCurrentPosition()}
          >
            <Ionicons name="location" size={30} color="black" />
          </TouchableOpacity>
          {status == "pickingUp" ? (
            <View style={styles.returnAlertContainer}>
              <Text style={styles.returnAlertText}>
                빈 그릇 반납을 위해 가게로 가고있어요!
              </Text>
            </View>
          ) : (
            <></>
          )}

          {/* Slide up */}
          <SlidingUpPanel
            ref={slideUp}
            draggableRange={{
              top:
                height *
                (status == "pickingUp"
                  ? 0.25
                  : status == "showOrder"
                  ? 0.6
                  : 0.5),
              bottom: height * 0.2,
            }}
            allowDragging={draggable}
            onBottomReached={() => {
              setDraggable(true);
            }}
            backdropOpacity={0.4}
            onDragEnd={(position) => {
              if (position < height * 0.5) {
                setDraggable(false);
              }
            }}
          >
            <>
              <View style={styles.slideUpHeader}></View>
              {status == "pickingUp" ? (
                <View style={styles.pickingupContainer}>
                  <View style={styles.pickingupTop}>
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
                        paddingHorizontal: 15,
                      }}
                    >
                      <Text style={styles.pickUpName}>
                        {pickUpOrder.restaurantName}
                      </Text>
                      <View style={styles.pickUpAddresss}>
                        <Ionicons
                          name="location-sharp"
                          size={18}
                          color="#727171"
                        />
                        <Text style={styles.pickUpAddressText}>
                          {pickUpOrder.restaurantAddress}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.pickingupBody}></View>
                </View>
              ) : status == "showOrder" ? (
                <View style={styles.slideUpContainer}>
                  <Restaurant
                    info={orders[selected]}
                    handlePickUp={handlePickUp}
                  />
                </View>
              ) : (
                <View style={styles.locationContainer}>
                  <View style={styles.locationTop}>
                    <Text style={styles.locationTitle}>내 위치</Text>
                    <View style={styles.locationAddressHolder}>
                      <Ionicons
                        name="location-sharp"
                        color={"#727171"}
                        size={24}
                      />
                      <Text style={styles.locationAddressText}>
                        {currentAddress}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.nearPickTitle}>내 주변 PICK!</Text>
                  <View style={styles.locationBottom}>
                    <ScrollView
                      horizontal
                      contentContainerStyle={styles.locationBottomScroll}
                    >
                      {orders.map((order, index) => (
                        <NearPick
                          key={index}
                          info={order}
                          handleFocus={handleFocus}
                        />
                      ))}
                    </ScrollView>
                  </View>
                </View>
              )}
            </>
          </SlidingUpPanel>
        </View>
      )}
    </>
  );
}

function calcDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // metres
  const φ1 = (lat1 * Math.PI) / 180; // φ, λ in radians
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const d = R * c; // in metres
  return d;
}
