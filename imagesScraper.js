const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const url = 'https://www.zalando.es/zapatos-abiertos-hombre-rebajas/';

axios.get(url)
  .then(response => {
    const html = response.data;
    const $ = cheerio.load(html);

    const result = [];

    $('article.z5x6ht._0xLoFW.JT3_zV.mo6ZnF._78xIQ-').each((index, element) => {
      const title = $(element).find('h3.sDq_FX.lystZ1.FxZV-M.HlZ_Tf.ZkIJC-.r9BRio.qXofat.EKabf7').text().trim();
      const price = $(element).find('span.sDq_FX.lystZ1.dgII7d.Km7l2y').text().trim();
      const imageUrl = $(element).find('img.sDq_FX.lystZ1.FxZV-M._2Pvyxl.JT3_zV.EKabf7.mo6ZnF._1RurXL.mo6ZnF._7ZONEy').attr('src').trim();

      if (title && price && imageUrl) {
        result.push({ title, price, imageUrl });
      }
    });

    // Generar HTML
    const generateHTML = (data) => {
      let htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Scraped Products</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f4f4f4; }
            .product { margin: 20px; padding: 20px; border: 1px solid #ddd; border-radius: 5px; background-color: #fff; }
            .product img { max-width: 200px; display: block; margin-bottom: 10px; }
            .product h2 { font-size: 1.5em; margin: 0 0 10px; }
            .product p { margin: 0 0 10px; }
          </style>
        </head>
        <body>
          <h1>Scraped Products</h1>
          <div class="products">
      `;

      data.forEach(item => {
        htmlContent += `
          <div class="product">
            <h2>${item.title}</h2>
            <p>Price: ${item.price}</p>
            <img src="${item.imageUrl}" alt="${item.title}">
          </div>
        `;
      });

      htmlContent += `
          </div>
        </body>
        </html>
      `;

      return htmlContent;
    };

    // Crear archivo HTML
    const htmlx = generateHTML(result);
    fs.writeFileSync('index.html', htmlx, 'utf8');
    console.log('HTML file generated successfully.');

  })
  .catch(error => {
    console.error(`Error: ${error}`);
  });
