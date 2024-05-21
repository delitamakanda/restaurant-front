import { createContext } from "react";

export interface ServerStyleContextData {
    key: string;
    ids: Array<string>;
    css: string;
}

const ServerStyleSContext = createContext<null | ServerStyleContextData[]>(null);

export default ServerStyleSContext;
