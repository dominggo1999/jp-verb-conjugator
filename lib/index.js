import KuroshiroModule from 'kuroshiro';
import KuromojiAnalyzer from 'kuroshiro-analyzer-kuromoji';
import forms from './forms.js';
import kuruForm from './kuruForm.js';

const Kuroshiro = KuroshiroModule.default || KuroshiroModule;

const kuroshiro = new Kuroshiro();
const analyzer = new KuromojiAnalyzer();

const initConjugator = async () => {
  await kuroshiro.init(analyzer);
};

const verbTypes = ['v5u', 'v5k', 'v5g', 'v5s', 'v5t', 'v5m', 'v5b', 'v5n', 'v5r', 'v1'];
const verbEndings = ['う', 'く', 'ぐ', 'す', 'つ', 'む', 'ぶ', 'ぬ', 'る', 'る'];

const removeLastChar = (str) => {
  const temp = str.split('');
  temp.pop();
  return temp.join('');
};

const createInflections = (basicForm, index) => {
  // Just test
  const root = removeLastChar(basicForm);

  const results = forms.map((item) => {
    const variationsResult = {};

    Object.keys(item).forEach((key) => {
      if(key !== 'name') {
        variationsResult[key] = root + item[key][index];
      }
    });

    return {
      name: item.name,
      ...variationsResult,
    };
  });

  console.log(results);
};

const createInflectionsIrregular = (target) => {
  if(target === '来る') {
    console.log(kuruForm);
  }

  if(target.indexOf('する') > -1) {
    console.log('suru form');
  }
};

const getVerbType = (conjugatedType, basicForm) => {
  const type = conjugatedType.split('・')[0];

  // Ichidan
  if (type === '一段') {
    return 'v1';
  }

  // Godan
  if (type === '五段') {
    const lastChar = basicForm.split('')[basicForm.length - 1];
    const index = verbEndings.indexOf(lastChar);
    return verbTypes[index];
  }
};

const conjugate = async (target) => {
  const tokens = await analyzer.parse(target);
  const firstToken = await tokens[0];
  const basicForm = firstToken.basic_form;
  const conjugatedType = firstToken.conjugated_type;
  const verbType = getVerbType(conjugatedType, basicForm);

  if(verbType) {
    const typeIndex = verbTypes.indexOf(verbType);
    createInflections(basicForm, typeIndex);
  }else{
    createInflectionsIrregular(target);
  }
};

export { initConjugator, conjugate };
