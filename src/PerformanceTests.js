import { check, group } from "k6";
import { Rate, Trend } from "k6/metrics";
import http, { request } from "k6/http";
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

const requestSuccess = new Rate("successRate");
const URL = "https://restful-booker.herokuapp.com";

var authResponse = "";

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

    authResponse = http.post(`${URL}/auth`, authPayload, authParams);

    requestSuccess.add(authResponse.status === 200);

    check(authResponse, {
      "Auth: status was 200": (r) => r.status === 200,
    });
  });

  group("Should manage bookings - CRUD", () => {
    const createBookingPayload = {
      firstname: "João",
      lastname: "Pedro",
      totalprice: 100,
      depositpaid: true,
      bookingdates: {
        checkin: "2024-10-12",
        checkout: "2024-10-17",
      },
      additionalneeds: "No additional needs",
    };

    const createBookingParams = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };

    const createBookingResponse = http.post(
      `${URL}/booking`,
      JSON.stringify(createBookingPayload),
      createBookingParams
    );

    requestSuccess.add(createBookingResponse.status === 200);

    check(createBookingResponse, {
      "Create Booking: status was 200": (r) => r.status === 200,
    });
  });
}

export function handleSummary(data) {
  return {
    "k6-performance-tests-report.html": htmlReport(data),
    // stdout: textSummary(data, { indent: " ", enableColors: true }),
  };
}
