const fetch = require("node-fetch");
module.exports = async (req, res) => {
    const url =
    "https://opendata.corona.go.jp/api/Covid19JapanAll?dataName=%E6%9D%B1%E4%BA%AC%E9%83%BD";
  const result = await fetch(url);
  const json = await result.json();
  const positive_array = json.itemList.reverse();
  const first_npatients = positive_array[4].npatients;
  positive_array.splice(0, 5);
  const split = (array, n) =>
    array.reduce(
      (a, c, i) =>
        i % n == 0 ? [...a, [c]] : [...a.slice(0, -1), [...a[a.length - 1], c]],
      []
    );
  const splited = split(positive_array, 7);
  const parsed = splited.map((current, index) => {
    const returnArray = current.map((current2, index2) => {
      if (index === 0 && index2 === 0) {
        return {
          date: current2.date,
          name_jp: current2.name_jp,
          npatients: current2.npatients - first_npatients,
        };
      } else if (index2 === 0) {
        return {
          date: current2.date,
          name_jp: current2.name_jp,
          npatients: current2.npatients - splited[index - 1][6].npatients,
        };
      } else {
        return {
          date: current2.date,
          name_jp: current2.name_jp,
          npatients: current2.npatients - current[index2 - 1].npatients,
        };
      }
    });
    const open = returnArray[0].npatients;
    const high = Math.max(...returnArray.map((current) => current.npatients));
    const low = Math.min(...returnArray.map((current) => current.npatients));
    const close = returnArray[returnArray.length - 1].npatients;
    return {
      time: returnArray[0].date,
      open,
      high,
      low,
      close,
    };
  });
  res.json({result: parsed});
};



/**{ time: '2018-12-19', open: 141.77, high: 170.39, low: 120.25, close: 145.72 },
            { time: '2018-12-26', open: 145.72, high: 147.99, low: 100.11, close: 108.19 }, */
