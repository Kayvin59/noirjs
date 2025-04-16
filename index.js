import { compile, createFileManager } from "@noir-lang/noir_wasm";

import { UltraHonkBackend } from '@aztec/bb.js';
import { Noir } from '@noir-lang/noir_js';

import initACVM from "@noir-lang/acvm_js";
import acvm from "@noir-lang/acvm_js/web/acvm_js_bg.wasm?url";
import initNoirC from "@noir-lang/noirc_abi";
import noirc from "@noir-lang/noirc_abi/web/noirc_abi_wasm_bg.wasm?url";
await Promise.all([initACVM(fetch(acvm)), initNoirC(fetch(noirc))]);

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
        // execute circuit to get witness, then submit it to Barretenberg
        const { program } = await getCircuit();
        const noir = new Noir(program);
        const backend = new UltraHonkBackend(program.bytecode);

        const age = document.getElementById("age").value;
        show("logs", "Generating witness... ⏳");
        // Proving
        const { witness } = await noir.execute({ age });
        show("logs", "Generated witness... ✅");

        show("logs", "Generating proof... ⏳");
        // Calculate the proof
        const proof = await backend.generateProof(witness);
        show("logs", "Generated proof... ✅");
        show("results", proof.proof);

    } catch {
     show("logs", "Oh 💔");
    }
});
   