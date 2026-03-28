import { ApiClient as Client } from "@my-app/react-fetch-wrapper"
import z from "zod";

const schema = z.literal("dummy");
const body = "post_dummy";

const errorHandler = (err: Error) => {
  console.error(err);
};


export const ApiClient = () => {
  const client = new Client("https://example.com/");
  const userClient = client.route("/user");

  const user = {
    get: userClient.get({ schema }).catch(errorHandler),
    post: userClient.post({ schema, body })
  };


  return { user };
}
