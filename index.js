import { compile, createFileManager } from "@noir-lang/noir_wasm";

import nargoToml from "./circuit/Nargo.toml?url";
import main from "./circuit/src/main.nr?url";

// Compiling on the browser
export async function getCircuit() {
    const fm = createFileManager("/");
    const { body } = await fetch(main);
    const { body: nargoTomlBody } = await fetch(nargoToml);
   
    fm.writeFile("./src/main.nr", body);
    fm.writeFile("./Nargo.toml", nargoTomlBody);
    return await compile(fm);
}

const show = (id, content) => {
    const container = document.getElementById(id);
    container.appendChild(document.createTextNode(content));
    container.appendChild(document.createElement("br"));
};
   
   document.getElementById("submit").addEventListener("click", async () => {
    try {
     // noir goes here
    } catch {
     show("logs", "Oh 💔");
    }
});
   