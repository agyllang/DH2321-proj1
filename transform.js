// TODO
// change the border colour (bubbles) -a
// fix the value that appears on the label -s
// host visualization online - Github pages -a
// add the number of the skill on the bubble -a
// change the border colour (bubbles) -a


// skill value cutoff
let cutoff = 5;

// person skills to category
const translation = {
  infoVisSkills: "Information Visualization",
  statisticSkills: "Statistics",
  mathSkills: "Math",
  artSkills: "Art and Drawing",
  computerSkills: "Computer Usage",
  programmingSkills: "General Programming",
  compGraphProgSkills: "CG Programming",
  HCIprogSkills: "HCI Programming",
  UXEvalSkills: "UX Evaluation",
  communicationSkills: "Communication",
  collaborationSkills: "Collaboration",
  codeRepoSkills: "Version Control",
};

const makePerson = (person, value, cutoff) => ({
  name: person.alias,
  skill: value,
  value: (value - cutoff + 1) * 3,
  color: colors.person[person.major] || colors.person.other,
  data: { ...person },
});

const filterBySkill = (person, cutoff) =>
  Object.entries(person).filter(
    ([k, v]) => k.includes("Skills") && v >= cutoff
  );

const loadData = () => {
  // list of all categories
  let categories = Object.values(translation).reduce(
    (acc, name) => ({
      ...acc,
      [name]: {
        name,
        children: [],
      },
    }),
    {}
  );

  // place each person into relevant categories
  people.forEach((person) => {
    const relSkills = filterBySkill(person, cutoff);
    relSkills.forEach(([skill, val]) => {
      const category = translation[skill];
      categories[category].children.push(makePerson(person, val, cutoff));
    });
  });

  categories = Object.entries(categories)
    .filter(([_, v]) => v.children.length > 0)
    .reduce((acc, [k,v]) => ({ ...acc, [k]: v }), {});

  // bubble hierarchy
  const basicChart = {
    name: "main",
    children: [
      {
        name: "STEM Skills",
        children: [
          {
            name: "Computer Skills",
            color: colors["Computer Skills"],
            children: [
              {
                name: "Programming",
                children: [
                  categories["General Programming"],
                  categories["CG Programming"],
                  categories["HCI Programming"],
                ],
              },
              categories["Version Control"],
              categories["Computer Usage"],
            ],
          },
          {
            name: "Mathematics",
            children: [categories["Math"], categories["Statistics"]],
          },
        ],
      },
      categories["UX Evaluation Skills"],
      {
        name: "Visual Skills",
        children: [
          categories["Information Visualization"],
          categories["Art and Drawing"],
        ],
      },
      {
        name: "Teamwork Skills",
        children: [categories["Communication"], categories["Collaboration"]],
      },
    ],
  };

  const applyColors = (chart) => ({
    color: colors[chart.name] || "white",
    ...chart,
    ...(chart.children ? { children: chart.children.filter(c => c !== undefined).map(applyColors) } : {}),
  });

  return applyColors(basicChart);
};
