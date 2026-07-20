const internshipBasePopulate = [
  {
    path: "company",
    select: "name email role"
  },
  {
    path: "applicants",
    select: "student internship status createdAt updatedAt",
    populate: {
      path: "student",
      select: "name email role"
    }
  }
];

const applicationBasePopulate = [
  {
    path: "student",
    select: "name email role"
  },
  {
    path: "internship",
    populate: {
      path: "company",
      select: "name email role"
    }
  }
];

module.exports = {
  applicationBasePopulate,
  internshipBasePopulate
};
