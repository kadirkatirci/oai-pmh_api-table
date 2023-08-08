new gridjs.Grid({
    sort: true,
    search: true,
    pagination: true,
    columns: ["Location", "Change Frequency", "Priority"],
    server: {
      url:
        "https://kadirkatirci.github.io/oai-pmh_api-table/src/api.xml",
      handle: (res) => {
        return res
          .text()
          .then((str) => new window.DOMParser().parseFromString(str, "text/xml"));
      },
      then: (data) => {
        return Array.from(data.querySelectorAll("oai_dc:dc")).map((row) => [
          row.querySelector("dc:type").innerHTML,
          row.querySelector("dc:language").innerHTML,
          row.querySelector("dc:format").innerHTML
        ]);
      }
    }
  }).render(document.getElementById("wrapper"));
  
  console.log(res);
  console.log(data);