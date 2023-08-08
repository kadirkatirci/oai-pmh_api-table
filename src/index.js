
const grid = new Grid({
    sort: true,
    search: true,
    pagination: true,
    columns: ['Location', 'Change Frequency', 'Priority'],
    server: {
      url: 'https://gridjs.io/sitemap.xml',
      handle: (res) => {
        return res.text().then(str => (new window.DOMParser()).parseFromString(str, "text/xml"));
      },
      then: data => {
        return Array.from(data.querySelectorAll('url'))
          .map(row => [
            row.querySelector('loc').innerHTML,
            row.querySelector('changefreq').innerHTML,
            row.querySelector('priority').innerHTML,
          ]);
      }
    }
  });

  render(document.getElementById("wrapper"));