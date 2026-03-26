import { Fetcher } from "./fetcher.js";


export class ApiClient {
  path: string = "";

  constructor(path: string) {
    this.path = path;
  }


  fetcher = () => new Fetcher(this.path);

  json = async (res: Response) => await res.json();
}
