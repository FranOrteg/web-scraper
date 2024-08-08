const axios = require('axios');
const cheerio = require('cheerio');

const url = 'https://www.lotocrack.es/resultados/laprimitiva/historico/resultados-1985/'; 

axios.get(url)
  .then(response => {
    const html = response.data;
    const $ = cheerio.load(html);

    const resultados = [];

    $('table#tablepress-pr-dh-1985 tbody tr').each((index, element) => {
      const fecha = $(element).find('td.column-2').text().trim();
      const numeros = [
        $(element).find('td.column-3').text().trim(),
        $(element).find('td.column-4').text().trim(),
        $(element).find('td.column-5').text().trim(),
        $(element).find('td.column-6').text().trim(),
        $(element).find('td.column-7').text().trim(),
        $(element).find('td.column-8').text().trim()
      ];
      const complementario = $(element).find('td.column-9').text().trim();

      if (fecha && numeros.length === 6 && complementario) {
        resultados.push({ fecha, numeros, complementario });
      }
    });

    console.log(resultados);
  })
  .catch(error => {
    console.error(`Error: ${error}`);
  });
