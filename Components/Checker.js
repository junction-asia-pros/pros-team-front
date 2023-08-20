import { useEffect } from "react";
import { checkBowlStatus } from "../RestAPI.js";

export default function Checker({ bowls, handlePickUpComplete }) {
  useEffect(() => {
    const timer = setInterval(async () => {
      if (Array.isArray(bowls)) {
        for (let i = 0; i < bowls.length; i++) {
          try {
            let data;
            data = await checkBowlStatus(bowls[i].id);
            if (data.collectState == "COMPLETE") {
              handlePickUpComplete(data.id);
              i = bowls.length;
            }
          } catch (error) {
            console.log(error);
          }
        }
      }
    }, 3000);
    return () => {
      clearInterval(timer);
    };
  }, []);
  return <></>;
}
