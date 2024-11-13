import http from "k6/http";
import { sleep, group } from "k6";
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

const URL = "https://restful-booker.herokuapp.com";

export const options = {
  discardResponseBodies: true,
  scenarios: {
    contacts: {
      executor: "ramping-vus",
      startVUs: 0,
      stages: [
        { duration: "10s", target: 10 }, // ramp up
        { duration: "5s", target: 10 }, // plateau
        { duration: "5s", target: 0 }, // ramp down
      ],
      gracefulRampDown: "3s",
    },
  },
};

export default function () {
  group("Should authenticate user", () => {
    const authPayload = JSON.stringify({
      username: "admin",
      password: "password123",
    });

    const authParams = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    http.post(`${URL}/auth`, authPayload, authParams);
    sleep(1);
  });

  group("Should get bookings", () => {
    const getBookingsParams = {
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
      },
    };

    http.get(`${URL}/booking`);
    sleep(1);

    http.get(`${URL}/booking/392`, getBookingsParams);
    sleep(1);
  });
}

export function handleSummary(data) {
  return {
    "k6-load-tests-report.html": htmlReport(data),
    // stdout: textSummary(data, { indent: " ", enableColors: true }),
  };
}
