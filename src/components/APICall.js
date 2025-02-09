import axios from "axios";
import { GetAPIUrl } from "../core_utils/utils.js";
import { APIResponse } from "../apicalls/APICallsClasses.js";


export default async function APICall(data, token) {
  var authOptions = {
    method: "post",
    url: GetAPIUrl(),
    data: JSON.stringify(data),
    headers: {
      "accept": "*/*"
    },
    json: true
  };
  const res = await axios(authOptions);
  const response = new APIResponse(res.data);
  return response;
}

