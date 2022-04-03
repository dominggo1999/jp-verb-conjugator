const KuroshiroModule = require('kuroshiro');
const KuromojiAnalyzer = require('kuroshiro-analyzer-kuromoji');
const v5u = require('./forms/v5u.json');
const v5k = require('./forms/v5k.json');
const v5g = require('./forms/v5g.json');
const v5s = require('./forms/v5s.json');
const v5t = require('./forms/v5t.json');
const v5m = require('./forms/v5m.json');
const v5b = require('./forms/v5b.json');
const v5n = require('./forms/v5n.json');
const v5r = require('./forms/v5r.json');
const v1 = require('./forms/v1.json');
const vk = require('./forms/vk.json');
const vs = require('./forms/vs.json');

const forms = {
  v5u, v5k, v5g, v5s, v5t, v5m, v5b, v5n, v5r, v1, vk, vs,
};

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

const combineRootWithEndings = (root, endings) => {
  return endings.map((item) => {
    Object.keys(item).forEach((key) => {
      if(key !== 'name') {
        item[key] = item[key].map((ending) => {
          return {
            ...ending,
            w: root + ending.w,
          };
        });

        // Return empty array form doesn't exist
        item.plain = item.plain || [];
        item.formal = item.formal || [];
      }
    });

    return item;
  });
};

const createInflections = (basicForm, index) => {
  const root = removeLastChar(basicForm);
  const verbType = verbTypes[index];

  return combineRootWithEndings(root, forms[verbType]);
};

const createInflectionsIrregular = (target) => {
  // Kuru form
  if(target === '来る') {
    return forms.vk;
  }

  // Suru form (ended with する)
  if(target.indexOf('する') === target.length - 2) {
    const root = target
      .split('')
      .slice(0, target.length - 2)
      .join('');

    return combineRootWithEndings(root, forms.vs);
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
    return createInflections(basicForm, typeIndex);
  }

  return createInflectionsIrregular(target);
};

module.exports = { initConjugator, conjugate };
