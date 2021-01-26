// TODO
// take nice screenshots for the document
// label disappears at high levels (vis)

// skill value cutoff
let cutoff = 5;

const baseValue = 3;

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
  UXEvalSkills: "UX Evaluation Skills",
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
        value: baseValue,
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

  // bubble hierarchy
  const basicChart = {
    name: "main",
    children: [
      {
        name: "STEM Skills",
        value: baseValue,
        children: [
          {
            name: "Computer Skills",
            value: baseValue,
            color: colors["Computer Skills"],
            children: [
              {
                name: "Programming",
                value: baseValue,
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
            value: baseValue,
            children: [categories["Math"], categories["Statistics"]],
          },
        ],
      },
      categories["UX Evaluation Skills"],
      {
        name: "Visual Skills",
        value: baseValue,
        children: [
          categories["Information Visualization"],
          categories["Art and Drawing"],
        ],
      },
      {
        name: "Teamwork Skills",
        value: baseValue,
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
