export const getBowls = async () => {
  let res = await fetch("http://10.200.14.206:8080/bowls", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  let data = await res.json();
  return data;
};
