import { useState, memo } from "react";
import dictData from "./assets/char_phon_simp.json";
import Dinishing from "./assets/dinishing.svg?react";
const footerlinks = [
  { link: "https://github.com/DINISHING/name-transliterator", text: "原始碼" },
  {
    link: "https://github.com/DINISHING/standards/tree/main/phonetics",
    text: "拼音方案",
  },
  { link: "https://github.com/vocabulary", text: "字音庫" },
];

function App() {
  const [name, setName] = useState("");
  const [name1, setName1] = useState("");
  const [spelling, setSpelling] = useState(false);
  return (
    <>
      <div className="d-flex px-3 pt-5 align-items-center">
        <div className="col-md-6 col-lg-4 mx-auto">
          <h1>吳語姓名轉寫系統</h1>
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
            <button
              className="btn btn-outline-primary"
              type="button"
              onClick={() => {
                setName1(name);
              }}
            >
              轉換
            </button>
          </div>
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              role="switch"
              id="flexSwitchCheckDefault"
              checked={spelling}
              onChange={(e) => {
                setSpelling(!spelling);
              }}
            />
            <label
              className="form-check-label"
              htmlFor="flexSwitchCheckDefault"
            >
              標準拼寫／教會式
            </label>
          </div>
          <div className="my-3">
            <Romanization name={name1} spelling={spelling} />
          </div>
          <div className="alert alert-primary" role="alert">
            <ul>
              <li>請輸入正體漢字，簡體字會尋弗着</li>
              <li>一次輸入大量字數會卡死瀏覽器</li>
              <li>結果僅供參考</li>
              <li>
                任何字音錯誤請到
                <a href="https://github.com/DINISHING/vocabulary">該個倉庫</a>反饋
              </li>
            </ul>
          </div>
          <hr />
          <ul className="nav justify-content-center">
            {footerlinks.map((item) => (
              <li className="nav-item">
                <a className="nav-link" href={item.link}>
                  {item.text}
                </a>
              </li>
            ))}
            <li className="nav-item">
              <a className="nav-link" href="https://github.com/DINISHING/">
                <Dinishing id="dns" />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

const Romanization = memo(function Romanization({ name, spelling }) {
  if (!name) {
    return null;
  }
  const romanizationList = lookupRomanization(name);
  console.log(romanizationList);
  if (!romanizationList) {
    return null;
  }
  const listItems = romanizationList.map((rom) => (
    <li className="list-group-item">
      {capitalizeWords(spelling ? piauciunToKauwei(rom) : rom)}
    </li>
  ));
  return <ul className="list-group">{listItems}</ul>;
});

function lookupRomanization(name) {
  function generateCombinations(arr, current = []) {
    if (arr.length === 0) {
      return [current];
    }

    const firstArray = arr[0];
    let combinations = [];

    for (let i = 0; i < firstArray.length; i++) {
      const newCurrent = [...current, firstArray[i]];
      combinations = combinations.concat(
        generateCombinations(arr.slice(1), newCurrent)
      );
    }
    return combinations;
  }

  const chName = name.replace(/[^\u4E00-\u9FA5，,]/g, "").replace("，", ",");
  if (!chName.length) {
    return null;
  }

  var result = [];

  for (const char of chName) {
    if (char == ",") {
      result.push([","]);
    } else {
      const A = dictData[char];
      result.push(A ? A : ["[未知讀音]"]);
    }
  }

  return generateCombinations(result).map((innerArray) => innerArray.join(" "));
}

function piauciunToKauwei(inputString) {
  const replacements = [
    [/([ptkc])h/g, "$1"],
    [/(m|n|l|ng)h/g, "$1"],
    [/j/g, "dj"],
    [/zh/g, "j"],
    [/sh/g, "X"],
    [/gh/g, ""],
    [/u([nk])/g, "U$1"],
    [/iu/g, "iui"],
    [/yu/g, "yui"],
    [/U/g, "u"],
    [/ngi([aeou])/g, "ny$1"],
    [/ngi/g, "nyi"],
    [/([kgh])i([aeou])/g, "$1y$2"],
    [/([kgh])i/g, "$1yi"],
    [/([kgh]|ng)u([aeo])/g, "$1w$2"],
    [/([cXj])i([aeou])/g, "$1$2"],
    [/X/g, "sh"],
    [/c/g, "ch"],
    [/tz/g, "ts"],
    [/([hjsz])y/g, "$1z"],
    [/([ao])h/g, "$1eh"],
  ];

  let resultString = inputString;

  for (const replacement of replacements) {
    const regex = replacement[0];
    const replaceWith = replacement[1];
    resultString = resultString.replace(regex, replaceWith);
  }
  return resultString;
}

function capitalizeWords(str) {
  // Split the string into an array of words
  let words = str.split(" ");

  // Capitalize the first letter of each word
  let capitalizedWords = words.map((word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  });

  // Join the capitalized words back into a string
  let result = capitalizedWords.join(" ");
  return result.replace(/\d/g, "");
}

export default App;
