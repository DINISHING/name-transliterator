import { useState, memo } from "react";
//import dictData from "./assets/char_phon_simp.json";
import Dinishing from "./assets/dinishing.svg?react";
const footerlinks = [
  { link: "https://github.com/DINISHING/name-transliterator", text: "源碼棚" },
  {
    link: "https://github.com/DINISHING/standards/tree/main/phonetics",
    text: "拼音方案",
  },
  { link: "https://github.com/DINISHING/vocabulary", text: "字音庫" },
];

var dictData;
async function fetchJSON() {
  console.log("Loading dictionary...");
  const response = await fetch(
    "https://dinishing.github.io/vocabulary/char_phon_simp.json"
  );
  const json = await response.json();
  dictData = json;
  console.log("Loaded dictionary.");
}
fetchJSON();

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
              <li>一埭打進大量字符會卡煞瀏覽器</li>
              <li>結果僅畀參考</li>
              <li>
                有啥字音錯誤請去
                <a href="https://github.com/DINISHING/vocabulary">該隻棚</a>
                反饋
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

  const chName = name
    .replace(
      /[^\u{4E00}-\u{9FFF}\u{3400}-\u{4DBF}\u{20000}-\u{2A6DF}\u{2A700}-\u{2B73F}\u{2B740}-\u{2B81F}\u{2B820}-\u{2CEAF}\u{2CEB0}-\u{2EBEF}\u{30000}-\u{3134F}\u{F900}-\u{FAFF}\u{2F800}-\u{2FA1F}，,]/gu,
      ""
    )
    .replace("，", ",");
  if (!chName.length) {
    return null;
  }

  var result = [];

  for (const char of chName) {
    if (char == ",") {
      result.push([","]);
    } else {
      const A = dictData[char];

      result.push(
        A
          ? [...new Set(A.map((item) => item.replace(/\d/g, "")))]
          : ["[未知讀音]"]
      );
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
    [/sh/g, "sH"],
    [/c/g, "cH"],
    [/tz/g, "ts"],
    [/gh/g, ""],

    [/ok/g, "oH"],
    [/uk/g, "ooH"],
    [/ung/g, "oong"],
    [/iu/g, "iui"],
    [/yu/g, "yui"],
    [/(e|i)ng/g, "$1n"],
    [/(e|i)n/g, "$1ng"],
    [/(e|i)k/g, "$1h"],
    [/iae/g, "ie"],
    [/ae/g, "an"],
    [/oe/g, "oen"],
    [/e\b/g, "en"],
    [/ien/g, "iien"],
    [/([ao])h/g, "$1eh"],

    [/ai/g, "ae"],
    [/au/g, "ao"],
    [/ieu/g, "iiu"],
    [/eu/g, "eo"],

    [/u([aeo])/g, "w$1"],
    
    [/ngi([aeou])/g, "ny$1"],
    [/ngi/g, "nyi"],
    [/([kgh])i([aeou])/g, "$1y$2"],
    [/([kgh])i/g, "$1yi"],
    [/(j|H)i([aeou])/g, "$1$2"],
    [/([jHsz])y/g, "$1z"],
    [/([jHsz])ui\b/g, "$1u"],
    [/ii/g, "i"],
    [/H/g, "h"],
    [/(\w)iui/g, "$1ui"],
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
  return result;
}

export default App;
