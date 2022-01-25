'use strict';

const fs = require('fs');
const axios = require('axios');
const csv = require('csvtojson');

const url =
  'https://covid19.mhlw.go.jp/public/opendata/newly_confirmed_cases_daily.csv';

function fetchData() {
  return axios({
    method: 'get',
    url: url,
    responseType: 'stream',
  }).then((response) => {
    return new Promise((resolve, reject) => {
      const rows = [];
      response.data.pipe(
        csv().subscribe(
          (json) => {
            rows.push(json);
          },
          () => {
            reject();
          },
          () => {
            resolve(
              fs.writeFileSync(
                'data/latest_new_cases.json',
                JSON.stringify(rows.pop()),
                'utf-8'
              )
            );
          }
        )
      );
    });
  });
}

function createGeojson() {
  const jsonObject = JSON.parse(
    fs.readFileSync('data/latest_new_cases.json', 'utf8')
  );
  const template = JSON.parse(
    fs.readFileSync('data/geojson-template.json', 'utf8')
  );

  const arr = [];

  for (const property in jsonObject) {
    for (const item of template) {
      if (property === item.properties.id) {
        item.properties.date = jsonObject['Date'];
        item.properties.newCases = jsonObject[property];
        const data = { ...item };
        arr.push(data);
      }
    }
  }

  fs.writeFileSync(
    'data/geojson.js',
    'const newCases = ' + JSON.stringify(arr),
    'utf-8'
  );
}

async function main() {
  await fetchData();
  createGeojson();
}

main();
