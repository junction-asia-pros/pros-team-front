import AsyncStorage from "@react-native-async-storage/async-storage";

export const getUserKey = async () => {
  try {
    let userKey = await AsyncStorage.getItem("userKey");
    if (userKey !== null) {
      userKey = Math.floor(Math.random() * 1000000000);
      AsyncStorage.setItem("userKey", userKey);
    }
    return userKey;
  } catch (error) {
    console.log(error);
  }
  return null;
};

export const getBowlInfo = async () => {
  // return [
  //   {
  //     id: 1,
  //     longitude: 129.0646,
  //     latitude: 35.1908,
  //     openAddress1: "부산광역시 연제구 중앙대로 1001",
  //     openAddress2: "중앙대로 1001 116번길",
  //     restaurantName: "홍콩반점 센텀시티점",
  //     restaurantAddress: "부산광역시 연제구 센텀시티대로",
  //     collectionSstatus: "COLLECTING",
  //     collector: "device001",
  //     type: "12345",
  //     weight: 1,
  //     dish: "SMALL",
  //   },
  //   {
  //     id: 2,
  //     longitude: 129.069,
  //     latitude: 35.1988,
  //     openAddress1: "부산광역시 연제구 중앙대로 1001",
  //     openAddress2: "301호",
  //     restaurantName: "홍콩반점 센텀시티점 2호점",
  //     restaurantAddress: "부산광역시 연제구 센텀대로 1004",
  //     collectionSstatus: false,
  //     type: "123",
  //     weight: 1,
  //     dish: "LARGE",
  //   },
  // ];
  try {
    let res = await fetch("http://10.200.14.206:8080/bowls", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    let data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
    console.log("fails");
  }
  return [];
};

export const acceptBowl = async (bowl, userKey) => {
  try {
    // let newBowl = {
    //   id: bowl.id,
    //   longitude: bowl.longitude,
    //   latitude: bowl.latitude,
    //   orderAddress1: bowl.orderAddress1,
    //   orderAddress2: bowl.orderAddress2,
    //   restaurantName: bowl.restaurantName,
    //   restaurantAddress: bowl.restaurantAddress,
    //   collectionStatus: false,
    //   collectorKey: userKey,
    //   collectState: "COLLECTING",
    //   type: bowl.type,
    //   weight: bowl.weight,
    //   dish: bowl.dish,
    // };
    console.log(bowl);
    let res = await fetch(
      `http://10.200.14.206:8080/bowls/${bowl.id}?collectState=COLLECTING`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return res;
  } catch (error) {
    console.log("fails");
    console.log(error);
  }
  return false;
};

export const checkBowlStatus = async (bowlId) => {
  try {
    let res = await fetch("http://10.200.14.206:8080/bowls/" + bowlId, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    let data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getShops = async () => {
  try {
    let res = await fetch("http://10.200.14.206:8080/shop", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    let data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
  return [];
};

export const getImages = async () => {
  try {
    let res = await fetch("http://10.200.14.206:8080/s3/get/1");
    let text = await res.text();
    return text;
  } catch (error) {
    console.log(error);
  }
  return false;
};

export const setVisible = async (restID) => {
  try {
    let res = await fetch(
      "http://10.200.14.206:8080/shop/visible?restaurantId=" + restID,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return res;
  } catch (error) {
    console.log(error);
  }
  return false;
};
