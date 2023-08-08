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
        return Array.from(data.querySelectorAll('oai_dc')).map((row) => [
          row.querySelector('type').innerHTML,
          row.querySelector('language').innerHTML,
          row.querySelector('format').innerHTML
        ]);
      }
    }
  }).render(document.getElementById("wrapper"));
  
  console.log(res);
  console.log(data);