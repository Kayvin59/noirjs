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
   