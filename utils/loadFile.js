const load = (url, mapFiller) => {
  const xmlhttp = new XMLHttpRequest();

  xmlhttp.onload = () => {
    if (xmlhttp.status == 200) {
      let data = JSON.parse(xmlhttp.responseText);
      mapFiller(data);
    } else {
      console.log(xmlhttp.statusText);
    }
  };

  xmlhttp.open("GET", url);
  xmlhttp.send();
};
