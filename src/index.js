var krkt = "oai_dc:dc";

new gridjs.Grid({
    sort: true,
    search: true,
    pagination: false,
    columns: ["Location", "Change Frequency", "Priority"],
    server: {
        url: 'https://kadirkatirci.github.io/oai-pmh_api-table/src/api.xml',
        handle: (res) => {
          return res.text().then(str => (new window.DOMParser()).parseFromString(str, "text/xml"));
        },
        then: data => {
          return Array.from(data.querySelectorAll(' +  krkt  + '))
            .map(row => [
              row.querySelector('type').innerHTML,
              row.querySelector('format').innerHTML,
              row.querySelector('language').innerHTML,
            ]);
      }
    }
  }).render(document.getElementById("wrapper"));
  
  console.log(res);
  console.log(data);