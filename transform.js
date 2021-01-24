const cutoff = 5

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
  value: (value - cutoff + 1) * 3,
  color: colors.person[person.major] || colors.person.other,
  data: { ...person }
});

const filterBySkill = (person, cutoff) =>
  Object.entries(person).filter(
    ([k, v]) => k.includes("Skills") && v >= cutoff
  );

const categories = Object.values(translation).reduce(
  (acc, name) => ({
    ...acc,
    [name]: {
      name,
      children: [],
    },
  }),
  {}
);

people.forEach((person) => {
  const relSkills = filterBySkill(person, cutoff);
  relSkills.forEach(([skill, val]) => {
    const category = translation[skill];
    categories[category].children.push(
      makePerson(person, val, cutoff)
    );
  });
});

const basicChart = {
  name: "main",
  children: [
    {
      name: "STEM",
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
    categories["UX Evaluation"],
    {
      name: "Visual",
      children: [
        categories["Information Visualization"],
        categories["Art and Drawing"],
      ],
    },
    {
      name: "Teamwork",
      children: [categories["Communication"], categories["Collaboration"]],
    },
  ],
};

const applyColors = (chart) => ({
  color: colors[chart.name] || "white",
  ...chart,
  ...(chart.children ? { children: chart.children.map(applyColors) } : {}),
});

const data = applyColors(basicChart);
